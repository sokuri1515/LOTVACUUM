import { useState, useMemo } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceArea,
} from 'recharts'
import { chartData } from '../data/chartData'

const USD_M_TO_JO = 0.0013

const C = {
  pre:    '#64748b',  // 총매출 (구분전) — slate
  dom:    '#22c55e',  // 국내 — green
  ovs:    '#0891b2',  // 해외 — blue
  sam:    '#60a5fa',  // 삼성DS CAPEX — indigo
  import: '#fbbf24',  // 장비수입 — amber
  grid:   '#21262d',
  axis:   '#6e7681',
  accent: '#e6edf3',
  bg:     '#0d1117',
  panel:  '#161b22',
  border: '#30363d',
}

function prepData(raw) {
  return raw.map(r => ({
    label:      r.label,
    quarter:    r.quarter,
    lot_pre_4q: r.lot_pre_4q,
    lot_dom_4q: r.lot_dom_4q,
    lot_ovs_4q: r.lot_ovs_4q,
    sam4q_jo:   r.sam_4q != null ? parseFloat((r.sam_4q / 10000).toFixed(1)) : null,
    kr4q_jo:    r.kr_import_4q != null ? parseFloat((r.kr_import_4q * USD_M_TO_JO).toFixed(1)) : null,
  }))
}

function Row({ color, name, val, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 3 }}>
      <span style={{ color: '#8b949e' }}>{name}</span>
      <strong style={{ color, fontWeight: bold ? 800 : 600 }}>{val}</strong>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const get = k => payload.find(p => p.dataKey === k)?.value
  const pre = get('lot_pre_4q')
  const dom = get('lot_dom_4q')
  const ovs = get('lot_ovs_4q')
  const sam = get('sam4q_jo')
  const kr  = get('kr4q_jo')
  const hasBreakdown = dom != null || ovs != null
  const total = pre ?? ((dom ?? 0) + (ovs ?? 0))

  return (
    <div style={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: 8, padding: '10px 14px', fontSize: 12, minWidth: 190 }}>
      <div style={{ fontWeight: 700, color: '#e6edf3', marginBottom: 8, fontSize: 13 }}>{label}</div>
      {pre != null && <Row color={C.pre}    name="LOT 총매출 4Q"  val={`${pre.toLocaleString()}억`} bold />}
      {hasBreakdown && (
        <>
          {dom != null && <Row color={C.dom} name="국내 4Q"  val={`${dom.toLocaleString()}억`} />}
          {ovs != null && <Row color={C.ovs} name="해외 4Q"  val={`${ovs.toLocaleString()}억`} />}
          {dom != null && ovs != null && <Row color="#e6edf3" name="합계 4Q" val={`${(dom+ovs).toLocaleString()}억`} bold />}
          {dom != null && ovs != null && (
            <div style={{ fontSize: 10, color: '#4d5566', marginTop: 2 }}>
              국내 {Math.round(dom/(dom+ovs)*100)}% / 해외 {Math.round(ovs/(dom+ovs)*100)}%
            </div>
          )}
        </>
      )}
      {(sam != null || kr != null) && (
        <div style={{ borderTop: '1px solid #30363d', marginTop: 6, paddingTop: 6 }}>
          {sam != null && <Row color={C.sam}    name="삼성DS CAPEX 4Q" val={`${sam}조원`} />}
          {kr  != null && <Row color={C.import} name="장비수입 4Q"      val={`${kr}조원`} />}
        </div>
      )}
    </div>
  )
}

function XTick({ x, y, payload }) {
  if (!payload.value.includes('Q1')) return null
  return (
    <text x={x} y={y + 12} textAnchor="middle" fill="#e6edf3" fontSize={11} fontWeight={600}>
      {payload.value.replace('Q1', '')}
    </text>
  )
}

const SERIES = [
  { key: 'lot_pre_4q', label: '총매출 4Q',            color: C.pre,    unit: '억원(좌)', type: 'bar',  note: '~2021Q3' },
  { key: 'lot_dom_4q', label: '국내 4Q',               color: C.dom,    unit: '억원(좌)', type: 'bar',  note: '2021Q4~' },
  { key: 'lot_ovs_4q', label: '해외 4Q',               color: C.ovs,    unit: '억원(좌)', type: 'bar',  note: '2021Q4~' },
  { key: 'sam4q_jo',   label: '삼성DS CAPEX 4Q',       color: C.sam,    unit: '조원(우)', type: 'line' },
  { key: 'kr4q_jo',    label: '한국 반도체장비 수입 4Q', color: C.import, unit: '조원(우)', type: 'line', dash: true },
]

const BADGES = [
  ['LOT 연결실적 17-25 ✓', true],
  ['국내/해외 2021Q4~ ✓', true],
  ['FY2024=2,660억 ✓', true],
  ['FY2025=2,449억 ✓', true],
  ['SK CAPEX 2022-25 ✓', true],
  ['삼성DS 2025 ✓', true],
  ['~2021Q3 총매출만', false],
]

export default function FocusedChart() {
  const [hidden, setHidden] = useState({})
  const data = useMemo(() => prepData(chartData), [])
  const toggle = key => setHidden(p => ({ ...p, [key]: !p[key] }))
  const vis    = key => hidden[key] !== true
  const chartH = typeof window !== 'undefined' ? Math.max(300, Math.min(480, window.innerHeight * 0.58)) : 360

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', padding: '16px 12px', fontFamily: "'Pretendard','Apple SD Gothic Neo',-apple-system,sans-serif" }}>

      <div style={{ marginBottom: 10 }}>
        <h1 style={{ fontSize: 15, fontWeight: 800, color: '#e6edf3', margin: 0, lineHeight: 1.5 }}>
          엘오티베큠(083310) — 국내·해외 매출 × CAPEX × 장비수입
        </h1>
        <p style={{ fontSize: 11, color: '#6e7681', margin: '3px 0 0' }}>
          Rolling 4Q 합산 | 2015Q1~2025Q4 | 국내/해외 구분: 2021Q4 이후 실측
        </p>
      </div>

      {/* 데이터 품질 뱃지 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
        {BADGES.map(([text, real]) => (
          <span key={text} style={{
            fontSize: 10, borderRadius: 4, padding: '2px 7px',
            color: real ? '#4ade80' : '#6e7681',
            background: real ? '#4ade8018' : '#21262d',
            border: `1px solid ${real ? '#4ade8040' : '#30363d'}`,
          }}>{text}</span>
        ))}
      </div>

      {/* 레전드 토글 버튼 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
        {SERIES.map(s => (
          <button key={s.key} onClick={() => toggle(s.key)} aria-pressed={vis(s.key)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: vis(s.key) ? '#21262d' : 'none',
            border: `1.5px solid ${vis(s.key) ? s.color : '#30363d'}`,
            borderRadius: 6, padding: '7px 13px', cursor: 'pointer',
            opacity: vis(s.key) ? 1 : 0.38, transition: 'all 0.15s', minHeight: 40,
          }}>
            {s.type === 'bar'
              ? <span style={{ width: 12, height: 12, background: s.color, borderRadius: 2, flexShrink: 0 }} />
              : <span style={{ width: 22, borderTop: `2.5px ${s.dash ? 'dashed' : 'solid'} ${s.color}`, flexShrink: 0 }} />
            }
            <span style={{ fontSize: 11, color: '#e6edf3', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span style={{ fontSize: 9, color: '#6e7681' }}>{s.unit}</span>
            {s.note && <span style={{ fontSize: 9, color: '#4d5566' }}>{s.note}</span>}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <div style={{ border: '1px solid #30363d', borderRadius: 10, background: '#161b22', padding: '14px 4px 6px' }}>
        <ResponsiveContainer width="100%" height={chartH}>
          <ComposedChart data={data} margin={{ top: 8, right: 50, left: 4, bottom: 4 }} syncId="focused">
            <CartesianGrid stroke="#21262d" strokeDasharray="3 3" vertical={false} />
            <ReferenceArea yAxisId="lot" x1="'18Q3" x2="'19Q4" fill="#ef444416" />
            <ReferenceArea yAxisId="lot" x1="'22Q3" x2="'23Q4" fill="#ef444416" />
            <ReferenceArea yAxisId="lot" x1="'20Q4" x2="'22Q2" fill="#22c55e0c" />
            <XAxis dataKey="label" tick={<XTick />} interval={3} tickLine={false} axisLine={{ stroke: '#30363d' }} height={22} />
            <YAxis yAxisId="lot"   tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}천` : `${v}`} tick={{ fill: '#6e7681', fontSize: 10 }} axisLine={false} tickLine={false} width={36} domain={[0, 5800]} label={{ value: '억원', angle: -90, position: 'insideLeft', fill: '#6e7681', fontSize: 9, offset: 8 }} />
            <YAxis yAxisId="capex" orientation="right" tick={{ fill: '#6e7681', fontSize: 10 }} axisLine={false} tickLine={false} width={34} domain={[0, 56]} label={{ value: '조원', angle: 90, position: 'insideRight', fill: '#6e7681', fontSize: 9, offset: 10 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />

            {/* 총매출 — 2021Q3 이전 (구분 불가 구간) */}
            {vis('lot_pre_4q') && (
              <Bar yAxisId="lot" dataKey="lot_pre_4q" stackId="lot"
                fill={C.pre} opacity={0.70} maxBarSize={11} radius={[2,2,0,0]} />
            )}
            {/* 국내 — 2021Q4 이후 */}
            {vis('lot_dom_4q') && (
              <Bar yAxisId="lot" dataKey="lot_dom_4q" stackId="lot"
                fill={C.dom} opacity={0.90} maxBarSize={11}
                radius={vis('lot_ovs_4q') ? [0,0,0,0] : [2,2,0,0]} />
            )}
            {/* 해외 — 2021Q4 이후 */}
            {vis('lot_ovs_4q') && (
              <Bar yAxisId="lot" dataKey="lot_ovs_4q" stackId="lot"
                fill={C.ovs} opacity={0.88} maxBarSize={11} radius={[2,2,0,0]} />
            )}

            {vis('sam4q_jo') && (
              <Line yAxisId="capex" dataKey="sam4q_jo" stroke={C.sam}
                strokeWidth={2.5} dot={false} connectNulls activeDot={{ r: 5, fill: C.sam }} />
            )}
            {vis('kr4q_jo') && (
              <Line yAxisId="capex" dataKey="kr4q_jo" stroke={C.import}
                strokeWidth={2} dot={false} strokeDasharray="6 3" connectNulls activeDot={{ r: 5, fill: C.import }} />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        <div style={{ display: 'flex', gap: 8, padding: '8px 14px 4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: '#ef4444' }}>■ 다운턴 (2018H2~2019 / 2022H2~2023)</span>
          <span style={{ fontSize: 10, color: '#22c55e' }}>■ 슈퍼사이클 (2020Q4~2022Q2)</span>
        </div>
      </div>

      {/* 해석 포인트 */}
      <div style={{ marginTop: 12, padding: '12px 14px', background: '#161b22', border: '1px solid #30363d', borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e6edf3', marginBottom: 6 }}>해석 포인트</div>
        <div style={{ fontSize: 11, color: '#6e7681', lineHeight: 2.0 }}>
          <div><span style={{ color: C.pre }}>■ 총매출(~21Q3)</span> — 2017 고점(2,007억) → 2019 저점(1,502억) → 2020~21 재상승</div>
          <div><span style={{ color: C.dom }}>■ 국내</span> — 삼성/SK 한국 팹 투자 연동. FY2021=1,702억 → FY2025=1,997억 안정적 성장</div>
          <div><span style={{ color: C.ovs }}>■ 해외</span> — 중국 팹 사이클 핵심. FY2022=1,584억 → FY2023=2,823억 급증 → FY2025=452억 저점</div>
          <div><span style={{ color: C.sam }}>— 삼성DS CAPEX</span> 선행 → LOT 2~4분기 후행. FY2023 최고 4,730억</div>
          <div><span style={{ color: C.import }}>--- 장비수입</span> 급증 = 국내 팹 증설 동행 선행지표</div>
          <div style={{ marginTop: 4, color: '#4d5566' }}>※ FY2024=2,660억(국내72%+해외28%) / FY2025=2,449억(국내82%+해외18%) — 국내 중심 재편</div>
        </div>
      </div>

      {/* 데이터 주석 */}
      <div style={{ marginTop: 8, padding: '8px 14px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6 }}>
        <div style={{ fontSize: 10, color: '#6e7681', lineHeight: 1.9 }}>
          <strong style={{ color: '#e6edf3' }}>데이터 주석</strong>
          <div>✓ <strong>LOT 연결 총매출</strong>: DART 연결 rolling 4Q 역산 — FY2017~2025</div>
          <div>✓ <strong>국내/해외</strong>: 2021Q4~ CSV 실측 (중국+미국+기타=해외). 22Q3·23Q3는 소스 오류로 보간</div>
          <div>~ <strong>2021Q3 이전</strong>: 지역별 미분리 (총매출만). 삼성DS CAPEX·수입통계: 공시·추정 혼합</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: '#6e7681', textAlign: 'right', marginTop: 10 }}>
        작성 2026-05-14 | 투자참고용 내부자료 | 매매를 권유하지 않습니다
      </div>
    </div>
  )
}
