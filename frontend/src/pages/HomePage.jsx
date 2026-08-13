import { Link } from 'react-router-dom'

const STEPS = [
  {
    title: '1. Créez votre compte',
    text: 'Inscrivez-vous en quelques minutes avec votre email, sans vous déplacer au service de scolarité.',
  },
  {
    title: '2. Choisissez votre filière',
    text: "Consultez les filières ouvertes pour l'année en cours et déposez votre demande d'inscription en ligne.",
  },
  {
    title: '3. Payez en toute sécurité',
    text: 'Réglez vos frais de scolarité en une ou plusieurs fois, recevez vos reçus et rappels automatiquement.',
  },
]

const FEATURES = [
  {
    title: 'Paiements échelonnés',
    text: 'Réglez vos frais de scolarité en plusieurs tranches, avec des rappels avant chaque échéance.',
  },
  {
    title: 'Reçus numériques',
    text: 'Chaque paiement génère automatiquement un reçu téléchargeable, sans passer par un guichet.',
  },
  {
    title: 'Suivi en temps réel',
    text: "Consultez à tout moment le statut de votre inscription et l'historique de vos paiements.",
  },
]

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-nav">
        <span className="home-nav-brand">Gestion Inscriptions</span>
        <nav className="home-nav-links">
          <Link to="/connexion">Se connecter</Link>
          <Link to="/inscription" className="home-nav-cta">
            Créer un compte
          </Link>
        </nav>
      </header>

      <section className="home-hero">
        <h1>Vos inscriptions et vos paiements de scolarité, simplifiés.</h1>
        <p>
          Une plateforme unique pour choisir votre filière, suivre votre dossier d'inscription et
          régler vos frais de scolarité en ligne, en toute sécurité.
        </p>
        <div className="home-hero-actions">
          <Link to="/inscription" className="home-btn home-btn-primary">
            Je m'inscris
          </Link>
          <Link to="/connexion" className="home-btn home-btn-secondary">
            J'ai déjà un compte
          </Link>
        </div>
      </section>

      <section className="home-steps">
        {STEPS.map((step) => (
          <div className="home-step-card" key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </section>

      <section className="home-features">
        <h2>Pensée pour les étudiants comme pour l'administration</h2>
        <div className="home-features-grid">
          {FEATURES.map((feature) => (
            <div className="home-feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>Gestion Inscriptions — Projet de fin d'études</span>
      </footer>
    </div>
  )
}
