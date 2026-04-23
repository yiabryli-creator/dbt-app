import { saveAs } from 'file-saver'

function esc(v) {
  const s = String(v ?? '')
  if (/[;\n"]/g.test(s)) return `"${s.replaceAll('"', '""')}"`
  return s
}

function line(cols) {
  return cols.map(esc).join(';')
}

export async function exportDiaryCsv(week) {
  const lines = []

  lines.push(line(['ФИО', week.fullName || '']))
  lines.push(line([`Дневник заполнен: ${week.filledAt}`]))
  lines.push('')

  // Overview
  lines.push(line(['Дата', 'День недели', 'Уровень (0–7)']))
  for (const r of week.overviewRows) {
    lines.push(line([r.date, r.dow, r.level]))
  }
  lines.push('')

  // Skills
  lines.push(line(['Навык', 'Модуль', ...week.days.map((d) => d.dow)]))
  for (const r of week.skillRows) {
    lines.push(line([r.skillName, r.moduleName, ...r.cells]))
  }
  lines.push('')

  // Scale
  for (const s of week.scaleLines) lines.push(line([s]))

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `dbt-diary-${week.weekStart}.csv`)
}

