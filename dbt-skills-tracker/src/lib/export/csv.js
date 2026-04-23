import { saveAs } from 'file-saver'
import { buildReport } from './report.js'

function esc(v) {
  const s = String(v ?? '')
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`
  return s
}

function toCsvLine(cols) {
  return cols.map(esc).join(',')
}

export async function exportCsv(entries) {
  const report = buildReport(entries)
  const lines = []

  for (const day of report.daySections) {
    lines.push(toCsvLine(['День', day.dow, day.date, 'уровень дня', day.dayLevel]))
    lines.push(toCsvLine(['количество навыков', day.usedCount]))
    lines.push('')
    lines.push(toCsvLine(['Навык', 'Модуль', 'Использован', 'Влияние навыка']))
    for (const r of day.rows) {
      lines.push(
        toCsvLine([r.skill, r.module, r.used ? '✔' : '✖', r.influence]),
      )
    }
    lines.push('')
    lines.push(toCsvLine(['Сводка дня', 'всего навыков', day.usedCount, 'уровень дня', day.dayLevel]))
    lines.push('')
    lines.push('')
  }

  lines.push(toCsvLine(['Сравнение дней']))
  lines.push(toCsvLine(['Дата', 'День недели', 'Уровень', 'Кол-во навыков']))
  for (const r of report.comparison) {
    lines.push(toCsvLine([r.date, r.dow, r.level, r.usedCount]))
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, 'dbt-skills-report.csv')
}

