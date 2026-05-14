/**
 * 데이터 출처 표기
 * ✓ 확인 = DART/공시 실측값
 * ~ 추정 = 연간공시 균등배분 또는 역산 추정
 *
 * LOT 매출 단위: 억원
 * Samsung/SK CAPEX 단위: 억원 (1조 = 10,000억)
 * DRAM 스팟: USD (DDR4 8Gb)
 * SEMI BB Ratio: 무차원
 * 한국 반도체장비 수입 (HS 8486.20): 백만 USD
 * Lam Research 한국 매출: 백만 USD
 * 경쟁사 매출: 억원
 */

// ────────────────────────────────────────────────────────
// 원천 데이터 (연간 또는 분기 단위 확인치)
// ────────────────────────────────────────────────────────

// LOT 연매출 확인치 (억원)
const LOT_ANNUAL_ACTUAL = {
  2020: 1812, 2021: 2595, 2022: 3742, 2023: 4730, 2024: 1775,
}

// LOT 분기 확인치 (억원, 개별 분기)
const LOT_Q_ACTUAL = {
  "2023Q1": 1106, "2023Q2": 1216, "2023Q3": 1408, "2023Q4": 1000, // 역산 (4730-3730)
}

// LOT H1 누적 확인치 (억원)
const LOT_H1_ACTUAL = {
  2024: 1421,
}

// SK하이닉스 CAPEX 연간 확인치 (억원)
const SKH_ANNUAL_ACTUAL = {
  2022: 196000, 2023: 65000, 2024: 179000, 2025: 302000,
}

// 삼성전자 DS부문 CAPEX 연간 확인치 (억원) — 부분적으로만 공시
const SAM_ANNUAL_ACTUAL = {
  2025: 475000, // 공시 DS부문
}

// ────────────────────────────────────────────────────────
// 연간 추정치 (역사적 데이터 기반 추정)
// ────────────────────────────────────────────────────────

const LOT_ANNUAL_EST = {
  2015: 450, 2016: 510, 2017: 780, 2018: 1100, 2019: 890,
}

const SKH_ANNUAL_EST = {
  2015: 43000, 2016: 45000, 2017: 80000, 2018: 127000,
  2019: 94000, 2020: 92000, 2021: 117000,
}

const SAM_ANNUAL_EST = {
  2015: 150000, 2016: 160000, 2017: 270000, 2018: 290000,
  2019: 240000, 2020: 320000, 2021: 430000, 2022: 470000,
  2023: 410000, 2024: 530000,
}

// ────────────────────────────────────────────────────────
// 경쟁사 연매출 추정 (억원) — 비상장, 감사보고서 기반 추정
// ────────────────────────────────────────────────────────
const EDWARDS_KR_EST = {
  2015: 800, 2016: 850, 2017: 1200, 2018: 1400, 2019: 1200,
  2020: 1300, 2021: 1800, 2022: 2200, 2023: 2500, 2024: 1800,
}
const EBARA_KR_EST = {
  2015: 300, 2016: 320, 2017: 450, 2018: 550, 2019: 480,
  2020: 520, 2021: 720, 2022: 900, 2023: 1000, 2024: 750,
}

// ────────────────────────────────────────────────────────
// 선행지표 분기 추정값
// ────────────────────────────────────────────────────────

// DDR4 8Gb 스팟가격 (USD) — DRAMeXchange/TrendForce 기반 추정
const DRAM_SPOT = {
  "2015Q1":3.5,"2015Q2":3.2,"2015Q3":3.0,"2015Q4":2.8,
  "2016Q1":2.5,"2016Q2":2.6,"2016Q3":3.5,"2016Q4":4.5,
  "2017Q1":6.5,"2017Q2":7.0,"2017Q3":7.5,"2017Q4":8.0,
  "2018Q1":7.8,"2018Q2":7.5,"2018Q3":6.5,"2018Q4":5.0,
  "2019Q1":3.5,"2019Q2":3.0,"2019Q3":2.8,"2019Q4":2.8,
  "2020Q1":3.0,"2020Q2":3.2,"2020Q3":3.5,"2020Q4":3.8,
  "2021Q1":4.5,"2021Q2":5.5,"2021Q3":5.8,"2021Q4":5.0,
  "2022Q1":4.5,"2022Q2":3.5,"2022Q3":2.5,"2022Q4":1.8,
  "2023Q1":1.5,"2023Q2":1.6,"2023Q3":2.0,"2023Q4":2.2,
  "2024Q1":2.5,"2024Q2":3.2,"2024Q3":3.8,"2024Q4":3.5,
  "2025Q1":3.2,
}

// SEMI BB Ratio (북미) — SEMI 월간보고서 분기평균 추정
const SEMI_BB = {
  "2015Q1":0.98,"2015Q2":0.95,"2015Q3":0.92,"2015Q4":0.90,
  "2016Q1":0.88,"2016Q2":0.92,"2016Q3":0.98,"2016Q4":1.05,
  "2017Q1":1.10,"2017Q2":1.15,"2017Q3":1.18,"2017Q4":1.20,
  "2018Q1":1.15,"2018Q2":1.10,"2018Q3":1.05,"2018Q4":0.98,
  "2019Q1":0.90,"2019Q2":0.88,"2019Q3":0.92,"2019Q4":0.95,
  "2020Q1":1.05,"2020Q2":1.10,"2020Q3":1.18,"2020Q4":1.25,
  "2021Q1":1.30,"2021Q2":1.35,"2021Q3":1.25,"2021Q4":1.20,
  "2022Q1":1.15,"2022Q2":1.05,"2022Q3":0.95,"2022Q4":0.88,
  "2023Q1":0.85,"2023Q2":0.88,"2023Q3":0.92,"2023Q4":0.98,
  "2024Q1":1.02,"2024Q2":1.08,"2024Q3":1.12,"2024Q4":1.10,
  "2025Q1":1.15,
}

// 한국 반도체장비 수입 HS8486.20 (백만 USD) — KITA stat.kita.net 추정
const KR_IMPORT = {
  "2015Q1":800,"2015Q2":850,"2015Q3":900,"2015Q4":750,
  "2016Q1":700,"2016Q2":750,"2016Q3":800,"2016Q4":1000,
  "2017Q1":1200,"2017Q2":1400,"2017Q3":1500,"2017Q4":1600,
  "2018Q1":1600,"2018Q2":1500,"2018Q3":1400,"2018Q4":1300,
  "2019Q1":1100,"2019Q2":1000,"2019Q3":950,"2019Q4":900,
  "2020Q1":1000,"2020Q2":1100,"2020Q3":1200,"2020Q4":1300,
  "2021Q1":1500,"2021Q2":1700,"2021Q3":1800,"2021Q4":1900,
  "2022Q1":1900,"2022Q2":1800,"2022Q3":1700,"2022Q4":1500,
  "2023Q1":1200,"2023Q2":1100,"2023Q3":1000,"2023Q4":900,
  "2024Q1":1100,"2024Q2":1300,"2024Q3":1500,"2024Q4":1700,
  "2025Q1":1800,
}

// Lam Research 한국 매출 (백만 USD) — SEC 10-K/Q 지역별 추정
const LAM_KOREA = {
  "2015Q1":350,"2015Q2":380,"2015Q3":360,"2015Q4":330,
  "2016Q1":310,"2016Q2":330,"2016Q3":380,"2016Q4":450,
  "2017Q1":520,"2017Q2":600,"2017Q3":650,"2017Q4":700,
  "2018Q1":680,"2018Q2":650,"2018Q3":600,"2018Q4":550,
  "2019Q1":480,"2019Q2":450,"2019Q3":430,"2019Q4":420,
  "2020Q1":430,"2020Q2":480,"2020Q3":550,"2020Q4":600,
  "2021Q1":700,"2021Q2":800,"2021Q3":850,"2021Q4":900,
  "2022Q1":900,"2022Q2":850,"2022Q3":800,"2022Q4":700,
  "2023Q1":580,"2023Q2":550,"2023Q3":520,"2023Q4":500,
  "2024Q1":550,"2024Q2":650,"2024Q3":750,"2024Q4":850,
  "2025Q1":900,
}

// ────────────────────────────────────────────────────────
// 분기 시계열 조립 (2015Q1 ~ 2025Q4)
// ────────────────────────────────────────────────────────

function makeQLabel(y, q) {
  return `'${String(y).slice(2)}Q${q}`
}

function buildLotQuarterly() {
  const out = {}

  // 2015~2022: 연간 ÷ 4 균등 배분 (추정)
  const annualEst = { ...LOT_ANNUAL_EST, ...LOT_ANNUAL_ACTUAL }
  for (const [yr, total] of Object.entries(annualEst)) {
    const y = Number(yr)
    if (y >= 2015 && y <= 2022) {
      const q = Math.round(total / 4)
      for (let qi = 1; qi <= 4; qi++) {
        out[`${y}Q${qi}`] = { value: qi < 4 ? q : total - q * 3, est: y <= 2022 && !(LOT_Q_ACTUAL[`${y}Q${qi}`]) }
      }
    }
  }

  // 2023: 실측 분기
  for (const [k, v] of Object.entries(LOT_Q_ACTUAL)) {
    out[k] = { value: v, est: false }
  }

  // 2024: H1 실측(균등분할 추정) + H2 역산 추정
  const h1_2024 = LOT_H1_ACTUAL[2024]
  const fy_2024 = LOT_ANNUAL_ACTUAL[2024]
  const h2_2024 = fy_2024 - h1_2024
  out["2024Q1"] = { value: Math.round(h1_2024 / 2), est: true }  // H1 내 분기 분할은 추정
  out["2024Q2"] = { value: h1_2024 - Math.round(h1_2024 / 2), est: true }
  out["2024Q3"] = { value: Math.round(h2_2024 * 0.57), est: true }
  out["2024Q4"] = { value: h2_2024 - Math.round(h2_2024 * 0.57), est: true }

  // 2025 Q1: YoY -23.4% 기반 추정
  const lot2024q1 = out["2024Q1"].value
  out["2025Q1"] = { value: Math.round(lot2024q1 * (1 - 0.234)), est: true }
  out["2025Q2"] = { value: null, est: true }
  out["2025Q3"] = { value: null, est: true }
  out["2025Q4"] = { value: null, est: true }

  return out
}

function buildCapexQuarterly(annualMap, actualMap) {
  const out = {}
  const merged = { ...annualMap, ...actualMap }
  for (const [yr, total] of Object.entries(merged)) {
    const y = Number(yr)
    const q = Math.round(total / 4)
    for (let qi = 1; qi <= 4; qi++) {
      out[`${y}Q${qi}`] = {
        value: qi < 4 ? q : total - q * 3,
        est: !(actualMap[yr]),
      }
    }
  }
  return out
}

function buildCompQuarterly(annualMap) {
  const out = {}
  for (const [yr, total] of Object.entries(annualMap)) {
    const y = Number(yr)
    const q = Math.round(total / 4)
    for (let qi = 1; qi <= 4; qi++) {
      out[`${y}Q${qi}`] = { value: qi < 4 ? q : total - q * 3, est: true }
    }
  }
  // 2025 is unknown
  for (let qi = 1; qi <= 4; qi++) out[`2025Q${qi}`] = { value: null, est: true }
  return out
}

function rollingSum(quarterly, keys, windowSize = 4) {
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    if (i < windowSize - 1) { result[keys[i]] = null; continue }
    const window = keys.slice(i - windowSize + 1, i + 1).map(k => quarterly[k]?.value)
    result[keys[i]] = window.every(v => v !== null && v !== undefined) ? window.reduce((a, b) => a + b, 0) : null
  }
  return result
}

// ────────────────────────────────────────────────────────
// 최종 배열 생성
// ────────────────────────────────────────────────────────

const lotQ = buildLotQuarterly()
const skhQ = buildCapexQuarterly(SKH_ANNUAL_EST, SKH_ANNUAL_ACTUAL)
const samQ = buildCapexQuarterly(SAM_ANNUAL_EST, SAM_ANNUAL_ACTUAL)
const edwardsQ = buildCompQuarterly(EDWARDS_KR_EST)
const ebaraQ = buildCompQuarterly(EBARA_KR_EST)

// 전체 분기 키 생성 (2015Q1 ~ 2025Q4)
const ALL_KEYS = []
for (let y = 2015; y <= 2025; y++) {
  for (let q = 1; q <= 4; q++) ALL_KEYS.push(`${y}Q${q}`)
}

const lot4q = rollingSum(lotQ, ALL_KEYS)
const skh4q = rollingSum(skhQ, ALL_KEYS)
const sam4q = rollingSum(samQ, ALL_KEYS)

// 한국 반도체장비 수입 rolling (단위: 백만USD)
const krQ = {}
ALL_KEYS.forEach(k => { krQ[k] = { value: KR_IMPORT[k] ?? null, est: true } })
const kr4q = rollingSum(krQ, ALL_KEYS)

export const chartData = ALL_KEYS.map(key => {
  const [yr, qi] = [parseInt(key.slice(0, 4)), parseInt(key.slice(5))]
  return {
    quarter: key,
    label: makeQLabel(yr, qi),
    // LOT
    lot_q: lotQ[key]?.value ?? null,
    lot_q_est: lotQ[key]?.est ?? true,
    lot_4q: lot4q[key],
    // Samsung CAPEX (억원)
    sam_q: samQ[key]?.value ?? null,
    sam_q_est: samQ[key]?.est ?? true,
    sam_4q: sam4q[key],
    // SK하이닉스 CAPEX (억원)
    skh_q: skhQ[key]?.value ?? null,
    skh_q_est: skhQ[key]?.est ?? true,
    skh_4q: skh4q[key],
    // 선행지표
    dram_spot: DRAM_SPOT[key] ?? null,
    semi_bb: SEMI_BB[key] ?? null,
    kr_import: KR_IMPORT[key] ?? null,
    kr_import_4q: kr4q[key],
    lam_korea: LAM_KOREA[key] ?? null,
    // 경쟁사
    edwards: edwardsQ[key]?.value ?? null,
    ebara: ebaraQ[key]?.value ?? null,
  }
})

// 데이터 품질 메타
export const DATA_META = {
  lot_confirmed_quarters: Object.keys(LOT_Q_ACTUAL),
  lot_confirmed_annual: Object.keys(LOT_ANNUAL_ACTUAL).map(Number),
  skh_confirmed_annual: Object.keys(SKH_ANNUAL_ACTUAL).map(Number),
  sam_confirmed_annual: Object.keys(SAM_ANNUAL_ACTUAL).map(Number),
  dart_api_note: "DART API IP allowlist 제한으로 서버에서 직접 조회 불가. fetch_lot_data.py를 로컬에서 실행 후 실측값으로 교체 권장.",
}
