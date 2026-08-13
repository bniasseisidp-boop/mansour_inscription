import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { defaultRouteForRole } from './roles'

export default function RequireAuth({ roles, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="page-loading">Chargement…</div>
  }

  if (!user) {
    return <Navigate to="/connexion" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={defaultRouteForRole(user.role)} replace />
  }

  return children
}
