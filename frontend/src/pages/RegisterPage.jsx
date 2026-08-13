import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getErrorMessage } from '../api/errors'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.password !== form.password_confirmation) {
      setError('La confirmation du mot de passe ne correspond pas.')
      return
    }

    setSubmitting(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Créer un compte étudiant</h1>
        <p className="auth-subtitle">
          Inscrivez-vous pour choisir votre filière et suivre vos paiements de scolarité.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="name">Nom complet</label>
        <input id="name" required value={form.name} onChange={updateField('name')} autoComplete="name" />

        <label htmlFor="email">Adresse email</label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={updateField('email')}
          autoComplete="email"
        />

        <label htmlFor="telephone">Téléphone (optionnel)</label>
        <input id="telephone" value={form.telephone} onChange={updateField('telephone')} autoComplete="tel" />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={updateField('password')}
          autoComplete="new-password"
        />

        <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
        <input
          id="password_confirmation"
          type="password"
          required
          minLength={8}
          value={form.password_confirmation}
          onChange={updateField('password_confirmation')}
          autoComplete="new-password"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Création en cours…' : 'Créer mon compte'}
        </button>

        <p className="auth-switch">
          Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
