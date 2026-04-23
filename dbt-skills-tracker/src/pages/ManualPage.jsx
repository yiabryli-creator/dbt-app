import { useMemo, useState } from 'react'
import { Card } from '../components/Card.jsx'
import { dbtSkillsManual, localizeManual } from '../data/manual.js'
import { useI18n } from '../lib/i18n.jsx'

export function ManualPage() {
  const { lang, t } = useI18n()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = useMemo(
    () => dbtSkillsManual.map((section) => localizeManual(section.category, lang)),
    [lang],
  )

  const visibleSections = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return dbtSkillsManual
      .filter((section) =>
        activeCategory === 'all'
          ? true
          : localizeManual(section.category, lang) === activeCategory,
      )
      .map((section) => {
        const skills = section.skills.filter((skill) => {
          if (!normalized) return true
          const haystack = `${localizeManual(skill.name, lang)} ${localizeManual(skill.description, lang)} ${localizeManual(skill.example, lang)}`.toLowerCase()
          return haystack.includes(normalized)
        })
        return { ...section, skills }
      })
      .filter((section) => section.skills.length > 0)
  }, [activeCategory, lang, query])

  return (
    <div className="space-y-4">
      <h1 className="text-base font-semibold">{t('manual_title')}</h1>

      <Card>
        <div className="space-y-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('manual_search_placeholder')}
            className="app-input h-10 w-full rounded-xl border px-3 text-sm"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                activeCategory === 'all' ? 'app-accent' : 'app-input app-hover',
              ].join(' ')}
            >
              {t('manual_filter_all')}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={[
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                  activeCategory === category
                    ? 'app-accent'
                    : 'app-input app-hover',
                ].join(' ')}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {visibleSections.length === 0 ? (
        <Card>
          <div className="app-text-muted text-sm">{t('manual_empty')}</div>
        </Card>
      ) : (
        visibleSections.map((section) => (
          <section key={localizeManual(section.category, lang)} className="space-y-2">
            <h2 className="text-sm font-semibold">
              {localizeManual(section.category, lang)}
            </h2>
            <div className="space-y-2">
              {section.skills.map((skill, index) => (
                <article
                  key={`${localizeManual(section.category, lang)}-${localizeManual(skill.name, lang)}`}
                  className="manual-card app-card rounded-xl border p-3"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <h3 className="text-sm font-semibold">
                    {localizeManual(skill.name, lang)}
                  </h3>
                  <p className="app-text-muted mt-2 text-sm">
                    {localizeManual(skill.description, lang)}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">{t('manual_example_label')} </span>
                    {localizeManual(skill.example, lang)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
