import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../auth/AuthContext'

export default function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <AppLayout title="Espace administration">
      <p>Bienvenue {user?.name}.</p>

      <div className="dashboard-cards">
        <Link to="/admin/filieres" className="dashboard-card">
          <h3>Filières</h3>
          <p>Créer, tarifer et gérer l'ouverture des filières.</p>
        </Link>
        <Link to="/admin/annees-academiques" className="dashboard-card">
          <h3>Années académiques</h3>
          <p>Gérer les campagnes d'inscription annuelles.</p>
        </Link>
      </div>
    </AppLayout>
  )
}
