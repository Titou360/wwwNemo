# Déploiement — Nemo Solutions (Vercel)

Architecture : **un seul projet Vercel** qui sert le front (Vite/React) + l'API (Express en
fonction serverless) + les images (base64 dans MongoDB). Plus de Render, plus de Cloudinary.

```
Repo (racine = projet Vercel)
├── api/[...path].js     → fonction serverless = app Express complète (/api/*)
├── backend/src/         → code de l'API (routes, modèles, db)
├── frontend/            → app Vite/React (buildée vers frontend/dist)
├── package.json         → deps de l'API + scripts
└── vercel.json          → build du front + routage SPA
```

## 1. Réglages du projet Vercel

> ⚠️ **Le plus important** : l'ancien projet Vercel avait sa *Root Directory* sur `frontend`.
> Il faut maintenant la mettre sur la **racine du dépôt**.

Dans Vercel → projet → **Settings → General** :
- **Root Directory** : `.` (racine) — *retirer `frontend`*
- **Build Command** : laisser vide (pris depuis `vercel.json`) ou `npm run build`
- **Output Directory** : laisser vide (pris depuis `vercel.json` → `frontend/dist`)
- **Framework Preset** : `Other`

## 2. Variables d'environnement (Settings → Environment Variables)

À créer pour **Production** *et* **Preview** :

| Variable | Valeur |
|---|---|
| `MONGODB_URI` | la chaîne de connexion MongoDB Atlas |
| `JWT_SECRET` | (votre secret) |
| `JWT_EXPIRES_IN` | `7d` |
| `ADMIN_EMAIL` | `clement@nemosolutions.fr` |
| `ADMIN_PASSWORD` | (votre mot de passe admin) |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `clement@nemosolutions.fr` |
| `SMTP_PASS` | (votre mot de passe SMTP) |
| `SMTP_TO` | `clement@nemosolutions.fr` |

**À NE PAS mettre :**
- `VITE_API_URL` → laisser **non défini** (le front appelle l'API en relatif `/api`, même domaine).
- `DEV_TLS_INSECURE` → **jamais** en prod (dev local uniquement).
- `CLOUDINARY_*` → supprimées (plus utilisées).
- `PORT` → inutile en serverless.
- `NODE_ENV` → Vercel la met déjà à `production`.

## 3. MongoDB Atlas

- **Network Access** : autoriser `0.0.0.0/0` (les IP des fonctions Vercel ne sont pas fixes).
- Les données existent déjà (admin + villes + clients) → **pas besoin de seed**.
- Reseed manuel si besoin (base vide) : `npm run seed` en local.

## 4. Déploiement

1. Merger la branche `migration-vercel` dans `main` (ou ouvrir une PR → preview deploy).
2. Vercel build et déploie automatiquement à chaque push.
3. Vérifier `https://<projet>.vercel.app/api/health` → `{ "status": "ok" }`.

## 5. Domaine (DNS)

Dans Vercel → **Settings → Domains** : ajouter `nemosolutions.fr` et `www.nemosolutions.fr`.
Vercel indique les enregistrements DNS à créer chez Hostinger (un `A` sur l'apex et/ou un
`CNAME` `www` → `cname.vercel-dns.com`). Hostinger ne gère alors que le **nom de domaine**.

## Développement local

```bash
# API (port 5000) — utilise backend/.env (avec DEV_TLS_INSECURE=true si antivirus HTTPS)
npm run dev:api

# Front (port 3000, proxy /api → 5000)
npm run dev:front
```

Admin : http://localhost:3000/admin
