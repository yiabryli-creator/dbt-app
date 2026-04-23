import { localize, modules, skills, moduleById } from '../data/skills.js'
import { useI18n } from '../lib/i18n.jsx'

const LEVELS = ['', 0, 1, 2, 3, 4, 5, 6, 7]

export function SkillListDetailed({
  checkedMap,
  levelMap,
  onToggle,
  onLevelChange,
}) {
  const { lang, t } = useI18n()
  const moduleLabel = Object.fromEntries(
    modules.map((m) => [m.id, localize(m.name, lang)]),
  )

  return (
    <div className="space-y-2">
      {skills.map((s) => (
        <div
          key={s.id}
          className="app-card flex items-center justify-between gap-3 rounded-xl border p-3"
        >
          <label className="flex min-w-0 flex-1 items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--accent)]"
              checked={!!checkedMap?.[s.id]}
              onChange={() => onToggle(s.id)}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {localize(s.name, lang)}
              </div>
              <div className="app-text-muted text-xs">
                {moduleLabel[s.moduleId] ??
                  localize(moduleById[s.moduleId]?.name ?? '', lang)}
              </div>
            </div>
          </label>

          <select
            className="app-input h-9 rounded-lg border px-2 text-sm"
            value={levelMap?.[s.id] ?? ''}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === '') return onLevelChange(s.id, null)
              return onLevelChange(s.id, Number(raw))
            }}
            aria-label={t('tracker_skill_impact_aria')}
          >
            {LEVELS.map((v) => (
              <option key={String(v)} value={v === '' ? '' : v}>
                {v === '' ? '—' : v}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

