import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export async function exportDiaryXlsx(week) {
  const wb = XLSX.utils.book_new()

  const overviewAoA = [
    ['Дата', 'День недели', 'Уровень (0–7)'],
    ...week.overviewRows.map((r) => [r.date, r.dow, r.level]),
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overviewAoA), 'Overview')

  const skillsAoA = [
    ['Навык', 'Модуль', ...week.days.map((d) => d.dow)],
    ...week.skillRows.map((r) => [r.skillName, r.moduleName, ...r.cells]),
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(skillsAoA), 'Skills')

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `dbt-diary-${week.weekStart}.xlsx`)
}

