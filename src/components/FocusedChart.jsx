import { useState, useMemo } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceArea, Cell,
} from 'recharts'
import { chartData } from '../data/chartData'

// ── 1300원/USD 환산: 백만USD → 조원 ─────────────────────
const USD_M_TO_JO = 0.0013   // 1M USD × 1300원/USD = 13억원 = 0.0013조원

const C = {
  lot:    '#4ade80',
  sam:    '#60a5fa',
  import: '#fbbf24',
  grid:   '#21262d',
  axis:   '#6e7681',
  accent: '#e6edf3',
  bg:     '#0d1117',
  panel:  '#161b22',
  border: '#30363d',
  down:   '#ef444416',
  up:     '#22c55e0d',
}

// ── 데이터 변환 ─────────────────────────────────────────
function prepData(raw) {
  return raw.map(r => ({
    label: r.label,
    quarter: r.quarter,
    lot_4q:    r.lot_4q,
    sam4q_jo:  r.sam_4q       != null ? parseFloat((r.sam_4q / 10000).toFixed(1))        : null,
    kr4q_jo:   r.kr_import_4q != null ? parseFloat((r.kr_import_4q * USD_M_TO_JO).toFixed(1)) : null,
  }))
}

// ── 커스텀 툴팁 (모바일 친화) ─────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const get = key => payload.find(p => p.dataKey === key)?.value

  const rows = [
    { key: 'lot_4q',   color: C.lot,    name: 'LOT 매출 4Q',       fmt: v => `${v?.toLocaleString()}억원` },
    { key: 'sam4q_jo', color: C.sam,    name: '삼성DS CAPEX 4Q',   fmt: v => `${v}조원` },
    { key: 'kr4q_jo',  color: C.import, name: '장비수입 4Q (한국)', fmt: v => `${v}조원` },
  ]

  return (
    <div style={{
      background: '#1c2128', border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '10px 14px', fontSize: 12, minWidth: 168, maxWidth: 210,
    }}>
      <div style={{ fontWeight: 700, color: C.accent, marginBottom: 8, fontSize: 13 }}>{label}</div>
      {rows.map(({ key, color, name, fmt }) => {
        const v = get(key)
        return v != null ? (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, color, marginBottom: 4 }}>
            <span style={{ color: '#8b949e', whiteSpace: 'nowrap' }}>{name}</span>
            <strong style={{ color }}>{fmt(v)}</strong>
          </div>
        ) : null
      })}
    </div>
  )
}

// ── X축 틱: Q1만 연도 표기 ────────────────────────────
function XTick({ x, y, payload }) {
  if (!payload.value.includes('Q1')) return null
  return (
    <text x={x} y={y + 12} textAnchor="middle" fill={C.accent} fontSize={11} fontWeight={600}>
      {payload.value.replace('Q1', '')}
    </text>
  )
}

// ── 시리즈 정의 ─────────────────────────────────────────
const SERIES = [
  { key: 'lot_4q',   label: 'LOT 매출 4Q누적',            color: C.lot,    unit: '억원(좌)', type: 'bar' },
  { key: 'sam4q_jo', label: '삼성DS CAPEX 4Q',             color: C.sam,    unit: '조원(우)', type: 'line' },
  { key: 'kr4q_jo',  label: '한국 반도체장비 수입 4Q',     color: C.import, unit: '조원(우)', type: 'line', dash: true },
]

// ── 주요 이벤트 기준선 ────────────────────────────────
const KEY_EVENTS = [
  { label: "SK CAPEX -67% 충격", quarter: "'23Q1", color: '#ef4444' },
  { label: "LOT 역대최대", quarter: "'23Q3", color: '#4ade80' },
  { label: "SK CAPEX 30.2조 집행", quarter: "'25Q1", color: '#60a5fa' },
]

export default function FocusedChart() {
  const [hidden, setHidden] = useState({})
  const data = useMemo(() => prepData(chartData), [])

  const toggle = key => setHidden(p => ({ ...p, [key]: !p[key] }))
  const vis    = key => hidden[key] !== true

  // 뷰포트 높이 기반 차트 높이 (모바일/데스크탑 대응)
  const chartH = typeof window !== 'undefined'
    ? Math.max(300, Math.min(480, window.innerHeight * 0.58))
    : 360

  return (
    <div style={{
      background: C.bg, minHeight: '100vh',
      padding: '16px 12px',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif",
    }}>

      {/* ── 헤더 ── */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 15, fontWeight: 800, color: C.accent, margin: 0, lineHeight: 1.5 }}>
          엘오티베큠(083310) 매출 × 반도체 CAPEX × 장비수입
        </h1>
        <p style={{ fontSize: 11, color: C.axis, marginTop: 3, margin: '3px 0 0' }}>
          Rolling 4Q 합산 | 2015Q1 ~ 2025Q4 | 다운턴 음영 표시
        </p>
      </div>

      {/* ── 데이터 품질 뱃지 ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
        {[
          ['LOT 2023 분기 ✓', true], ['LOT 연매출 20~24 ✓', true],
          ['SK CAPEX 22~25 ✓', true], ['삼성DS 2025 ✓', true], ['기타 ~ 추정', false],
        ].map(([t, real]) => (
          <span key={t} style={{
            fontSize: 10, borderRadius: 4, padding: '2px 7px',
            color: real ? '#4ade80' : C.axis,
            background: real ? '#4ade8018' : '#21262d',
            border: `1px solid ${real ? '#4ade8040' : C.border}`,
          }}>{t}</span>
        ))}
      </div>

      {/* ── 레전드 토글 ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {SERIES.map(s => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: vis(s.key) ? '#21262d' : 'none',
              border: `1.5px solid ${vis(s.key) ? s.color : C.border}`,
              borderRadius: 6, padding: '7px 13px', cursor: 'pointer',
              opacity: vis(s.key) ? 1 : 0.4, transition: 'all 0.15s',
              minHeight: 40,
            }}
            aria-pressed={vis(s.key)}
          >
            {s.type === 'bar'
              ? <span style={{ width: 12, height: 12, background: s.color, borderRadius: 2, flexShrink: 0 }} />
              : <span style={{ width: 22, borderTop: `2.5px ${s.dash ? 'dashed' : 'solid'} ${s.color}`, flexShrink: 0 }} />
            }
            <span style={{ fontSize: 11, color: C.accent, whiteSpace: 'nowrap' }}>
              {s.label}
            </span>
            <span style={{ fontSize: 9, color: C.axis, marginLeft: 2 }}>{s.unit}</span>
          </button>
        ))}
      </div>

      {/* ── 메인 차트 ── */}
      <div style={{
        border: `1px solid ${C.border}`, borderRadius: 10,
        background: C.panel, padding: '14px 4px 6px',
      }}>
        <ResponsiveContainer width="100%" height={chartH}>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 50, left: 4, bottom: 4 }}
            syncId="focused"
          >
            <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />

            {/* 다운턴 음영 */}
            <ReferenceArea yAxisId="lot" x1="'18Q3" x2="'19Q4" fill={C.down} />
            <ReferenceArea yAxisId="lot" x1="'22Q3" x2="'23Q4" fill={C.down} />
            {/* 회복/슈퍼사이클 음영 */}
            <ReferenceArea yAxisId="lot" x1="'20Q4" x2="'22Q2" fill={C.up} />

            <XAxis
              dataKey="label"
              tick={<XTick />}
              interval={3}
              tickLine={false}
              axisLine={{ stroke: C.border }}
              height={22}
            />

            {/* 좌축: LOT 매출 (억원) */}
            <YAxis
              yAxisId="lot"
              tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}천` : `${v}`}
              tick={{ fill: C.axis, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={36}
              domain={[0, 5800]}
              label={{ value: '억원', angle: -90, position: 'insideLeft', fill: C.axis, fontSize: 9, offset: 8 }}
            />

            {/* 우축: 조원 (Samsung CAPEX + Korea imports) */}
            <YAxis
              yAxisId="capex"
              orientation="right"
              tickFormatter={v => `${v}`}
              tick={{ fill: C.axis, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={34}
              domain={[0, 56]}
              label={{ value: '조원', angle: 90, position: 'insideRight', fill: C.axis, fontSize: 9, offset: 10 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />

            {/* LOT 매출 4Q 누적 (bar) */}
            {vis('lot_4q') && (
              <Bar
                yAxisId="lot"
                dataKey="lot_4q"
                name="LOT 4Q"
                fill={C.lot}
                opacity={0.88}
                maxBarSize={11}
                radius={[2, 2, 0, 0]}
              />
            )}

            {/* 삼성DS CAPEX 4Q (line) */}
            {vis('sam4q_jo') && (
              <Line
                yAxisId="capex"
                dataKey="sam4q_jo"
                name="삼성DS CAPEX"
                stroke={C.sam}
                strokeWidth={2.5}
                dot={false}
                connectNulls
                activeDot={{ r: 5, fill: C.sam }}
              />
            )}

            {/* 한국 반도체장비 수입 4Q (dashed line) */}
            {vis('kr4q_jo') && (
              <Line
                yAxisId="capex"
                dataKey="kr4q_jo"
                name="장비수입 4Q"
                stroke={C.import}
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 3"
                connectNulls
                activeDot={{ r: 5, fill: C.import }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* 범례 음영 설명 */}
        <div style={{ display: 'flex', gap: 8, padding: '8px 14px 4px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: C.axis }}>■</span>
          <span style={{ fontSize: 10, color: '#ef4444' }}>다운턴 (2018H2~2019 / 2022H2~2023)</span>
          <span style={{ fontSize: 10, color: C.axis }}>■</span>
          <span style={{ fontSize: 10, color: '#22c55e' }}>슈퍼사이클 (2020Q4~2022Q2)</span>
        </div>
      </div>

      {/* ── 해석 가이드 ── */}
      <div style={{
        marginTop: 12, padding: '12px 14px',
        background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 6 }}>해석 포인트</div>
        <div style={{ fontSize: 11, color: C.axis, lineHeight: 1.9 }}>
          <div>• <span style={{ color: C.sam }}>삼성DS CAPEX</span> 급등 → <span style={{ color: C.lot }}>LOT 매출</span> 2~4분기 후 반응</div>
          <div>• <span style={{ color: C.import }}>장비수입 급증</span> = 국내 팹 증설 선행지표 (LOT 동행)</div>
          <div>• 2023 LOT 역대최대(4,730억) = 2021~22년 CAPEX 호황 delayed 반영</div>
          <div>• 2024 급감(1,775억) = 2023년 SK CAPEX -67%(6.5조) 충격</div>
          <div>• 2025 SK CAPEX 30.2조 집행 중 → 2025~26년 실적 회복 기대</div>
        </div>
      </div>

      {/* ── 우축 스케일 안내 ── */}
      <div style={{ marginTop: 8, padding: '8px 14px', background: '#161b22', border: `1px solid ${C.border}`, borderRadius: 6 }}>
        <div style={{ fontSize: 10, color: C.axis, lineHeight: 1.8 }}>
          <strong style={{ color: C.accent }}>우축(조원) 스케일 참고</strong>
          <span style={{ marginLeft: 8 }}>
            <span style={{ color: C.sam }}>삼성DS CAPEX</span>: 15~53조/년 (분기 균등 추정)
          </span>
          <span style={{ marginLeft: 8 }}>
            <span style={{ color: C.import }}>장비수입</span>: $3.2~7.6B/년 × 1300원 ≒ 4~10조 (우축)
          </span>
        </div>
      </div>

      {/* ── 푸터 ── */}
      <div style={{ fontSize: 10, color: C.axis, textAlign: 'right', marginTop: 10 }}>
        작성 2026-05-14 | 투자참고용 내부자료 | 매매를 권유하지 않습니다
      </div>
    </div>
  )
}
