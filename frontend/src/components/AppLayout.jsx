import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const ROLE_LABELS = {
  etudiant: 'Étudiant',
  admin: 'Administration',
  super_admin: 'Super administrateur',
}

export default function AppLayout({ title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/connexion', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-brand">Gestion Inscriptions</span>
        <div className="app-header-user">
          <span className="app-header-name">{user?.name}</span>
          <span className="app-header-role">{ROLE_LABELS[user?.role] ?? user?.role}</span>
          <button type="button" onClick={handleLogout} className="app-header-logout">
            Déconnexion
          </button>
        </div>
      </header>
      <main className="app-main">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  )
}
