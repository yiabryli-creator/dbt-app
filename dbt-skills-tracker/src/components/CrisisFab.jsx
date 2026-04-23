import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n.jsx'

export function CrisisFab() {
  const { t } = useI18n()
  return (
    <Link
      to="/crisis"
      className="fixed bottom-20 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] shadow-lg shadow-black/20 active:translate-y-px"
      aria-label={t('crisis')}
      title={t('crisis')}
    >
      <span className="text-lg font-bold">!</span>
    </Link>
  )
}

