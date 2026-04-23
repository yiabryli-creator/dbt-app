import { exportDiaryCsv } from './diaryCsv.js'
import { exportDiaryDocx } from './diaryDocx.js'
import { printDiaryPdf } from './diaryPrint.js'
import { exportDiaryXlsx } from './diaryXlsx.js'
import { buildDiaryWeek } from './diaryWeek.js'

/**
 * exportDiary(entries, skills)
 * - группирует данные по неделе
 * - формирует таблицы
 * - экспортирует во все форматы (через возвращаемые методы)
 */
export function exportDiary(entries, skills) {
  const week = buildDiaryWeek(entries, skills)
  return {
    week,
    export: {
      csv: () => exportDiaryCsv(week),
      xlsx: () => exportDiaryXlsx(week),
      docx: () => exportDiaryDocx(week),
      pdf: () => printDiaryPdf(week),
      all: async () => {
        await exportDiaryCsv(week)
        await exportDiaryXlsx(week)
        await exportDiaryDocx(week)
        printDiaryPdf(week)
      },
    },
  }
}

