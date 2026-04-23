export function SkillChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-2 text-sm',
        active
          ? 'app-accent'
          : 'app-input app-hover',
      ].join(' ')}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

