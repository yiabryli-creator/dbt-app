const STORAGE_KEY = 'theme'
const ACCESSIBILITY_STORAGE_KEY = 'text_accessibility'
export const DEFAULT_THEME = 'light'
const DEFAULT_FONT_SIZE = 'medium'
const DEFAULT_FONT_WEIGHT = 'normal'

export const THEMES = [
  'light',
  'dark',
  'purple-dark',
  'purple-light',
  'green-dark',
  'green-light',
  'pink-dark',
  'pink-light',
]

export const FONT_SIZE_OPTIONS = ['small', 'medium', 'large', 'xlarge']
export const FONT_WEIGHT_OPTIONS = ['normal', 'medium', 'bold']
const FONT_SIZE_MAP = {
  small: '14px',
  medium: '16px',
  large: '18px',
  xlarge: '20px',
}
const FONT_WEIGHT_MAP = {
  normal: '400',
  medium: '500',
  bold: '700',
}

function isValidTheme(theme) {
  return THEMES.includes(theme)
}

function isValidFontSize(value) {
  return FONT_SIZE_OPTIONS.includes(value)
}

function isValidFontWeight(value) {
  return FONT_WEIGHT_OPTIONS.includes(value)
}

export function getStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isValidTheme(value) ? value : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function setStoredTheme(theme) {
  const nextTheme = isValidTheme(theme) ? theme : DEFAULT_THEME
  try {
    localStorage.setItem(STORAGE_KEY, nextTheme)
  } catch {
    // ignore (e.g. privacy mode restrictions)
  }
  applyThemeToDom(nextTheme)
}

export function applyThemeToDom(theme) {
  const nextTheme = isValidTheme(theme) ? theme : DEFAULT_THEME
  const root = document.documentElement
  root.dataset.theme = nextTheme
  if (nextTheme === 'dark' || nextTheme.endsWith('-dark')) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function applyStoredTheme() {
  const theme = getStoredTheme()
  setStoredTheme(theme)
  applyAccessibilityToDom(getStoredAccessibility())
}

export function getStoredAccessibility() {
  try {
    const raw = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)
    if (!raw) {
      return { fontSize: DEFAULT_FONT_SIZE, fontWeight: DEFAULT_FONT_WEIGHT }
    }
    const parsed = JSON.parse(raw)
    const normalizedFontSize =
      parsed?.fontSize === 'extra-large' ? 'xlarge' : parsed?.fontSize
    const fontSize = isValidFontSize(normalizedFontSize)
      ? normalizedFontSize
      : DEFAULT_FONT_SIZE
    const fontWeight = isValidFontWeight(parsed?.fontWeight)
      ? parsed.fontWeight
      : DEFAULT_FONT_WEIGHT
    return { fontSize, fontWeight }
  } catch {
    return { fontSize: DEFAULT_FONT_SIZE, fontWeight: DEFAULT_FONT_WEIGHT }
  }
}

export function setStoredAccessibility(nextSettings) {
  const fontSize = isValidFontSize(nextSettings?.fontSize)
    ? nextSettings.fontSize
    : DEFAULT_FONT_SIZE
  const fontWeight = isValidFontWeight(nextSettings?.fontWeight)
    ? nextSettings.fontWeight
    : DEFAULT_FONT_WEIGHT
  const normalized = { fontSize, fontWeight }
  try {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(normalized))
  } catch {
    // ignore
  }
  applyAccessibilityToDom(normalized)
}

export function applyAccessibilityToDom(settings) {
  const fontSize = isValidFontSize(settings?.fontSize)
    ? settings.fontSize
    : DEFAULT_FONT_SIZE
  const fontWeight = isValidFontWeight(settings?.fontWeight)
    ? settings.fontWeight
    : DEFAULT_FONT_WEIGHT
  const root = document.documentElement
  root.dataset.fontSize = fontSize
  root.dataset.fontWeight = fontWeight
  root.style.setProperty('--font-size', FONT_SIZE_MAP[fontSize])
  root.style.setProperty('--font-weight', FONT_WEIGHT_MAP[fontWeight])
}

