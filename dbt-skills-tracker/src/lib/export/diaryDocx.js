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

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width
      ? { size: opts.width, type: WidthType.PERCENTAGE }
      : undefined,
    children: [
      new Paragraph({
        children: [new TextRun(String(text ?? ''))],
      }),
    ],
  })
}

function headerText(text) {
  return new Paragraph({
    spacing: { after: 180 },
    children: [new TextRun({ text, bold: true })],
  })
}

export async function exportDiaryDocx(week) {
  const children = []

  children.push(headerText(week.fullName || ''))
  children.push(
    new Paragraph({
      spacing: { after: 260 },
      children: [new TextRun(`Дневник заполнен: ${week.filledAt}`)],
    }),
  )

  // Overview
  children.push(headerText('Таблица недели (общий обзор)'))
  const overviewRows = [
    new TableRow({
      children: [
        cell('Дата', { width: 34 }),
        cell('День недели', { width: 33 }),
        cell('Уровень (0–7)', { width: 33 }),
      ],
    }),
    ...week.overviewRows.map(
      (r) =>
        new TableRow({
          children: [cell(r.date), cell(r.dow), cell(r.level)],
        }),
    ),
  ]
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: overviewRows,
    }),
  )

  children.push(new Paragraph({ spacing: { after: 260 } }))

  // Skills
  children.push(headerText('Основная таблица навыков'))
  const skillsHeader = new TableRow({
    children: [
      cell('Навык', { width: 26 }),
      cell('Модуль', { width: 22 }),
      ...week.days.map((d) => cell(d.dow, { width: 52 / 7 })),
    ],
  })

  const skillsRows = [
    skillsHeader,
    ...week.skillRows.map((r) => {
      return new TableRow({
        children: [cell(r.skillName), cell(r.moduleName), ...r.cells.map(cell)],
      })
    }),
  ]

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: skillsRows,
    }),
  )

  children.push(new Paragraph({ spacing: { after: 260 } }))

  // Scale 0–7
  children.push(headerText('Шкала 0–7'))
  for (const line of week.scaleLines) {
    children.push(new Paragraph({ children: [new TextRun(line)] }))
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `dbt-diary-${week.weekStart}.docx`)
}

