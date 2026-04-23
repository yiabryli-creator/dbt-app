export function Card({ title, children, className = '' }) {
  return (
    <section
      className={[
        'app-card rounded-2xl border p-4',
        className,
      ].join(' ')}
    >
      {title ? <h2 className="text-sm font-semibold">{title}</h2> : null}
      {children ? <div className={title ? 'mt-3' : ''}>{children}</div> : null}
    </section>
  )
}

