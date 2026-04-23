import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card.jsx'
import { getAllEntries } from '../lib/db.js'
import { buildMonthGrid, monthLabelRu, todayISO } from '../lib/date.js'
import { useI18n } from '../lib/i18n.jsx'

function levelColor(level, inMonth) {
  const base =
    level >= 6
      ? 'bg-emerald-500/80'
      : level >= 4
        ? 'bg-emerald-400/40'
        : level >= 2
          ? 'bg-amber-400/35'
          : level >= 1
            ? 'bg-amber-400/20'
            : 'bg-[var(--border)]/60'

  return [base, inMonth ? '' : 'opacity-50'].join(' ')
}

export function CalendarPage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const today = todayISO()
  const todayDate = useMemo(() => new Date(today + 'T00:00:00'), [today])
  const [year, setYear] = useState(todayDate.getFullYear())
  const [monthIndex, setMonthIndex] = useState(todayDate.getMonth())
  const [levels, setLevels] = useState({})

  useEffect(() => {
    let cancelled = false
    getAllEntries().then((all) => {
      if (cancelled) return
      const map = {}
      for (const e of all) map[e.date] = e.dayLevel
      setLevels(map)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const days = useMemo(
    () => buildMonthGrid(year, monthIndex),
    [monthIndex, year],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">{t('calendar_title')}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const d = new Date(year, monthIndex - 1, 1)
              setYear(d.getFullYear())
              setMonthIndex(d.getMonth())
            }}
            className="app-input app-hover rounded-lg border px-3 py-2 text-sm"
            aria-label={t('calendar_prev_month')}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date(year, monthIndex + 1, 1)
              setYear(d.getFullYear())
              setMonthIndex(d.getMonth())
            }}
            className="app-input app-hover rounded-lg border px-3 py-2 text-sm"
            aria-label={t('calendar_next_month')}
          >
            →
          </button>
        </div>
      </div>

      <Card
        title={
          lang === 'ru'
            ? monthLabelRu(year, monthIndex)
            : new Date(year, monthIndex, 1).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
        }
      >
        <div className="grid grid-cols-7 gap-2">
          {[
            t('weekday_mon'),
            t('weekday_tue'),
            t('weekday_wed'),
            t('weekday_thu'),
            t('weekday_fri'),
            t('weekday_sat'),
            t('weekday_sun'),
          ].map((d) => (
            <div
              key={d}
              className="app-text-muted text-center text-xs font-semibold"
            >
              {d}
            </div>
          ))}

          {days.map((d) => {
            const level = levels[d.iso] ?? 0
            const isToday = d.iso === today
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => navigate(`/?date=${d.iso}`)}
                className={[
                  'flex h-11 items-center justify-center rounded-xl border text-sm',
                  'app-border',
                  levelColor(level, d.inMonth),
                  isToday ? 'ring-2 ring-[var(--accent)]' : '',
                ].join(' ')}
                aria-label={d.iso}
              >
                {Number(d.iso.slice(-2))}
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

