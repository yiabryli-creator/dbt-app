const DOW_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function dowRuFromISO(iso) {
  const d = new Date(iso + 'T00:00:00')
  return DOW_RU[d.getDay()]
}

export function monthLabelRu(year, monthIndex) {
  const dt = new Date(year, monthIndex, 1)
  return dt.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}

export function buildMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const startOffset = (first.getDay() + 6) % 7 // Monday=0
  const start = new Date(year, monthIndex, 1 - startOffset)

  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const iso = toISODate(d)
    days.push({
      iso,
      inMonth: d.getMonth() === monthIndex,
    })
  }
  return days
}

