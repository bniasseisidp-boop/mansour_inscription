import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getErrorMessage } from '../api/errors'
import { defaultRouteForRole } from '../auth/roles'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await login(email, password)
      navigate(defaultRouteForRole(user.role), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <p className="auth-subtitle">Accédez à votre espace inscriptions et paiements.</p>

        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="email">Adresse email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Connexion en cours…' : 'Se connecter'}
        </button>

        <p className="auth-switch">
          Pas encore de compte ? <Link to="/inscription">Créer un compte étudiant</Link>
        </p>
      </form>
    </div>
  )
}
