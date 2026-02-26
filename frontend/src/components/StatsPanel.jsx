import { useEffect, useState } from 'react'
import { getStatus } from '../api'
import s from './StatsPanel.module.css'

export default function StatsPanel() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStatus().then(setStats).catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <div className={s.panel}>
      <Stat label="Слов в словаре" value={stats.dictionarySize?.toLocaleString()} />
      <Stat label="Биграмм" value={stats.bigramCount?.toLocaleString()} />
      <Stat label="Статус" value={stats.status === 'ok' ? '✓ онлайн' : '✗ офлайн'} ok={stats.status === 'ok'} />
    </div>
  )
}

function Stat({ label, value, ok }) {
  return (
    <div className={s.stat}>
      <span className={s.label}>{label}</span>
      <span className={`${s.value} ${ok === false ? s.error : ok === true ? s.ok : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}
