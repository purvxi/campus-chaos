import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AttendancePage from './pages/AttendancePage'
import AssignmentsPage from './pages/AssignmentsPage'
import ExamsPage from './pages/ExamsPage'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/exams" element={<ExamsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
