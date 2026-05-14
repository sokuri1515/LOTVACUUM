import { useState } from 'react'
import FocusedChart from './components/FocusedChart'
import LotVacuumChart from './components/LotVacuumChart'

const TABS = [
  { id: 'focused', label: '핵심 관계 분석' },
  { id: 'full',    label: '전체 5패널' },
]

export default function App() {
  const [tab, setTab] = useState('focused')

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, height: 46, border: 'none', cursor: 'pointer', outline: 'none',
              background: tab === t.id ? '#0d1117' : 'none',
              color: tab === t.id ? '#4ade80' : '#8b949e',
              fontWeight: tab === t.id ? 700 : 400,
              fontSize: 13,
              borderBottom: tab === t.id ? '2px solid #4ade80' : '2px solid transparent',
              transition: 'all 0.15s',
              fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'focused' ? <FocusedChart /> : <LotVacuumChart />}
    </div>
  )
}
