import { NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../lib/i18n.jsx'
import { CrisisFab } from './CrisisFab.jsx'

function TabLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs',
          isActive
            ? 'text-[var(--text)]'
            : 'text-[var(--muted)]',
        ].join(' ')
      }
    >
      <span className="font-medium">{label}</span>
    </NavLink>
  )
}

export function AppLayout({ children }) {
  const location = useLocation()
  const isCrisis = location.pathname === '/crisis'
  const { t } = useI18n()

  return (
    <div className="app-surface min-h-dvh">
      <main className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        {children}
      </main>

      {!isCrisis && <CrisisFab />}

      <nav className="fixed inset-x-0 bottom-0 border-t app-border bg-[color:var(--card)]/90 backdrop-blur">
        <div className="mx-auto grid w-full max-w-md grid-cols-5">
          <TabLink to="/" label={t('nav_tracker')} />
          <TabLink to="/calendar" label={t('nav_calendar')} />
          <TabLink to="/analytics" label={t('nav_analytics')} />
          <TabLink to="/manual" label={t('nav_manual')} />
          <TabLink to="/settings" label={t('nav_settings')} />
        </div>
      </nav>
    </div>
  )
}

