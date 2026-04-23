import { useState } from 'react'
import { getAllEntries } from '../lib/db.js'
import { skills } from '../data/skills.js'
import { exportDiary } from '../lib/export/diary.js'
import { useI18n } from '../lib/i18n.jsx'
import { Card } from './Card.jsx'

export function ExportCard() {
  const { t } = useI18n()
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState('')

  async function run(fn) {
    setError('')
    setIsBusy(true)
    try {
      const entries = await getAllEntries()
      const diary = exportDiary(entries, skills)
      await fn(diary)
    } catch (e) {
      setError(e?.message ? String(e.message) : 'Export error')
    } finally {
      setIsBusy(false)
    }
  }

  const btnBase =
    'app-input app-hover rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-50'

  return (
    <Card title={t('export_title')}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={btnBase}
          disabled={isBusy}
          onClick={() => run((d) => d.export.csv())}
        >
          CSV
        </button>
        <button
          type="button"
          className={btnBase}
          disabled={isBusy}
          onClick={() => run((d) => d.export.xlsx())}
        >
          XLSX
        </button>
        <button
          type="button"
          className={btnBase}
          disabled={isBusy}
          onClick={() => run((d) => d.export.docx())}
        >
          DOCX
        </button>
        <button
          type="button"
          className={btnBase}
          disabled={isBusy}
          onClick={() => run((d) => d.export.pdf())}
        >
          {t('export_pdf_print')}
        </button>
      </div>
      {error ? (
        <div className="mt-2 text-xs text-red-500">
          {error}
        </div>
      ) : null}
      <div className="app-text-muted mt-2 text-xs">
        {t('export_hint')}
      </div>
    </Card>
  )
}

