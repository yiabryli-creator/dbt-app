import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card.jsx'
import { ExportCard } from '../components/ExportCard.jsx'
import { localize, skills, moduleById } from '../data/skills.js'
import { getAllEntries } from '../lib/db.js'
import { useI18n } from '../lib/i18n.jsx'

export function AnalyticsPage() {
  const { lang, t } = useI18n()
  const [entries, setEntries] = useState([])

  useEffect(() => {
    let cancelled = false
    getAllEntries().then((all) => {
      if (cancelled) return
      setEntries(all)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const avgDayLevel = useMemo(() => {
    if (entries.length === 0) return null
    const sum = entries.reduce((acc, e) => acc + (e.dayLevel ?? 0), 0)
    return sum / entries.length
  }, [entries])

  const usage = useMemo(() => {
    const counts = Object.fromEntries(skills.map((s) => [s.id, 0]))
    for (const e of entries) {
      const used = e.skills || {}
      for (const id of Object.keys(used)) {
        if (used[id]) counts[id] = (counts[id] || 0) + 1
      }
    }
    return skills.map((s) => ({
      ...s,
      moduleName: localize(moduleById[s.moduleId]?.name ?? '', lang),
      count: counts[s.id] || 0,
      localizedName: localize(s.name, lang),
    }))
  }, [entries, lang])

  return (
    <div className="space-y-4">
      <h1 className="text-base font-semibold">{t('analytics_title')}</h1>

      <Card title={t('analytics_avg_day_level')}>
        <div className="text-3xl font-semibold">
          {avgDayLevel === null ? '—' : avgDayLevel.toFixed(2)}
        </div>
      </Card>

      <Card title={t('analytics_skill_usage')}>
        <div className="space-y-2">
          {usage.map((s) => (
            <div
              key={s.id}
              className="app-card flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold">{s.localizedName}</div>
                <div className="app-text-muted text-xs">
                  {s.moduleName}
                </div>
              </div>
              <div className="app-input shrink-0 rounded-lg border px-2 py-1 text-xs font-semibold">
                {s.count}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ExportCard />
    </div>
  )
}

