import { buildReport } from './report.js'

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function printPdf(entries) {
  const report = buildReport(entries)
  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) return

  const dayBlocks = report.daySections
    .map((d) => {
      const rows = d.rows
        .map(
          (r) => `
          <tr>
            <td>${escapeHtml(r.skill)}</td>
            <td>${escapeHtml(r.module)}</td>
            <td style="text-align:center">${r.used ? '✔' : '✖'}</td>
            <td style="text-align:center">${escapeHtml(r.influence)}</td>
          </tr>`,
        )
        .join('')

      return `
      <section class="day">
        <h2>День: ${escapeHtml(d.dow)} — ${escapeHtml(d.date)}</h2>
        <div class="meta">
          <div>Уровень дня: <b>${escapeHtml(d.dayLevel)}</b></div>
          <div>Количество навыков: <b>${escapeHtml(d.usedCount)}</b></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Навык</th>
              <th>Модуль</th>
              <th>Использован</th>
              <th>Влияние навыка</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="summary">
          <b>Сводка дня:</b> всего навыков ${escapeHtml(d.usedCount)}, уровень дня ${escapeHtml(d.dayLevel)}
        </div>
      </section>
      `
    })
    .join('')

  const comparisonRows = report.comparison
    .map(
      (r) => `
      <tr>
        <td>${escapeHtml(r.date)}</td>
        <td>${escapeHtml(r.dow)}</td>
        <td style="text-align:center">${escapeHtml(r.level)}</td>
        <td style="text-align:center">${escapeHtml(r.usedCount)}</td>
      </tr>`,
    )
    .join('')

  w.document.open()
  w.document.write(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DBT Skills Tracker — Report</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #0f172a; }
      h1 { font-size: 18px; margin: 0 0 12px; }
      h2 { font-size: 14px; margin: 0 0 8px; }
      .day { page-break-inside: avoid; margin: 0 0 24px; }
      .meta { display: flex; gap: 16px; margin: 0 0 10px; font-size: 12px; color: #334155; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
      th { background: #f1f5f9; text-align: left; }
      .summary { margin-top: 10px; font-size: 12px; }
      .section-title { margin-top: 28px; }
    </style>
  </head>
  <body>
    <h1>DBT Skills Tracker — Report</h1>
    ${dayBlocks}

    <h2 class="section-title">Сравнение дней</h2>
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>День недели</th>
          <th>Уровень</th>
          <th>Кол-во навыков</th>
        </tr>
      </thead>
      <tbody>
        ${comparisonRows}
      </tbody>
    </table>
    <script>
      window.onload = () => window.print();
    </script>
  </body>
</html>
  `)
  w.document.close()
}

