import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/Card.jsx'
import { DayLevelPicker } from '../components/DayLevelPicker.jsx'
import { SkillChipsByModule } from '../components/SkillChipsByModule.jsx'
import { SkillListDetailed } from '../components/SkillListDetailed.jsx'
import { useEntry } from '../hooks/useEntry.js'
import { todayISO } from '../lib/date.js'
import { useI18n } from '../lib/i18n.jsx'

const MODE_KEY = 'dbt-tracker-mode'

export function TrackerPage() {
  const { t } = useI18n()
  const [params, setParams] = useSearchParams()
  const date = params.get('date') || todayISO()

  const initialMode = useMemo(() => {
    const v = localStorage.getItem(MODE_KEY)
    return v === 'detailed' ? 'detailed' : 'quick'
  }, [])
  const [mode, setMode] = useState(initialMode)

  const { entry, isLoading, setDayLevel, toggleSkill, setSkillLevel, setNotes } =
    useEntry(date)

  const modeLabel =
    mode === 'quick' ? t('tracker_mode_quick') : t('tracker_mode_detailed')

  return (
    <div className="space-y-4">
      <div className="sticky top-0 -mx-4 border-b app-border bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">
              {t('tracker_title')}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = mode === 'quick' ? 'detailed' : 'quick'
              setMode(next)
              localStorage.setItem(MODE_KEY, next)
            }}
            className="app-input app-hover shrink-0 rounded-full border px-3 py-1 text-sm"
          >
            {modeLabel}
          </button>
        </div>

        <div className="mt-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setParams({ date: e.target.value })}
            className="app-input h-10 w-full rounded-xl border px-3 text-sm"
            aria-label={t('tracker_date_label')}
          />
        </div>
      </div>

      {isLoading || !entry ? (
        <p className="app-text-muted text-sm">
          {t('tracker_loading')}
        </p>
      ) : (
        <>
          <Card title={t('tracker_day_level')}>
            <DayLevelPicker value={entry.dayLevel} onChange={setDayLevel} />
          </Card>

          <Card
            title={
              mode === 'quick' ? t('tracker_skills_quick') : t('tracker_skills')
            }
          >
            {mode === 'quick' ? (
              <SkillChipsByModule
                activeMap={entry.skills}
                onToggle={toggleSkill}
              />
            ) : (
              <SkillListDetailed
                checkedMap={entry.skills}
                levelMap={entry.skillLevels}
                onToggle={toggleSkill}
                onLevelChange={setSkillLevel}
              />
            )}
          </Card>

          <Card title={t('tracker_notes')}>
            <textarea
              value={entry.notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="app-input w-full resize-none rounded-xl border px-3 py-2 text-sm"
              placeholder="…"
            />
          </Card>
        </>
      )}
    </div>
  )
}

