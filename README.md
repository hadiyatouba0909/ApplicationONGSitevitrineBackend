# LumièreAvenir – Application ONG

Application web complète pour une ONG dédiée à l'éducation des jeunes défavorisés.

## Stack Technique

| Couche          | Technologie                                        |
|-----------------|----------------------------------------------------|
| Frontend        | Next.js 14 · TypeScript · Tailwind CSS             |
| Backend         | Node.js · Express · TypeScript                     |
| Base de données | PostgreSQL                                         |
| Auth            | JWT (jsonwebtoken) + bcryptjs                      |
| Upload          | Multer (images)                                    |
| Sécurité        | Helmet · Rate Limiting · Express Validator · CORS  |

---

## Structure du projet

```
SITE-VITRINE/
├── backend/                   # API Node.js + Express
│   ├── src/
│   │   ├── config/            # Connexion PostgreSQL + init BDD
│   │   ├── controllers/       # Logique métier (auth, activités, services, contact)
│   │   ├── middleware/        # Auth JWT + Upload Multer
│   │   └── routes/            # Routes API REST
│   ├── database/
│   │   └── init.sql           # Script de création des tables + données initiales
│   ├── uploads/               # Images uploadées (généré automatiquement)
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                  # Next.js App Router
    ├── app/
    │   ├── layout.tsx             # Layout global (PublicLayout)
    │   ├── page.tsx               # Page d'accueil (Server Component, fetch API)
    │   ├── activites/             # Liste des activités publiques
    │   ├── services/              # Liste des services publics
    │   ├── contact/               # Formulaire de contact
    │   └── admin/                 # Dashboard administration (protégé JWT)
    │       ├── login/             # Connexion admin (sans Navbar/Footer)
    │       ├── activites/         # CRUD activités + upload image
    │       ├── services/          # CRUD services
    │       └── messages/          # Gestion messages (lu/non lu, répondre, supprimer)
    ├── components/
    │   ├── PublicLayout.tsx        # Cache Navbar/Footer sur les routes /admin
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── ActivityCard.tsx        # Carte activité avec gestion d'erreur image
    │   ├── ServiceCard.tsx
    │   ├── HeroSection.tsx
    │   └── ContactForm.tsx
    ├── lib/
    │   └── api.ts                 # Client API centralisé (fetch + types)
    ├── public/                    # Assets statiques
    ├── .env.local                 # Variables d'environnement frontend
    └── package.json
```

---

## Installation & Lancement

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm

---

### 1. Base de données

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE site_vitrine;"
```

---

### 2. Backend

```bash
cd backend

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos informations PostgreSQL, JWT et l'URL du frontend

# Installer les dépendances
npm install

# Initialiser la BDD (tables + admin + données de démo)
npm run db:init

# Lancer en développement
npm run dev
```

L'API sera disponible sur `http://localhost:5000`

> ⚠️ Si le port 5000 est déjà occupé : `fuser -k 5000/tcp && npm run dev`

---

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local (s'il n'existe pas)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Lancer en développement
npm run dev
```

Le site sera disponible sur `http://localhost:3000` (ou `3001` si le port est occupé)

---

## Variables d'environnement

### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=site_vitrine
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_secret_jwt_tres_long
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@lumiereavenir.org
ADMIN_PASSWORD=Admin@2026!

# CORS : mettre l'URL exacte du frontend
FRONTEND_URL=http://localhost:3001
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Endpoints API

### Publics
| Méthode | Endpoint                      | Description              |
|---------|-------------------------------|--------------------------|
| GET     | /api/health                   | Santé de l'API           |
| GET     | /api/activites                | Liste des activités      |
| GET     | /api/services                 | Liste des services       |
| POST    | /api/contact                  | Envoyer un message       |
| POST    | /api/auth/login               | Connexion admin          |

### Protégés (JWT requis)
| Méthode | Endpoint                       | Description               |
|---------|--------------------------------|---------------------------|
| GET     | /api/activites/admin           | Toutes les activités      |
| POST    | /api/activites                 | Créer une activité        |
| PUT     | /api/activites/:id             | Modifier une activité     |
| DELETE  | /api/activites/:id             | Supprimer une activité    |
| GET     | /api/services/admin            | Tous les services         |
| POST    | /api/services                  | Créer un service          |
| PUT     | /api/services/:id              | Modifier un service       |
| DELETE  | /api/services/:id              | Supprimer un service      |
| GET     | /api/contact/messages          | Liste des messages        |
| PATCH   | /api/contact/messages/:id/lu   | Marquer comme lu          |
| DELETE  | /api/contact/messages/:id      | Supprimer un message      |

---

## Accès Administration

- URL : `http://localhost:3001/admin`
- Email par défaut : `admin@lumiereavenir.org`
- Mot de passe : `Admin@2026!`

> ⚠️ Changer le mot de passe en production via la variable `ADMIN_PASSWORD` dans `.env`

---

## Fonctionnalités

### Site Vitrine (public)
- ✅ Page d'accueil : Hero, statistiques, aperçu services & activités (données réelles depuis l'API)
- ✅ Page Activités avec galerie d'images, recherche et placeholder si image absente
- ✅ Page Services avec icônes dynamiques
- ✅ Page Contact avec formulaire validé côté client et serveur

### Administration
- ✅ Authentification sécurisée JWT — page login sans Navbar/Footer
- ✅ Dashboard avec statistiques en temps réel
- ✅ CRUD complet des activités (avec upload d'images)
- ✅ CRUD complet des services
- ✅ Gestion des messages de contact (lu/non lu, répondre, supprimer)
- ✅ Interface **responsive** : sidebar mobile/desktop, tableaux adaptés, vue messages optimisée mobile

### Sécurité
- ✅ Mots de passe hachés (bcrypt, 12 rounds)
- ✅ Authentification JWT
- ✅ CORS configuré pour autoriser localhost:3000 et 3001
- ✅ Rate limiting (100 req/15min global, 10/15min sur /auth)
- ✅ En-têtes de sécurité (Helmet + crossOriginResourcePolicy)
- ✅ Validation des entrées (express-validator)
- ✅ Taille max des fichiers limitée (5 Mo)
- ✅ Validation des types de fichiers (images uniquement)

---

## Déploiement en production

### Stack de production
| Service | Rôle | URL |
|---|---|---|
| **Render** | Backend Node.js/Express | `https://applicationongsitevitrinebackend.onrender.com` |
| **Neon** | Base de données PostgreSQL | [neon.tech](https://neon.tech) |
| **Vercel** | Frontend Next.js | `https://votre-app.vercel.app` |

---

### 1. Base de données — Neon

1. Créer un compte sur [neon.tech](https://neon.tech) → **New Project**
2. Copier la **Connection string** (format `postgresql://user:pass@host/db?sslmode=require`)
3. Dans l'onglet **SQL Editor** de Neon, exécuter le contenu de `backend/database/init.sql`

---

### 2. Backend — Render

1. [render.com](https://render.com) → **New → Web Service** → connecter le repo GitHub
2. Paramètres :

   | Champ | Valeur |
   |---|---|
   | **Root Directory** | `backend` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |

3. Variables d'environnement à ajouter :

   | Clé | Valeur |
   |---|---|
   | `DATABASE_URL` | Connection string Neon |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | Chaîne aléatoire longue (min. 32 chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `ADMIN_EMAIL` | Email de l'admin |
   | `ADMIN_PASSWORD` | Mot de passe admin |
   | `FRONTEND_URL` | URL Vercel *(à remplir après déploiement Vercel)* |

---

### 3. Frontend — Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importer le même repo
2. Paramètres :

   | Champ | Valeur |
   |---|---|
   | **Root Directory** | `frontend` |
   | Framework | Next.js (auto-détecté) |

3. Variable d'environnement :

   | Clé | Valeur |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://applicationongsitevitrinebackend.onrender.com/api` |

4. Déployer → copier l'URL Vercel obtenue

---

### 4. Finaliser le CORS sur Render

Dans votre service Render → **Environment** → mettre à jour :

```
FRONTEND_URL=https://votre-app.vercel.app
```

Render redéploie automatiquement → le site est en ligne.

---

### Variables d'environnement production

#### Backend — Render (variables d'env)

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NODE_ENV=production
JWT_SECRET=chaine_aleatoire_tres_longue
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@votre-ong.org
ADMIN_PASSWORD=MotDePasseSecurise@2024!
FRONTEND_URL=https://votre-app.vercel.app
```

#### Frontend — Vercel (variables d'env)

```env
NEXT_PUBLIC_API_URL=https://applicationongsitevitrinebackend.onrender.com/api
```

---

## Notes techniques

- La page d'accueil est un **Server Component** Next.js qui fetche directement l'API au moment du rendu.
- `ActivityCard` est un **Client Component** pour gérer l'événement `onError` des images.
- `PublicLayout` masque automatiquement la Navbar et le Footer sur toutes les routes `/admin/*`.
- Les images uploadées sont servies par Express depuis `backend/uploads/` via `/uploads/*`.

---

## Points clés d'architecture

- **Server Component (page d'accueil)** : le fetch se fait côté serveur, ce qui évite tout problème de CORS et améliore le SEO (contenu rendu côté serveur).
- **`PublicLayout`** : pattern propre pour isoler le layout admin (sans Navbar/Footer) du layout public, sans dupliquer de logique dans chaque page.
- **CORS dynamique** : configuré via une liste d'origines autorisées (pas hardcodé), ce qui permet de supporter facilement plusieurs environnements (dev port 3000, 3001, prod).
- **Images via Express static** : les fichiers uploadés sont servis directement par Express (`/uploads/*`) depuis le dossier `backend/uploads/`, avec `crossOriginResourcePolicy: cross-origin` pour autoriser leur affichage depuis le frontend.
# ApplicationONGSitevitrineBackend
