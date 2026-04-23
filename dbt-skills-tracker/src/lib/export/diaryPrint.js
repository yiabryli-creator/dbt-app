function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function printDiaryPdf(week) {
  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) return

  const overviewRows = week.overviewRows
    .map(
      (r) => `
      <tr>
        <td>${escapeHtml(r.date)}</td>
        <td>${escapeHtml(r.dow)}</td>
        <td class="c">${escapeHtml(r.level)}</td>
      </tr>`,
    )
    .join('')

  const skillsHeader = `
    <tr>
      <th>Навык</th>
      <th>Модуль</th>
      ${week.days.map((d) => `<th class="c">${escapeHtml(d.dow)}</th>`).join('')}
    </tr>
  `

  const skillsRows = week.skillRows
    .map((r) => {
      const cells = r.cells
        .map((c) => `<td class="c">${escapeHtml(c)}</td>`)
        .join('')
      return `
        <tr>
          <td class="skill">${escapeHtml(r.skillName)}</td>
          <td class="module">${escapeHtml(r.moduleName)}</td>
          ${cells}
        </tr>
      `
    })
    .join('')

  const scale = week.scaleLines
    .map((l) => `<div class="scale-line">${escapeHtml(l)}</div>`)
    .join('')

  w.document.open()
  w.document.write(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DBT Diary Card</title>
    <style>
      @page { size: A4; margin: 14mm; }
      * { box-sizing: border-box; }
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #0f172a; margin: 0; }
      .header { display: grid; gap: 6px; margin-bottom: 10px; }
      .name { font-size: 14px; font-weight: 700; min-height: 18px; }
      .filled { font-size: 12px; color: #334155; }
      h2 { font-size: 12px; margin: 14px 0 6px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; }
      th, td { border: 1px solid #cbd5e1; padding: 4px 6px; vertical-align: top; word-wrap: break-word; }
      th { background: #f1f5f9; text-align: left; font-weight: 700; }
      .c { text-align: center; }
      .overview td:nth-child(1) { width: 20%; }
      .overview td:nth-child(2) { width: 30%; }
      .overview td:nth-child(3) { width: 50%; }
      .skills th:nth-child(1), .skills td:nth-child(1) { width: 26%; }
      .skills th:nth-child(2), .skills td:nth-child(2) { width: 22%; }
      .skills th:nth-child(n+3), .skills td:nth-child(n+3) { width: calc(52% / 7); }
      .skill, .module { white-space: normal; }
      .scale { margin-top: 10px; font-size: 11px; }
      .scale-line { margin: 2px 0; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="name">${escapeHtml(week.fullName || '')}</div>
      <div class="filled">Дневник заполнен: ${escapeHtml(week.filledAt)}</div>
    </div>

    <h2>Таблица недели (общий обзор)</h2>
    <table class="overview">
      <thead>
        <tr>
          <th>Дата</th>
          <th>День недели</th>
          <th class="c">Уровень (0–7)</th>
        </tr>
      </thead>
      <tbody>
        ${overviewRows}
      </tbody>
    </table>

    <h2>Основная таблица навыков</h2>
    <table class="skills">
      <thead>${skillsHeader}</thead>
      <tbody>${skillsRows}</tbody>
    </table>

    <div class="scale">
      <h2>Шкала 0–7</h2>
      ${scale}
    </div>

    <script>
      window.onload = () => window.print();
    </script>
  </body>
</html>
  `)
  w.document.close()
}

