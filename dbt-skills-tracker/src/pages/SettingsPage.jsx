import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n.jsx'
import {
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  getStoredAccessibility,
  getStoredTheme,
  setStoredAccessibility,
  setStoredTheme,
  THEMES,
} from '../lib/theme.js'

const THEME_LABEL_KEYS = {
  light: 'theme_light',
  dark: 'theme_dark',
  'purple-dark': 'theme_purple_dark',
  'purple-light': 'theme_purple_light',
  'green-dark': 'theme_green_dark',
  'green-light': 'theme_green_light',
  'pink-dark': 'theme_pink_dark',
  'pink-light': 'theme_pink_light',
}

const THEME_SWATCHES = {
  light: ['#ffffff', '#ffffff', '#0f172a'],
  dark: ['#020617', '#0f172a', '#f8fafc'],
  'purple-dark': ['#121022', '#1f1b36', '#8b5cf6'],
  'purple-light': ['#f7f3ff', '#ffffff', '#7c3aed'],
  'green-dark': ['#0f1d17', '#163126', '#22c55e'],
  'green-light': ['#f2fdf5', '#ffffff', '#16a34a'],
  'pink-dark': ['#251022', '#34182f', '#ec4899'],
  'pink-light': ['#fff1f7', '#ffffff', '#db2777'],
}

const BASE_THEMES = ['light', 'dark']
const AESTHETIC_THEMES = THEMES.filter((theme) => !BASE_THEMES.includes(theme))
const FONT_SIZE_LABELS = { small: 'font_size_small', medium: 'font_size_medium', large: 'font_size_large', xlarge: 'font_size_xlarge' }
const FONT_WEIGHT_LABELS = { normal: 'font_weight_normal', medium: 'font_weight_medium', bold: 'font_weight_bold' }

export function SettingsPage() {
  const initial = useMemo(() => getStoredTheme(), [])
  const [theme, setTheme] = useState(initial)
  const initialAccessibility = useMemo(() => getStoredAccessibility(), [])
  const [fontSize, setFontSize] = useState(initialAccessibility.fontSize)
  const [fontWeight, setFontWeight] = useState(initialAccessibility.fontWeight)
  const { lang, setLang, t } = useI18n()
  const [fullName, setFullName] = useState(() => {
    try {
      return localStorage.getItem('dbt-fullname') || ''
    } catch {
      return ''
    }
  })

  return (
    <div className="space-y-4">
      <h1 className="text-base font-semibold">{t('settings_title')}</h1>

      <div className="app-card rounded-xl border p-4">
        <div className="text-sm font-semibold">{t('settings_fullname')}</div>
        <div className="mt-2">
          <input
            value={fullName}
            onChange={(e) => {
              const v = e.target.value
              setFullName(v)
              try {
                localStorage.setItem('dbt-fullname', v)
              } catch {
                // ignore
              }
            }}
            className="app-input h-10 w-full rounded-xl border px-3 text-sm"
            placeholder=""
            aria-label={t('settings_fullname')}
          />
        </div>
      </div>

      <div className="app-card rounded-xl border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">
              {t('settings_language_title')}
            </div>
            <div className="app-text-muted text-xs">
              {t('settings_language_hint')}
            </div>
          </div>
          <div className="app-border flex rounded-lg border">
            {['ru', 'en'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setLang(v)}
                className={[
                  'px-3 py-2 text-xs font-semibold uppercase',
                  lang === v
                    ? 'app-accent'
                    : 'app-input app-hover',
                ].join(' ')}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="app-card rounded-xl border p-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold">{t('settings_accessibility_title')}</div>
            <div className="app-text-muted text-xs">
              {t('settings_accessibility_hint')}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase app-text-muted">
              {t('settings_font_size')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FONT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFontSize(option)
                    setStoredAccessibility({ fontSize: option, fontWeight })
                  }}
                  className={[
                    'app-input app-hover rounded-lg border px-3 py-2 text-xs font-semibold',
                    fontSize === option ? 'app-accent-outline ring-1 ring-[var(--accent)]' : '',
                  ].join(' ')}
                >
                  {t(FONT_SIZE_LABELS[option])}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase app-text-muted">
              {t('settings_font_weight')}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FONT_WEIGHT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFontWeight(option)
                    setStoredAccessibility({ fontSize, fontWeight: option })
                  }}
                  className={[
                    'app-input app-hover rounded-lg border px-3 py-2 text-xs font-semibold',
                    fontWeight === option
                      ? 'app-accent-outline ring-1 ring-[var(--accent)]'
                      : '',
                  ].join(' ')}
                >
                  {t(FONT_WEIGHT_LABELS[option])}
                </button>
              ))}
            </div>
          </div>

          <div className="app-card rounded-lg border p-3">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('settings_preview')}
            </div>
            <p className="mt-2">
              {t('settings_preview_text')}
            </p>
          </div>
        </div>
      </div>

      <div className="app-card rounded-xl border p-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold">{t('settings_theme_title')}</div>
            <div className="app-text-muted text-xs">
              {t('settings_theme_hint')}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase app-text-muted">
              {t('settings_theme_group_base')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BASE_THEMES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setTheme(v)
                    setStoredTheme(v)
                  }}
                  className={[
                    'app-card app-hover rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-colors',
                    theme === v
                      ? 'app-accent-outline ring-2 ring-[var(--accent)]'
                      : 'app-border',
                  ].join(' ')}
                >
                  <div className="mb-2 flex gap-1">
                    {THEME_SWATCHES[v].map((color) => (
                      <span
                        key={`${v}-${color}`}
                        className="h-3 w-3 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {t(THEME_LABEL_KEYS[v])}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase app-text-muted">
              {t('settings_theme_group_aesthetic')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AESTHETIC_THEMES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setTheme(v)
                    setStoredTheme(v)
                  }}
                  className={[
                    'app-card app-hover rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-colors',
                    theme === v
                      ? 'app-accent-outline ring-2 ring-[var(--accent)]'
                      : 'app-border',
                  ].join(' ')}
                >
                  <div className="mb-2 flex gap-1">
                    {THEME_SWATCHES[v].map((color) => (
                      <span
                        key={`${v}-${color}`}
                        className="h-3 w-3 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {t(THEME_LABEL_KEYS[v])}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

