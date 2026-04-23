import { saveAs } from 'file-saver'
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import { buildReport } from './report.js'

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    children: [new Paragraph({ children: [new TextRun(String(text ?? ''))] })],
  })
}

function heading(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true })],
  })
}

export async function exportDocx(entries) {
  const report = buildReport(entries)
  const children = []

  children.push(heading('DBT Skills Tracker — Report'))

  for (const day of report.daySections) {
    children.push(heading(`День: ${day.dow} — ${day.date}`))
    children.push(
      new Paragraph({
        children: [
          new TextRun(`Уровень дня: ${day.dayLevel}`),
          new TextRun('    '),
          new TextRun(`Количество навыков: ${day.usedCount}`),
        ],
      }),
    )

    const rows = [
      new TableRow({
        children: [
          cell('Навык', { width: 35 }),
          cell('Модуль', { width: 35 }),
          cell('Использован', { width: 15 }),
          cell('Влияние навыка', { width: 15 }),
        ],
      }),
      ...day.rows.map(
        (r) =>
          new TableRow({
            children: [
              cell(r.skill),
              cell(r.module),
              cell(r.used ? '✔' : '✖'),
              cell(r.influence),
            ],
          }),
      ),
    ]

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows,
      }),
    )

    children.push(
      new Paragraph({
        spacing: { before: 200, after: 400 },
        children: [
          new TextRun({ text: 'Сводка дня: ', bold: true }),
          new TextRun(`всего навыков ${day.usedCount}, уровень дня ${day.dayLevel}`),
        ],
      }),
    )
  }

  children.push(heading('Сравнение дней'))
  const cmpRows = [
    new TableRow({
      children: [
        cell('Дата', { width: 25 }),
        cell('День недели', { width: 25 }),
        cell('Уровень', { width: 25 }),
        cell('Кол-во навыков', { width: 25 }),
      ],
    }),
    ...report.comparison.map(
      (r) =>
        new TableRow({
          children: [cell(r.date), cell(r.dow), cell(r.level), cell(r.usedCount)],
        }),
    ),
  ]
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: cmpRows,
    }),
  )

  const doc = new Document({
    sections: [{ properties: {}, children }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, 'dbt-skills-report.docx')
}

