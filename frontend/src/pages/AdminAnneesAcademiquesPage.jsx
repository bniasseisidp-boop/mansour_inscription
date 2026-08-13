import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import apiClient from '../api/client'
import { getErrorMessage } from '../api/errors'
import { useAuth } from '../auth/AuthContext'

const EMPTY_FORM = { libelle: '', date_debut: '', date_fin: '' }

function formatDate(valeur) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(valeur)
  )
}

export default function AdminAnneesAcademiquesPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'

  const [annees, setAnnees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadAnnees() {
    setLoading(true)
    apiClient
      .get('/admin/annees-academiques')
      .then((response) => setAnnees(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAnnees()
  }, [])

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      await apiClient.post('/admin/annees-academiques', form)
      setShowForm(false)
      setForm(EMPTY_FORM)
      loadAnnees()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStatut(annee) {
    const nouveauStatut = annee.statut === 'active' ? 'cloturee' : 'active'
    try {
      await apiClient.patch(`/admin/annees-academiques/${annee.id}/statut`, { statut: nouveauStatut })
      loadAnnees()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleDelete(annee) {
    if (!window.confirm(`Supprimer l'année académique "${annee.libelle}" ?`)) {
      return
    }
    try {
      await apiClient.delete(`/admin/annees-academiques/${annee.id}`)
      loadAnnees()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <AppLayout title="Années académiques">
      <div className="page-toolbar">
        <p className="page-toolbar-hint">
          {isSuperAdmin
            ? "Créez les campagnes d'inscription annuelles (ex. 2025-2026) qui seront proposées aux étudiants."
            : "Consultez les années académiques disponibles. Leur création est réservée au super administrateur."}
        </p>
        {isSuperAdmin && (
          <button type="button" className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            + Nouvelle année
          </button>
        )}
      </div>

      {error && <div className="auth-error">{error}</div>}

      {showForm && (
        <form className="card-form" onSubmit={handleSubmit}>
          <h2>Nouvelle année académique</h2>
          {formError && <div className="auth-error">{formError}</div>}

          <div className="form-grid">
            <div>
              <label htmlFor="libelle">Libellé</label>
              <input id="libelle" required placeholder="2025-2026" value={form.libelle} onChange={updateField('libelle')} />
            </div>
            <div>
              <label htmlFor="date_debut">Date de début</label>
              <input id="date_debut" type="date" required value={form.date_debut} onChange={updateField('date_debut')} />
            </div>
            <div>
              <label htmlFor="date_fin">Date de fin</label>
              <input id="date_fin" type="date" required value={form.date_fin} onChange={updateField('date_fin')} />
            </div>
          </div>

          <div className="card-form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Chargement…</p>
      ) : annees.length === 0 ? (
        <p>Aucune année académique pour le moment.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Année</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                {isSuperAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {annees.map((annee) => (
                <tr key={annee.id}>
                  <td>
                    <strong>{annee.libelle}</strong>
                  </td>
                  <td>{formatDate(annee.date_debut)}</td>
                  <td>{formatDate(annee.date_fin)}</td>
                  <td>
                    <span className={`badge ${annee.statut === 'active' ? 'badge-active' : 'badge-archivee'}`}>
                      {annee.statut === 'active' ? 'Active' : 'Clôturée'}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td className="table-actions">
                      <button type="button" className="btn-link" onClick={() => toggleStatut(annee)}>
                        {annee.statut === 'active' ? 'Clôturer' : 'Réactiver'}
                      </button>
                      <button type="button" className="btn-link btn-link-danger" onClick={() => handleDelete(annee)}>
                        Supprimer
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
