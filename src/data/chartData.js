/**
 * 데이터 출처
 * ✓ = DART 연결재무제표 실측 (엑셀 LOTVACUUM_10년_260514)
 * ~ = 추정
 */

// ────────────────────────────────────────────────────────
// LOT 개별 분기 매출 ✓ (억원)
// ────────────────────────────────────────────────────────
const LOT_Q_DATA = {
  "2016Q1": 230,  "2016Q2": 186,  "2016Q3": 290,  "2016Q4": 460,
  "2017Q1": 416,  "2017Q2": 672,  "2017Q3": 478,  "2017Q4": 441,
  "2018Q1": 518,  "2018Q2": 528,  "2018Q3": 296,  "2018Q4": 351,
  "2019Q1": 362,  "2019Q2": 314,  "2019Q3": 354,  "2019Q4": 472,
  "2020Q1": 549,  "2020Q2": 416,  "2020Q3": 430,  "2020Q4": 317,
  "2021Q1": 728,  "2021Q2": 778,  "2021Q3": 513,  "2021Q4": 577,
  "2022Q1": 751,  "2022Q2": 842,  "2022Q3": 1036, "2022Q4": 1113,
  "2023Q1": 1106, "2023Q2": 1216, "2023Q3": 1408, "2023Q4": 1000,
  "2024Q1": 727,  "2024Q2": 695,  "2024Q3": 599,  "2024Q4": 639,
  "2025Q1": 557,  "2025Q2": 631,  "2025Q3": 586,  "2025Q4": 675,
}

// ────────────────────────────────────────────────────────
// 국내/해외 Rolling 4Q ✓ (억원) — CSV 지역별 실측
// 2021Q4 이후. 22Q3·23Q3는 인접분기 비율로 보간 (소스 데이터 오류)
// 해외 = 중국 + 미국 + 기타
// ────────────────────────────────────────────────────────
const DOM_4Q = {
  "2021Q4":1702, "2022Q1":1771, "2022Q2":1873,
  "2022Q3":2045, // 보간: (1873/2683 + 2158/3742)/2 × 3206
  "2022Q4":2158,
  "2023Q1":2210, "2023Q2":2111,
  "2023Q3":2121, // 보간: (2111/4471 + 1908/4730)/2 × 4843
  "2023Q4":1908,
  "2024Q1":1830, "2024Q2":1824, "2024Q3":1825, "2024Q4":1906,
  "2025Q1":1899, "2025Q2":1962, "2025Q3":1986, "2025Q4":1997,
}
const OVS_4Q = {
  "2021Q4": 894, "2022Q1": 848, "2022Q2": 810,
  "2022Q3":1161, // 3206 - 2045
  "2022Q4":1584,
  "2023Q1":1886, "2023Q2":2360,
  "2023Q3":2722, // 4843 - 2121
  "2023Q4":2823,
  "2024Q1":2520, "2024Q2":2005, "2024Q3":1196, "2024Q4": 754,
  "2025Q1": 589, "2025Q2": 461, "2025Q3": 426, "2025Q4": 452,
}

// ────────────────────────────────────────────────────────
// Samsung/SK CAPEX (억원)
// ────────────────────────────────────────────────────────
const SKH_ANNUAL_ACTUAL = {
  2022: 196000, 2023: 65000, 2024: 179000, 2025: 302000,
}
const SKH_ANNUAL_EST = {
  2015: 43000, 2016: 45000, 2017: 80000, 2018: 127000,
  2019: 94000, 2020: 92000, 2021: 117000,
}
const SAM_ANNUAL_ACTUAL = { 2025: 475000 }
const SAM_ANNUAL_EST = {
  2015: 150000, 2016: 160000, 2017: 270000, 2018: 290000,
  2019: 240000, 2020: 320000, 2021: 430000, 2022: 470000,
  2023: 410000, 2024: 530000,
}

// ────────────────────────────────────────────────────────
// 경쟁사 추정 (억원)
// ────────────────────────────────────────────────────────
const EDWARDS_KR_EST = {
  2015: 800,  2016: 850,  2017: 1200, 2018: 1400, 2019: 1200,
  2020: 1300, 2021: 1800, 2022: 2200, 2023: 2500, 2024: 1800,
}
const EBARA_KR_EST = {
  2015: 300,  2016: 320,  2017: 450,  2018: 550,  2019: 480,
  2020: 520,  2021: 720,  2022: 900,  2023: 1000, 2024: 750,
}

// ────────────────────────────────────────────────────────
// 선행지표 (분기 추정)
// ────────────────────────────────────────────────────────
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
  "2025Q1":3.2,"2025Q2":3.0,"2025Q3":2.8,"2025Q4":2.9,
}
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
  "2025Q1":1.15,"2025Q2":1.12,"2025Q3":1.08,"2025Q4":1.10,
}
const KR_IMPORT = {
  "2015Q1":800, "2015Q2":850, "2015Q3":900, "2015Q4":750,
  "2016Q1":700, "2016Q2":750, "2016Q3":800, "2016Q4":1000,
  "2017Q1":1200,"2017Q2":1400,"2017Q3":1500,"2017Q4":1600,
  "2018Q1":1600,"2018Q2":1500,"2018Q3":1400,"2018Q4":1300,
  "2019Q1":1100,"2019Q2":1000,"2019Q3":950, "2019Q4":900,
  "2020Q1":1000,"2020Q2":1100,"2020Q3":1200,"2020Q4":1300,
  "2021Q1":1500,"2021Q2":1700,"2021Q3":1800,"2021Q4":1900,
  "2022Q1":1900,"2022Q2":1800,"2022Q3":1700,"2022Q4":1500,
  "2023Q1":1200,"2023Q2":1100,"2023Q3":1000,"2023Q4":900,
  "2024Q1":1100,"2024Q2":1300,"2024Q3":1500,"2024Q4":1700,
  "2025Q1":1800,"2025Q2":1750,"2025Q3":1700,"2025Q4":1650,
}
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
  "2025Q1":900,"2025Q2":880,"2025Q3":860,"2025Q4":840,
}

// ────────────────────────────────────────────────────────
// 시계열 조립
// ────────────────────────────────────────────────────────
function makeQLabel(y, q) { return `'${String(y).slice(2)}Q${q}` }

const LOT_2015_EST = { "2015Q1":118,"2015Q2":113,"2015Q3":113,"2015Q4":108 }

function buildLotQuarterly() {
  const out = {}
  for (const [k, v] of Object.entries(LOT_2015_EST)) out[k] = { value: v, est: true }
  for (const [k, v] of Object.entries(LOT_Q_DATA)) out[k] = { value: v, est: k === '2016Q1' }
  return out
}

function buildCapexQuarterly(annualMap, actualMap) {
  const out = {}
  const merged = { ...annualMap, ...actualMap }
  for (const [yr, total] of Object.entries(merged)) {
    const y = Number(yr), q = Math.round(total / 4)
    for (let qi = 1; qi <= 4; qi++) {
      out[`${y}Q${qi}`] = { value: qi < 4 ? q : total - q * 3, est: !(actualMap[yr]) }
    }
  }
  return out
}

function buildCompQuarterly(annualMap) {
  const out = {}
  for (const [yr, total] of Object.entries(annualMap)) {
    const y = Number(yr), q = Math.round(total / 4)
    for (let qi = 1; qi <= 4; qi++) {
      out[`${y}Q${qi}`] = { value: qi < 4 ? q : total - q * 3, est: true }
    }
  }
  for (let qi = 1; qi <= 4; qi++) out[`2025Q${qi}`] = { value: null, est: true }
  return out
}

function rollingSum(quarterly, keys, windowSize = 4) {
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    if (i < windowSize - 1) { result[keys[i]] = null; continue }
    const window = keys.slice(i - windowSize + 1, i + 1).map(k => quarterly[k]?.value)
    result[keys[i]] = window.every(v => v !== null && v !== undefined)
      ? window.reduce((a, b) => a + b, 0) : null
  }
  return result
}

const lotQ     = buildLotQuarterly()
const skhQ     = buildCapexQuarterly(SKH_ANNUAL_EST, SKH_ANNUAL_ACTUAL)
const samQ     = buildCapexQuarterly(SAM_ANNUAL_EST, SAM_ANNUAL_ACTUAL)
const edwardsQ = buildCompQuarterly(EDWARDS_KR_EST)
const ebaraQ   = buildCompQuarterly(EBARA_KR_EST)

const ALL_KEYS = []
for (let y = 2015; y <= 2025; y++) {
  for (let q = 1; q <= 4; q++) ALL_KEYS.push(`${y}Q${q}`)
}

const lot4q = rollingSum(lotQ, ALL_KEYS)
const skh4q = rollingSum(skhQ, ALL_KEYS)
const sam4q = rollingSum(samQ, ALL_KEYS)

const krQ = {}
ALL_KEYS.forEach(k => { krQ[k] = { value: KR_IMPORT[k] ?? null, est: true } })
const kr4q = rollingSum(krQ, ALL_KEYS)

export const chartData = ALL_KEYS.map(key => {
  const [yr, qi] = [parseInt(key.slice(0, 4)), parseInt(key.slice(5))]
  const hasBreakdown = DOM_4Q[key] != null
  return {
    quarter:      key,
    label:        makeQLabel(yr, qi),
    lot_q:        lotQ[key]?.value ?? null,
    lot_q_est:    lotQ[key]?.est ?? true,
    lot_4q:       lot4q[key],
    lot_pre_4q:   hasBreakdown ? null : (lot4q[key] ?? null),
    lot_dom_4q:   DOM_4Q[key] ?? null,
    lot_ovs_4q:   OVS_4Q[key] ?? null,
    sam_q:        samQ[key]?.value ?? null,
    sam_q_est:    samQ[key]?.est ?? true,
    sam_4q:       sam4q[key],
    skh_q:        skhQ[key]?.value ?? null,
    skh_q_est:    skhQ[key]?.est ?? true,
    skh_4q:       skh4q[key],
    dram_spot:    DRAM_SPOT[key] ?? null,
    semi_bb:      SEMI_BB[key] ?? null,
    kr_import:    KR_IMPORT[key] ?? null,
    kr_import_4q: kr4q[key],
    lam_korea:    LAM_KOREA[key] ?? null,
    edwards:      edwardsQ[key]?.value ?? null,
    ebara:        ebaraQ[key]?.value ?? null,
  }
})

export const DATA_META = {
  lot_confirmed_annual:   [2017,2018,2019,2020,2021,2022,2023,2024,2025],
  lot_breakdown_from:     '2021Q4',
  skh_confirmed_annual:   Object.keys(SKH_ANNUAL_ACTUAL).map(Number),
  sam_confirmed_annual:   Object.keys(SAM_ANNUAL_ACTUAL).map(Number),
  source_note: "DART 연결재무제표 (엑셀 LOTVACUUM_10년_260514). 국내/해외 2021Q4~ CSV 실측.",
}
