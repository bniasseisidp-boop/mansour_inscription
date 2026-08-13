import AppLayout from '../components/AppLayout'
import { useAuth } from '../auth/AuthContext'

export default function StudentDashboardPage() {
  const { user } = useAuth()

  return (
    <AppLayout title="Mon espace étudiant">
      <p>
        Bienvenue {user?.name}. La liste des filières et le suivi de votre inscription seront
        disponibles ici dans les prochaines étapes du projet.
      </p>
    </AppLayout>
  )
}
