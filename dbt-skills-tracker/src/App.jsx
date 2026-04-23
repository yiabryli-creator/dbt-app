import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout.jsx'
import { TrackerPage } from './pages/TrackerPage.jsx'
import { CalendarPage } from './pages/CalendarPage.jsx'
import { AnalyticsPage } from './pages/AnalyticsPage.jsx'
import { CrisisPage } from './pages/CrisisPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { ManualPage } from './pages/ManualPage.jsx'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<TrackerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/manual" element={<ManualPage />} />
        <Route path="/crisis" element={<CrisisPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}
