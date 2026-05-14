"""
DART OpenAPI 데이터 수집 스크립트
엘오티베큠(083310), 삼성전자, SK하이닉스 분기 재무데이터 + CAPEX 수집
"""

import requests
import json
import time
from datetime import datetime

API_KEY = "02fd57e2bc364c132b31f743ca4a0dfe9d34a1dc"
BASE_URL = "https://opendart.fss.or.kr/api"

CORP_CODES = {
    "LOT": "00843928",       # 엘오티베큠
    "Samsung": "00126380",   # 삼성전자
    "SKHynix": "00164779",   # SK하이닉스
}

def get_financial_statements(corp_code, year, report_code, fs_div="OFS"):
    """단일회사 재무제표 조회"""
    url = f"{BASE_URL}/fnlttSinglAcntAll.json"
    params = {
        "crtfc_key": API_KEY,
        "corp_code": corp_code,
        "bsns_year": str(year),
        "reprt_code": report_code,  # 11013=Q1, 11012=Q2, 11014=Q3, 11011=Annual
        "fs_div": fs_div,           # OFS=개별, CFS=연결
    }
    r = requests.get(url, params=params, timeout=30)
    data = r.json()
    if data.get("status") == "000":
        return data.get("list", [])
    return []

def extract_account(items, account_nm_keywords, thstrm_only=True):
    """계정명 키워드로 항목 추출"""
    for item in items:
        nm = item.get("account_nm", "")
        if any(k in nm for k in account_nm_keywords):
            val_str = item.get("thstrm_amount", "0") if thstrm_only else item.get("thstrm_amount", "0")
            try:
                return int(val_str.replace(",", "").replace("-", "0") or "0")
            except:
                return 0
    return None

def get_revenue(corp_code, year, reprt_code):
    items = get_financial_statements(corp_code, year, reprt_code, "CFS")
    if not items:
        items = get_financial_statements(corp_code, year, reprt_code, "OFS")
    val = extract_account(items, ["매출액", "수익(매출액)", "영업수익"])
    return val

def get_capex(corp_code, year, reprt_code):
    """현금흐름표에서 유형자산취득 추출"""
    items = get_financial_statements(corp_code, year, reprt_code, "CFS")
    # 투자활동 현금흐름 - 유형자산취득
    val = extract_account(items, ["유형자산의 취득", "유형자산 취득", "토지,건물,설비"])
    if val is not None:
        return abs(val)
    return None

# 연간보고서 = 11011, Q1 = 11013, 반기 = 11012, Q3 = 11014
REPORT_CODES = {
    "Q1": "11013",
    "H1": "11012",
    "Q3": "11014",
    "FY": "11011",
}

def fetch_lot_quarterly():
    """LOT 분기별 매출 누적값 수집 (2018~2025)"""
    results = {}
    for year in range(2018, 2026):
        row = {"year": year}
        for q_label, rcode in REPORT_CODES.items():
            rev = get_revenue(CORP_CODES["LOT"], year, rcode)
            row[f"LOT_{q_label}"] = rev
            print(f"LOT {year} {q_label}: {rev}")
            time.sleep(0.3)
        results[year] = row
    return results

def fetch_capex_quarterly(corp_name, corp_code):
    results = {}
    for year in range(2018, 2026):
        row = {"year": year}
        for q_label, rcode in REPORT_CODES.items():
            capex = get_capex(corp_code, year, rcode)
            row[f"{corp_name}_{q_label}"] = capex
            print(f"{corp_name} {year} {q_label} CAPEX: {capex}")
            time.sleep(0.3)
        results[year] = row
    return results

def rolling_4q_from_cumulative(data_by_year, key_prefix):
    """
    누적값(Q1, H1, Q3, FY)으로부터 분기별 단독값 계산 후 rolling 4Q 산출
    반환: {quarter_label: value} e.g. {"2020Q1": 123, ...}
    """
    # 분기별 단독값 계산
    quarterly = {}
    for year, row in sorted(data_by_year.items()):
        q1 = row.get(f"{key_prefix}_Q1")
        h1 = row.get(f"{key_prefix}_H1")
        q3 = row.get(f"{key_prefix}_Q3")
        fy = row.get(f"{key_prefix}_FY")

        q2 = (h1 - q1) if (h1 and q1) else None
        q4 = (fy - q3) if (fy and q3) else None

        quarterly[f"{year}Q1"] = q1
        quarterly[f"{year}Q2"] = q2
        quarterly[f"{year}Q3"] = q3
        quarterly[f"{year}Q4"] = q4

    # Rolling 4Q
    labels = sorted(quarterly.keys())
    rolling = {}
    for i, lbl in enumerate(labels):
        if i < 3:
            continue
        window = [quarterly.get(labels[j]) for j in range(i-3, i+1)]
        if all(v is not None for v in window):
            rolling[lbl] = sum(window)
        else:
            rolling[lbl] = None
    return rolling

if __name__ == "__main__":
    print("=== LOT 매출 수집 ===")
    lot_data = fetch_lot_quarterly()
    with open("lot_raw.json", "w", encoding="utf-8") as f:
        json.dump(lot_data, f, ensure_ascii=False, indent=2)

    print("\n=== 삼성전자 CAPEX 수집 ===")
    sam_data = fetch_capex_quarterly("Samsung", CORP_CODES["Samsung"])
    with open("samsung_raw.json", "w", encoding="utf-8") as f:
        json.dump(sam_data, f, ensure_ascii=False, indent=2)

    print("\n=== SK하이닉스 CAPEX 수집 ===")
    skh_data = fetch_capex_quarterly("SKHynix", CORP_CODES["SKHynix"])
    with open("skhynix_raw.json", "w", encoding="utf-8") as f:
        json.dump(skh_data, f, ensure_ascii=False, indent=2)

    # Rolling 4Q 계산
    lot_rolling = rolling_4q_from_cumulative(lot_data, "LOT")
    sam_rolling = rolling_4q_from_cumulative(sam_data, "Samsung")
    skh_rolling = rolling_4q_from_cumulative(skh_data, "SKHynix")

    # 병합
    all_quarters = sorted(set(lot_rolling) | set(sam_rolling) | set(skh_rolling))
    merged = []
    for q in all_quarters:
        merged.append({
            "quarter": q,
            "lot_revenue_4q": lot_rolling.get(q),
            "samsung_capex_4q": sam_rolling.get(q),
            "skhynix_capex_4q": skh_rolling.get(q),
        })

    with open("chart_data.json", "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print("\n=== 완료 → chart_data.json 생성됨 ===")
    print(json.dumps(merged[-8:], ensure_ascii=False, indent=2))
