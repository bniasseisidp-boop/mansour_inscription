# Mansour Service — Guide d'Installation

Ce dossier est le projet **Mansour Service** (nouveau produit, base et dépôt
indépendants) — un fork du système ISI SUPTECH, redesigné pour être
redéployable chez n'importe quel établissement. Il est totalement séparé de
l'installation ISI SUPTECH existante (`C:\xampp\htdocs\isi-suptech-api`,
base `isi_suptech`) : les deux peuvent tourner sur la même machine sans se
gêner, chacun sur sa propre base de données.

---

## Démarrage rapide (chaque session)

### Terminal 1 — Backend Laravel
```bash
cd "C:\Users\azoto\OneDrive\Desktop\mansour_inscription\backend"
C:\xampp\php\php.exe artisan serve --port=8000
```

### Terminal 2 — Frontend React
```bash
cd "C:\Users\azoto\OneDrive\Desktop\mansour_inscription\frontend"
npm run dev
```

> N'oubliez pas de démarrer MySQL (XAMPP Control Panel, ou
> `C:\xampp\mysql_start.bat`) avant de lancer le backend.

| Interface    | URL                          |
|--------------|-------------------------------|
| Application  | http://localhost:3000        |
| API Backend  | http://localhost:8000        |
| phpMyAdmin   | http://localhost/phpmyadmin  |

---

## Prérequis
- XAMPP (PHP 8.2+, MySQL/MariaDB) — `C:\xampp\php\php.exe`
- Composer (`C:\xampp\php\composer.phar`, exécuté via `php.exe composer.phar`)
- Node.js 18+

---

## 1. Installation Backend (Laravel)

```bash
cd "C:\Users\azoto\OneDrive\Desktop\mansour_inscription\backend"
C:\xampp\php\php.exe C:\xampp\php\composer.phar install
copy .env.example .env
C:\xampp\php\php.exe artisan key:generate
```

### Base de données

Nom de la base : **`mansourinscription`** (différente de `isi_suptech`).

```sql
CREATE DATABASE mansourinscription CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Dans `.env` :
```
DB_DATABASE=mansourinscription
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:3000
```

### Migrations et données de démo
```bash
C:\xampp\php\php.exe artisan migrate
C:\xampp\php\php.exe artisan db:seed
C:\xampp\php\php.exe artisan db:seed --class=SuperAdminSeeder
C:\xampp\php\php.exe artisan storage:link
```

`SuperAdminSeeder` lit `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD` depuis
`.env` — à définir avant de lancer ce seeder.

---

## 2. Installation Frontend (React)
```bash
cd "C:\Users\azoto\OneDrive\Desktop\mansour_inscription\frontend"
npm install
npm run dev
```

---

## 3. Comptes de démonstration (seed)

| Rôle                 | Email                     | Mot de passe    |
|----------------------|---------------------------|-----------------|
| Admin                | admin@example.com         | Admin@2026!     |
| Caissier             | caisse@example.com        | Caisse@2026!    |
| Accueil              | accueil@example.com       | Accueil@2026!   |
| Accueil Pédagogique  | pedagogique@example.com   | Pedago@2026!    |
| Super Admin          | (valeur de `SUPERADMIN_EMAIL`) | (valeur de `SUPERADMIN_PASSWORD`) |

⚠️ Mots de passe de démonstration — à changer avant toute mise en production
pour un établissement client.

---

## 4. Identité de l'établissement

Nom, logo, slogan, contact et nom du directeur affichés sur la vitrine et
les documents PDF (carte, attestations, bulletins) sont **configurables**
depuis l'interface super admin (Paramètres → Établissement), sans toucher
au code — endpoint `GET/POST /api/settings/etablissement` et
`POST /api/admin/contenu/etablissement`. Tant que rien n'est personnalisé,
les valeurs par défaut restent celles d'ISI SUPTECH.

---

## 5. Paiement — Wave
Dans `.env` :
```
WAVE_API_KEY=
WAVE_WEBHOOK_SECRET=
```
Webhook à configurer côté Wave : `https://votre-domaine.com/api/webhook/wave`

## 6. Paiement — Stripe
Dans `.env` :
```
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
```
Webhook à configurer côté Stripe : `https://votre-domaine.com/api/webhook/stripe`

---

## 7. Configuration Email
Par défaut `MAIL_MAILER=log` (les emails s'écrivent dans
`backend/storage/logs/laravel.log` au lieu de partir réellement) — pratique
en développement. Pour un envoi réel :
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=xxxx_xxxx_xxxx_xxxx   ← mot de passe d'application
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=inscription@votre-domaine.com
MAIL_FROM_NAME="Nom de l'établissement"
```

---

## Structure du projet
```
mansour_inscription/
├── backend/          ← API Laravel
│   ├── app/
│   ├── database/
│   └── routes/
└── frontend/         ← Interface React
    └── src/
        ├── pages/    ← Landing, PreInscription, StudentPortal, Admin, Caisse, Accueil…
        └── services/ ← Client API
```

---

*Développé par **Mansour Service***
