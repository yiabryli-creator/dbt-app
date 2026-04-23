import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { buildReport } from './report.js'

export async function exportXlsx(entries) {
  const report = buildReport(entries)
  const wb = XLSX.utils.book_new()

  const daysAoA = [
    ['Дата', 'День недели', 'Уровень', 'Кол-во навыков'],
    ...report.comparison.map((r) => [r.date, r.dow, r.level, r.usedCount]),
  ]
  const wsDays = XLSX.utils.aoa_to_sheet(daysAoA)
  XLSX.utils.book_append_sheet(wb, wsDays, 'Days')

  const skillsAoA = [
    ['Дата', 'День недели', 'Уровень дня', 'Навык', 'Модуль', 'Использован', 'Влияние навыка'],
  ]
  for (const d of report.daySections) {
    for (const r of d.rows) {
      skillsAoA.push([
        d.date,
        d.dow,
        d.dayLevel,
        r.skill,
        r.module,
        r.used ? '✔' : '✖',
        r.influence,
      ])
    }
  }
  const wsSkills = XLSX.utils.aoa_to_sheet(skillsAoA)
  XLSX.utils.book_append_sheet(wb, wsSkills, 'Skills')

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, 'dbt-skills-report.xlsx')
}

