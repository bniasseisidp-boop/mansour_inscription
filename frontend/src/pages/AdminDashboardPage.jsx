import AppLayout from '../components/AppLayout'
import { useAuth } from '../auth/AuthContext'

export default function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <AppLayout title="Espace administration">
      <p>
        Bienvenue {user?.name}. La gestion des filières, des inscriptions et des paiements sera
        disponible ici dans les prochaines étapes du projet.
      </p>
    </AppLayout>
  )
}
