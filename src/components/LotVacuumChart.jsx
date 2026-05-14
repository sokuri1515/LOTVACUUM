import { useState, useCallback } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  Cell,
} from 'recharts'
import { chartData, DATA_META } from '../data/chartData'

// ── 색상 팔레트 ──────────────────────────────────────────
const C = {
  lot:        '#4ade80',   // 엘오티베큠 — 초록
  lotEst:     '#4ade8066', // 추정 (투명)
  samsung:    '#60a5fa',   // 삼성 — 파랑
  skhynix:    '#f97316',   // SK하이닉스 — 오렌지
  edwards:    '#a78bfa',   // 에드워드 — 보라
  ebara:      '#fb7185',   // 에바라 — 핑크
  dram:       '#facc15',   // DRAM 스팟 — 노랑
  bb:         '#38bdf8',   // BB Ratio — 하늘
  krImport:   '#34d399',   // 한국 수입 — 민트
  lam:        '#e879f9',   // Lam Research — 마젠타
  grid:       '#21262d',
  axis:       '#8b949e',
  bg:         '#0d1117',
  panelBg:    '#161b22',
  border:     '#30363d',
}

// ── 단위 변환 헬퍼 ─────────────────────────────────────
const toTrillion = v => v != null ? +(v / 10000).toFixed(2) : null   // 억→조
const fmt억 = v => v != null ? `${v.toLocaleString()}억` : '-'
const fmt조 = v => v != null ? `${(v/10000).toFixed(1)}조` : '-'

// ── 실측/추정 구분 셀 렌더러 ──────────────────────────
function EstimatedBar({ x, y, width, height, est }) {
  if (!height || height < 0) return null
  return (
    <rect
      x={x} y={y} width={width} height={height}
      fill={est ? `${C.lot}55` : C.lot}
      stroke={est ? C.lot : 'none'}
      strokeWidth={est ? 1 : 0}
      strokeDasharray={est ? '3 2' : '0'}
    />
  )
}

// ── 공통 툴팁 스타일 ──────────────────────────────────
const tooltipStyle = {
  backgroundColor: '#1c2128',
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  fontSize: 12,
  color: '#e6edf3',
}

// ── X축 틱: 연간만 표시 (Q1만 년도 표기) ──────────────
function XTick({ x, y, payload }) {
  const lbl = payload.value
  const isQ1 = lbl.includes('Q1')
  return (
    <text x={x} y={y + 12} textAnchor="middle" fill={isQ1 ? '#e6edf3' : C.axis} fontSize={isQ1 ? 11 : 9}>
      {isQ1 ? lbl : lbl.replace(/'.+Q/, 'Q')}
    </text>
  )
}

// ── Y축 포매터 ─────────────────────────────────────────
const fmtY억 = v => v >= 10000 ? `${(v/10000).toFixed(0)}조` : `${v}억`
const fmtY조 = v => `${v.toFixed(1)}조`
const fmtYusd = v => `$${v}`
const fmtYmUSD = v => `$${v}M`

// ── 패널 공통 Props ────────────────────────────────────
const COMMON = {
  syncId: "capex",
  margin: { top: 6, right: 60, left: 8, bottom: 0 },
}

// ── 레전드 토글 훅 ─────────────────────────────────────
function useLegendToggle(initial) {
  const [hidden, setHidden] = useState({})
  const toggle = useCallback(key => {
    setHidden(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])
  const vis = key => hidden[key] !== true
  return { toggle, vis }
}

// ── 패널 헤더 ──────────────────────────────────────────
function PanelHeader({ title, note }) {
  return (
    <div style={{ padding: '8px 16px 2px', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#e6edf3' }}>{title}</span>
      {note && <span style={{ fontSize: 10, color: C.axis, marginLeft: 8 }}>{note}</span>}
    </div>
  )
}

// ── 커스텀 레전드 ──────────────────────────────────────
function CustomLegend({ items, vis, toggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 16px 8px' }}>
      {items.map(({ key, label, color, dashed }) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: `1px solid ${vis(key) ? color : C.border}`,
            borderRadius: 4, padding: '2px 8px', cursor: 'pointer',
            opacity: vis(key) ? 1 : 0.4, transition: 'all 0.15s',
          }}
        >
          <span style={{
            display: 'inline-block', width: 20, height: 2,
            background: color,
            borderTop: dashed ? `2px dashed ${color}` : `2px solid ${color}`,
          }} />
          <span style={{ fontSize: 11, color: '#e6edf3' }}>{label}</span>
        </button>
      ))}
    </div>
  )
}

// ── 패널1: LOT 매출 + Samsung/SK CAPEX (rolling 4Q) ───
function Panel1({ data }) {
  const { toggle, vis } = useLegendToggle()
  const items = [
    { key: 'lot4q',  label: 'LOT 매출 4Q누적', color: C.lot, dashed: false },
    { key: 'sam4q',  label: '삼성반도체 CAPEX 4Q', color: C.samsung, dashed: true },
    { key: 'skh4q',  label: 'SK하이닉스 CAPEX 4Q', color: C.skhynix, dashed: true },
  ]

  const d = data.map(r => ({
    ...r,
    sam4q_jo: toTrillion(r.sam_4q),
    skh4q_jo: toTrillion(r.skh_4q),
  }))

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }}>
      <PanelHeader title="① LOT 매출 vs 삼성·SK 반도체 CAPEX (Rolling 4Q)" note="LOT=억원(좌), CAPEX=조원(우) / 빗금=추정" />
      <CustomLegend items={items} vis={vis} toggle={toggle} />
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={d} {...COMMON}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={<XTick />} interval={3} tickLine={false} axisLine={{ stroke: C.border }} />
          <YAxis yAxisId="left" tickFormatter={fmtY억} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={60} label={{ value: '억원', angle: -90, position: 'insideLeft', fill: C.axis, fontSize: 10, offset: 10 }} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={fmtY조} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={50} label={{ value: '조원', angle: 90, position: 'insideRight', fill: C.axis, fontSize: 10, offset: 10 }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => {
              if (name === 'LOT 4Q누적') return [fmt억(value), name]
              if (name.includes('CAPEX')) return [fmt조(value * 10000), name]
              return [value, name]
            }}
          />
          {vis('lot4q') && (
            <Bar yAxisId="left" dataKey="lot_4q" name="LOT 4Q누적" fill={C.lot} opacity={0.85} maxBarSize={14} />
          )}
          {vis('sam4q') && (
            <Line yAxisId="right" dataKey="sam4q_jo" name="삼성 CAPEX 4Q" stroke={C.samsung} strokeWidth={2} dot={false} strokeDasharray="5 3" connectNulls />
          )}
          {vis('skh4q') && (
            <Line yAxisId="right" dataKey="skh4q_jo" name="SK하이닉스 CAPEX 4Q" stroke={C.skhynix} strokeWidth={2} dot={false} connectNulls />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 패널2: LOT 분기별 매출 (실측 vs 추정 구분) ─────────
function Panel2({ data }) {
  const { toggle, vis } = useLegendToggle()
  const items = [
    { key: 'lot_actual', label: 'LOT 매출 (실측)', color: C.lot, dashed: false },
    { key: 'lot_est',    label: 'LOT 매출 (추정)', color: `${C.lot}66`, dashed: true },
  ]

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }}>
      <PanelHeader title="② LOT 분기별 매출" note="확인: 2023 전체 / 2024 H1·FY / 2025Q1(-23.4% YoY) / 나머지 추정" />
      <CustomLegend items={items} vis={vis} toggle={toggle} />
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} {...COMMON}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={<XTick />} interval={3} tickLine={false} axisLine={{ stroke: C.border }} />
          <YAxis tickFormatter={fmtY억} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v, name) => [fmt억(v), name]}
          />
          <Bar dataKey="lot_q" name="LOT 분기 매출" maxBarSize={14}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.lot_q_est ? `${C.lot}55` : C.lot}
                stroke={entry.lot_q_est ? C.lot : 'none'}
                strokeWidth={entry.lot_q_est ? 1 : 0}
                strokeDasharray={entry.lot_q_est ? '3 2' : '0'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 패널3: 경쟁사 비교 ─────────────────────────────────
function Panel3({ data }) {
  const { toggle, vis } = useLegendToggle()
  const items = [
    { key: 'lot',     label: '엘오티베큠', color: C.lot, dashed: false },
    { key: 'edwards', label: '에드워드코리아*', color: C.edwards, dashed: true },
    { key: 'ebara',   label: '한국에바라정밀*', color: C.ebara, dashed: true },
  ]

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }}>
      <PanelHeader title="③ 경쟁사 매출 비교" note="*비상장: 감사보고서 기반 추정, 분기배분 균등" />
      <CustomLegend items={items} vis={vis} toggle={toggle} />
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} {...COMMON}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={<XTick />} interval={3} tickLine={false} axisLine={{ stroke: C.border }} />
          <YAxis tickFormatter={fmtY억} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [fmt억(v), name]} />
          {vis('lot') && (
            <Line dataKey="lot_q" name="엘오티베큠" stroke={C.lot} strokeWidth={2} dot={false} connectNulls />
          )}
          {vis('edwards') && (
            <Line dataKey="edwards" name="에드워드코리아*" stroke={C.edwards} strokeWidth={1.5} dot={false} strokeDasharray="5 3" connectNulls />
          )}
          {vis('ebara') && (
            <Line dataKey="ebara" name="한국에바라정밀*" stroke={C.ebara} strokeWidth={1.5} dot={false} strokeDasharray="5 3" connectNulls />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 패널4: DRAM 스팟 + SEMI BB Ratio ─────────────────
function Panel4({ data }) {
  const { toggle, vis } = useLegendToggle()
  const items = [
    { key: 'dram', label: 'DRAM 스팟 DDR4 8Gb (USD)', color: C.dram, dashed: false },
    { key: 'bb',   label: 'SEMI BB Ratio (북미)',       color: C.bb,   dashed: true },
  ]

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }}>
      <PanelHeader title="④ 선행지표 — DRAM 스팟가격 + SEMI BB Ratio" note="*TrendForce·SEMI 기반 추정 / BB&gt;1=수주증가" />
      <CustomLegend items={items} vis={vis} toggle={toggle} />
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} {...COMMON}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={<XTick />} interval={3} tickLine={false} axisLine={{ stroke: C.border }} />
          <YAxis yAxisId="dram" tickFormatter={v => `$${v}`} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={48} label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: C.axis, fontSize: 10 }} />
          <YAxis yAxisId="bb" orientation="right" domain={[0.6, 1.6]} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
          <ReferenceLine yAxisId="bb" y={1.0} stroke={C.bb} strokeDasharray="4 2" strokeOpacity={0.5} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [name.includes('BB') ? v?.toFixed(2) : `$${v}`, name]} />
          {vis('dram') && (
            <Line yAxisId="dram" dataKey="dram_spot" name="DRAM 스팟 DDR4 8Gb" stroke={C.dram} strokeWidth={2} dot={false} connectNulls />
          )}
          {vis('bb') && (
            <Line yAxisId="bb" dataKey="semi_bb" name="SEMI BB Ratio (북미)" stroke={C.bb} strokeWidth={1.5} dot={false} strokeDasharray="4 3" connectNulls />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 패널5: 한국 반도체장비 수입 + Lam Korea ───────────
function Panel5({ data }) {
  const { toggle, vis } = useLegendToggle()
  const items = [
    { key: 'kr',  label: '한국 반도체장비 수입 HS8486.20 ($M)', color: C.krImport, dashed: false },
    { key: 'lam', label: 'Lam Research 한국 매출 ($M)',         color: C.lam,      dashed: true  },
  ]

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }}>
      <PanelHeader title="⑤ 선행지표 — 한국 반도체장비 수입 + Lam Research 한국 매출" note="*KITA·SEC 10-Q 기반 추정 (백만 USD)" />
      <CustomLegend items={items} vis={vis} toggle={toggle} />
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} {...COMMON}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={<XTick />} interval={3} tickLine={false} axisLine={{ stroke: C.border }} />
          <YAxis yAxisId="left" tickFormatter={v => `$${v}M`} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={56} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={v => `$${v}M`} tick={{ fill: C.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={56} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`$${v}M`, name]} />
          {vis('kr') && (
            <Bar yAxisId="left" dataKey="kr_import" name="한국 반도체장비 수입" fill={C.krImport} opacity={0.75} maxBarSize={14} />
          )}
          {vis('lam') && (
            <Line yAxisId="right" dataKey="lam_korea" name="Lam Research 한국 매출" stroke={C.lam} strokeWidth={2} dot={false} strokeDasharray="5 3" connectNulls />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 데이터 출처 주석 ───────────────────────────────────
function DataNote() {
  const confirmed = DATA_META.lot_confirmed_quarters
  return (
    <div style={{ padding: '10px 16px', background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }}>
      <p style={{ fontSize: 11, color: C.axis, lineHeight: 1.8 }}>
        <strong style={{ color: '#e6edf3' }}>데이터 출처 및 품질</strong><br />
        ✅ <strong>LOT 실측</strong>: 분기 ({confirmed.join(', ')}), 연간 ({DATA_META.lot_confirmed_annual.join('·')}년), 2024 H1=1,421억, 2025Q1 YoY -23.4%<br />
        ✅ <strong>SK하이닉스 CAPEX</strong>: {DATA_META.skh_confirmed_annual.join('·')}년 연간공시 실측<br />
        ✅ <strong>삼성 DS CAPEX</strong>: 2025년 공시 (47.5조)<br />
        〜 나머지 모든 값은 연간공시 균등배분 또는 역산 추정. 빗금/투명 바 = 추정치<br />
        ⚠ {DATA_META.dart_api_note}
      </p>
    </div>
  )
}

// ── 메인 컴포넌트 ──────────────────────────────────────
export default function LotVacuumChart() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '20px 24px', fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#e6edf3', margin: 0 }}>
          엘오티베큠(083310) — 반도체 CAPEX 선행지표 대시보드
        </h1>
        <p style={{ fontSize: 12, color: C.axis, marginTop: 4 }}>
          2015Q1 ~ 2025Q4 | 패널별 레전드 클릭으로 시리즈 ON/OFF | Rolling 4Q = 최근 4분기 합산
        </p>
      </div>

      {/* 데이터 주석 */}
      <DataNote />

      {/* 5개 패널 */}
      <Panel1 data={chartData} />
      <Panel2 data={chartData} />
      <Panel3 data={chartData} />
      <Panel4 data={chartData} />
      <Panel5 data={chartData} />

      {/* 푸터 */}
      <div style={{ fontSize: 10, color: C.axis, textAlign: 'right', marginTop: 8 }}>
        작성: 2026-05-14 | 투자참고용 내부자료 — 본 자료는 매매를 권유하지 않습니다
      </div>
    </div>
  )
}
