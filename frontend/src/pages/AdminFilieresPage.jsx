import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import apiClient from '../api/client'
import { getErrorMessage } from '../api/errors'
import { useAuth } from '../auth/AuthContext'

const EMPTY_FORM = {
  nom: '',
  code: '',
  niveau: '',
  description: '',
  frais_scolarite_total: '',
  nombre_tranches: 1,
  nombre_places: '',
}

function formatMontant(valeur) {
  return new Intl.NumberFormat('fr-FR').format(Number(valeur)) + ' FCFA'
}

export default function AdminFilieresPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'

  const [filieres, setFilieres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadFilieres() {
    setLoading(true)
    apiClient
      .get('/admin/filieres')
      .then((response) => setFilieres(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadFilieres()
  }, [])

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function openCreateForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowForm(true)
  }

  function openEditForm(filiere) {
    setEditingId(filiere.id)
    setForm({
      nom: filiere.nom,
      code: filiere.code,
      niveau: filiere.niveau,
      description: filiere.description ?? '',
      frais_scolarite_total: filiere.frais_scolarite_total,
      nombre_tranches: filiere.nombre_tranches,
      nombre_places: filiere.nombre_places ?? '',
    })
    setFormError('')
    setShowForm(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    const payload = {
      ...form,
      nombre_places: form.nombre_places === '' ? null : form.nombre_places,
    }

    try {
      if (editingId) {
        await apiClient.put(`/admin/filieres/${editingId}`, payload)
      } else {
        await apiClient.post('/admin/filieres', payload)
      }
      setShowForm(false)
      loadFilieres()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStatut(filiere) {
    const nouveauStatut = filiere.statut === 'active' ? 'archivee' : 'active'
    try {
      await apiClient.patch(`/admin/filieres/${filiere.id}/statut`, { statut: nouveauStatut })
      loadFilieres()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleDelete(filiere) {
    if (!window.confirm(`Supprimer définitivement la filière "${filiere.nom}" ?`)) {
      return
    }
    try {
      await apiClient.delete(`/admin/filieres/${filiere.id}`)
      loadFilieres()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <AppLayout title="Filières">
      <div className="page-toolbar">
        <p className="page-toolbar-hint">
          {isSuperAdmin
            ? 'Créez les filières et fixez leurs tarifs. Les administrateurs peuvent ensuite ouvrir ou fermer les inscriptions.'
            : "Consultez les filières et ouvrez ou fermez les inscriptions. La création et la tarification sont réservées au super administrateur."}
        </p>
        {isSuperAdmin && (
          <button type="button" className="btn-primary" onClick={openCreateForm}>
            + Nouvelle filière
          </button>
        )}
      </div>

      {error && <div className="auth-error">{error}</div>}

      {showForm && (
        <form className="card-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Modifier la filière' : 'Nouvelle filière'}</h2>
          {formError && <div className="auth-error">{formError}</div>}

          <div className="form-grid">
            <div>
              <label htmlFor="nom">Nom</label>
              <input id="nom" required value={form.nom} onChange={updateField('nom')} />
            </div>
            <div>
              <label htmlFor="code">Code</label>
              <input id="code" required value={form.code} onChange={updateField('code')} />
            </div>
            <div>
              <label htmlFor="niveau">Niveau</label>
              <input
                id="niveau"
                required
                placeholder="Licence 1, Master 2…"
                value={form.niveau}
                onChange={updateField('niveau')}
              />
            </div>
            <div>
              <label htmlFor="frais">Frais de scolarité (FCFA)</label>
              <input
                id="frais"
                type="number"
                min="0"
                step="1"
                required
                value={form.frais_scolarite_total}
                onChange={updateField('frais_scolarite_total')}
              />
            </div>
            <div>
              <label htmlFor="tranches">Nombre de tranches de paiement</label>
              <input
                id="tranches"
                type="number"
                min="1"
                max="12"
                required
                value={form.nombre_tranches}
                onChange={updateField('nombre_tranches')}
              />
            </div>
            <div>
              <label htmlFor="places">Places disponibles (optionnel)</label>
              <input
                id="places"
                type="number"
                min="1"
                value={form.nombre_places}
                onChange={updateField('nombre_places')}
              />
            </div>
          </div>

          <label htmlFor="description">Description (optionnel)</label>
          <textarea id="description" rows={3} value={form.description} onChange={updateField('description')} />

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
        <p>Chargement des filières…</p>
      ) : filieres.length === 0 ? (
        <p>Aucune filière pour le moment.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Filière</th>
                <th>Niveau</th>
                <th>Frais</th>
                <th>Tranches</th>
                <th>Places</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filieres.map((filiere) => (
                <tr key={filiere.id}>
                  <td>
                    <strong>{filiere.nom}</strong>
                    <div className="table-subtext">{filiere.code}</div>
                  </td>
                  <td>{filiere.niveau}</td>
                  <td>{formatMontant(filiere.frais_scolarite_total)}</td>
                  <td>{filiere.nombre_tranches}</td>
                  <td>{filiere.nombre_places ?? '—'}</td>
                  <td>
                    <span className={`badge badge-${filiere.statut}`}>
                      {filiere.statut === 'active' ? 'Active' : 'Archivée'}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button type="button" className="btn-link" onClick={() => toggleStatut(filiere)}>
                      {filiere.statut === 'active' ? 'Archiver' : 'Réactiver'}
                    </button>
                    {isSuperAdmin && (
                      <>
                        <button type="button" className="btn-link" onClick={() => openEditForm(filiere)}>
                          Modifier
                        </button>
                        <button type="button" className="btn-link btn-link-danger" onClick={() => handleDelete(filiere)}>
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
