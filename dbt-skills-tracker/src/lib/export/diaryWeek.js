import { todayISO } from '../date.js'

const DOW_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function isoToDate(iso) {
  return new Date(iso + 'T00:00:00')
}

function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function ddmm(iso) {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`
}

function ddmmyyyy(iso) {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`
}

function weekStartMonday(iso) {
  const d = isoToDate(iso)
  const day = d.getDay() // Sun=0
  const offset = (day + 6) % 7 // Mon=0..Sun=6
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset)
  return toISO(start)
}

function addDaysISO(iso, days) {
  const d = isoToDate(iso)
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
  return toISO(next)
}

function getFullName() {
  try {
    return localStorage.getItem('dbt-fullname') || ''
  } catch {
    return ''
  }
}

const MODULE_RU = {
  mindfulness: 'Осознанность',
  distress: 'Перенос стресса',
  emotion: 'Регуляция эмоций',
  interpersonal: 'Межличностная эффективность',
}

export const SCALE_0_7 = [
  '0 – не думал(а) о навыках и не использовал(а)',
  '1 – думал(а), не применял(а)',
  '2 – хотел(а), но не применил(а)',
  '3 – пытался(ась), не получилось',
  '4 – применил(а), не помогло',
  '5 – применил(а), помогло',
  '6 – автоматически, не помогло',
  '7 – автоматически, помогло',
]

export function buildDiaryWeek(entries, skills) {
  const list = Array.isArray(entries) ? entries : []
  const maxDate = list.reduce((acc, e) => {
    const d = e?.date
    if (!d) return acc
    return acc && acc > d ? acc : d
  }, '')
  const anchor = maxDate || todayISO()
  const weekStart = weekStartMonday(anchor)
  const days = Array.from({ length: 7 }, (_, i) => {
    const iso = addDaysISO(weekStart, i)
    return { iso, ddmm: ddmm(iso), ddmmyyyy: ddmmyyyy(iso), dow: DOW_RU[i] }
  })

  const entryByDate = Object.fromEntries(
    list.filter((e) => e?.date).map((e) => [e.date, e]),
  )

  const overviewRows = days.map((d) => {
    const e = entryByDate[d.iso]
    return {
      date: d.ddmm,
      dow: d.dow,
      level: e ? String(e.dayLevel ?? '') : '',
      iso: d.iso,
    }
  })

  const skillRows = (Array.isArray(skills) ? skills : []).map((s) => {
    const skillId = s.id
    const skillName = s.name ?? ''
    const moduleName =
      s.module ||
      s.moduleName ||
      MODULE_RU[s.moduleId] ||
      s.moduleId ||
      ''

    const cells = days.map((d) => {
      const e = entryByDate[d.iso]
      const used = !!e?.skills?.[skillId]
      return used ? '+' : ''
    })

    return { skillId, skillName, moduleName, cells }
  })

  return {
    fullName: getFullName(),
    filledAt: ddmmyyyy(todayISO()),
    weekStart,
    days,
    overviewRows,
    skillRows,
    scaleLines: SCALE_0_7,
  }
}

