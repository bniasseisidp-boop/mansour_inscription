import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboardPage from './pages/StudentDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminFilieresPage from './pages/AdminFilieresPage'
import AdminAnneesAcademiquesPage from './pages/AdminAnneesAcademiquesPage'
import RequireAuth from './auth/RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />

      <Route
        path="/espace-etudiant"
        element={
          <RequireAuth roles={['etudiant']}>
            <StudentDashboardPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAuth roles={['admin', 'super_admin']}>
            <AdminDashboardPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/filieres"
        element={
          <RequireAuth roles={['admin', 'super_admin']}>
            <AdminFilieresPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/annees-academiques"
        element={
          <RequireAuth roles={['admin', 'super_admin']}>
            <AdminAnneesAcademiquesPage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
