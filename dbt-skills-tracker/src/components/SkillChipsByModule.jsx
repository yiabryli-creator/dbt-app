import { getSkillsByModule, localize, modules } from '../data/skills.js'
import { useI18n } from '../lib/i18n.jsx'
import { SkillChip } from './SkillChip.jsx'

export function SkillChipsByModule({ activeMap, onToggle }) {
  const { lang } = useI18n()
  const byModule = getSkillsByModule()

  return (
    <div className="space-y-4">
      {modules.map((m) => (
        <section key={m.id} className="space-y-2">
          <h3 className="app-text-muted text-xs font-semibold uppercase tracking-wide">
            {localize(m.name, lang)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {byModule[m.id].map((s) => (
              <SkillChip
                key={s.id}
                label={localize(s.name, lang)}
                active={!!activeMap?.[s.id]}
                onClick={() => onToggle(s.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

