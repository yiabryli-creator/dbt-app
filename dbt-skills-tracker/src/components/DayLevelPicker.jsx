const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7]

export function DayLevelPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {LEVELS.map((lvl) => (
        <button
          key={lvl}
          type="button"
          onClick={() => onChange(lvl)}
          className={[
            'h-9 min-w-9 rounded-full border px-3 text-sm font-semibold',
            value === lvl
              ? 'app-accent'
              : 'app-input app-hover',
          ].join(' ')}
          aria-pressed={value === lvl}
        >
          {lvl}
        </button>
      ))}
    </div>
  )
}

