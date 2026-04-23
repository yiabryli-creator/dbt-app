import { moduleById, skills } from '../../data/skills.js'
import { dowRuFromISO } from '../date.js'

export function countUsedSkills(entry) {
  const used = entry?.skills || {}
  return Object.values(used).filter(Boolean).length
}

export function buildDaySection(entry) {
  const dow = dowRuFromISO(entry.date)
  const usedCount = countUsedSkills(entry)

  const rows = skills.map((s) => {
    const used = !!entry.skills?.[s.id]
    const level =
      entry.skillLevels && Object.prototype.hasOwnProperty.call(entry.skillLevels, s.id)
        ? entry.skillLevels[s.id]
        : null
    return {
      skill: s.name,
      module: moduleById[s.moduleId]?.name ?? '',
      used,
      influence: level === null || level === undefined ? '' : String(level),
    }
  })

  return {
    date: entry.date,
    dow,
    dayLevel: entry.dayLevel ?? 0,
    usedCount,
    rows,
  }
}

export function buildReport(entries) {
  const days = [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  const daySections = days.map(buildDaySection)

  const comparison = daySections.map((d) => ({
    date: d.date,
    dow: d.dow,
    level: d.dayLevel,
    usedCount: d.usedCount,
  }))

  const summary = {
    daysCount: daySections.length,
    avgDayLevel:
      daySections.length === 0
        ? null
        : daySections.reduce((acc, d) => acc + d.dayLevel, 0) / daySections.length,
  }

  return { daySections, comparison, summary }
}

