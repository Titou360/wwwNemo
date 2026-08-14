# Socle SEO — Conversion SSG + fondamentaux — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre le contenu texte et les métadonnées SEO présents dans le HTML servi (SSG) et poser robots.txt, sitemap.xml, schema LocalBusiness visible et redirection 301.

**Architecture:** Conversion du SPA Vite/React (CSR pur) en site pré-généré au build via `vite-react-ssg`. Les routes passent en tableau de routes (data router), chaque page rendue en HTML statique dans `frontend/dist/`. Les villes deviennent une source statique dans le repo (plus de `fetch('/api/cities')` sur les pages SEO). robots/sitemap/schema/301 s'appuient sur cette base.

**Tech Stack:** Vite 6, React 19, react-router-dom 7, vite-react-ssg 0.9.x, TailwindCSS 4, déploiement Vercel (static + fonction serverless Express pour `/api`).

**Spec:** `docs/superpowers/specs/2026-08-14-socle-seo-ssg-design.md`

## Global Constraints

- Ne rien casser côté API/admin : modèle `City`, `backend/src/routes/cities.js`, `seed.js`, section `cities` de l'admin restent fonctionnels.
- `vercel.json` `outputDirectory` reste `frontend/dist`. `buildCommand` reste `npm run build`.
- Routes `/admin` et `/admin/dashboard` : rendu client uniquement, **non pré-rendues**, `noindex`.
- Aucune dépendance à MongoDB au moment du build (source villes = statique).
- Domaine canonique : `https://www.nemosolutions.fr`.
- Données métier exactes : adresse `29 Avenue des Pins, 33830 Belin-Béliet` ; téléphone `+33 6 21 14 58 88` (E.164 : `+33621145888`).
- Redirection 301 : `/agence-web-wordpress-a-cestas/` → `/pages-locales/creation-de-sites-internet/cestas`.
- Pas de framework de test unitaire dans `frontend` : la vérification se fait par **build + inspection du HTML généré dans `dist/`**. Commandes de vérification exécutées depuis `frontend/`.

---

### Task 1: Gate de faisabilité — build SSG avec react-router 7

**But :** prouver, avant tout le reste, que `vite-react-ssg` pré-génère bien une route avec react-router-dom 7 (peer déclaré `^6`). Tâche bloquante : si échec, appliquer le repli documenté et NE PAS continuer les autres tâches sans validation.

**Files:**
- Create: `frontend/src/routes.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/package.json` (script `build`)

**Interfaces:**
- Produces: `export const routes: RouteRecord[]` dans `frontend/src/routes.tsx` (consommé par `main.tsx` et, plus tard, par la génération de sitemap).

- [ ] **Step 1: Installer la dépendance**

Run (depuis `frontend/`) :
```bash
npm install vite-react-ssg
```

- [ ] **Step 2: Créer un tableau de routes minimal**

Create `frontend/src/routes.tsx` :
```tsx
import type { RouteRecord } from 'vite-react-ssg'
import Home from './pages/Home'

export const routes: RouteRecord[] = [
  {
    path: '/',
    index: true,
    element: <Home />,
    entry: 'src/pages/Home.tsx',
  },
]
```

- [ ] **Step 3: Convertir le point d'entrée**

Replace tout le contenu de `frontend/src/main.tsx` :
```tsx
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

export const createRoot = ViteReactSSG({ routes })
```

- [ ] **Step 4: Basculer le script de build**

Modify `frontend/package.json` script `build` :
```json
"build": "tsc -b && vite-react-ssg build"
```

- [ ] **Step 5: Lancer le build (le vrai test du gate)**

Run (depuis `frontend/`) :
```bash
npm run build
```
Expected : build réussi, `frontend/dist/index.html` créé.

- [ ] **Step 6: Vérifier que le HTML pré-rendu contient du texte de la Home**

Run (depuis `frontend/`) :
```bash
grep -c "Nemo" dist/index.html
```
Expected : un nombre ≥ 1 ET le HTML contient du texte visible de la page d'accueil (pas seulement `<div id="root">`). Inspecter `dist/index.html` pour confirmer la présence de contenu rendu.

**Si le build échoue à cause de react-router 7 :** appliquer le repli — `npm install react-router-dom@^6` puis relancer Step 5. Si toujours bloqué, STOP et remonter le problème (repli alternatif : react-snap, hors périmètre de ce plan). Ne pas enchaîner les tâches suivantes tant que ce gate n'est pas vert.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/routes.tsx frontend/src/main.tsx frontend/package.json frontend/package-lock.json
git commit -m "feat(ssg): gate faisabilite vite-react-ssg avec react-router 7"
```

---

### Task 2: Villes en source statique

**But :** créer la source de vérité statique des villes et couper la dépendance `fetch('/api/cities')` des pages SEO. Testable dans le SPA actuel avant la conversion complète.

**Files:**
- Create: `frontend/src/data/cities.ts`
- Modify: `frontend/src/pages/PageLocaleDetail.tsx` (retirer fetch/useEffect/états de chargement)
- Modify: `frontend/src/pages/PagesLocales.tsx` (consommer la source statique)

**Interfaces:**
- Consumes: type `City` déjà exporté par `frontend/src/data/localPages.ts`.
- Produces: `export const CITIES: City[]` dans `frontend/src/data/cities.ts`.

- [ ] **Step 1: Créer le module villes**

Create `frontend/src/data/cities.ts` (reprend la liste actuelle de `backend/src/seed.js`) :
```ts
import type { City } from './localPages'

export const CITIES: City[] = [
  { slug: 'belin-beliet',      name: 'Belin-Béliet',      dept: 'Gironde',    context: "au cœur du Val de l'Eyre, en Gironde",   order: 1 },
  { slug: 'salles',            name: 'Salles',            dept: 'Gironde',    context: 'dans les Landes de Gascogne, en Gironde',  order: 2 },
  { slug: 'le-barp',           name: 'Le Barp',           dept: 'Gironde',    context: 'entre Bordeaux et Arcachon, en Gironde',   order: 3 },
  { slug: 'mios',              name: 'Mios',              dept: 'Gironde',    context: 'dans les Landes de Gascogne, en Gironde',  order: 4 },
  { slug: 'hostens',           name: 'Hostens',           dept: 'Gironde',    context: 'dans les Landes de Gascogne, en Gironde',  order: 5 },
  { slug: 'cestas',            name: 'Cestas',            dept: 'Gironde',    context: 'entre Bordeaux et Arcachon, en Gironde',   order: 6 },
  { slug: 'arcachon',          name: 'Arcachon',          dept: 'Gironde',    context: "sur le Bassin d'Arcachon, en Gironde",     order: 7 },
  { slug: 'saugnacq-et-muret', name: 'Saugnacq-et-Muret', dept: 'Les Landes', context: 'au Nord des Landes',                       order: 8 },
]
```

- [ ] **Step 2: Refactorer `PageLocaleDetail.tsx` pour lire la source statique**

Dans `frontend/src/pages/PageLocaleDetail.tsx` :
- Retirer les imports `useState, useEffect` (s'ils ne servent plus qu'au fetch — garder `useState` pour `openFaq`).
- Retirer l'import `API_BASE`.
- Ajouter `import { CITIES } from '../data/cities'`.
- Remplacer le bloc `const [city, setCity] = useState(...)` + le `useEffect(fetch...)` + les gardes `city === null` (skeleton de chargement) par une lecture synchrone :
```tsx
const city = CITIES.find((c) => c.slug === citySlug)

if (!service) return <Navigate to="/pages-locales" replace />
if (!city) return <Navigate to="/pages-locales" replace />
```
- Supprimer le bloc JSX du skeleton `animate-pulse` (état de chargement) devenu inutile.

- [ ] **Step 3: Refactorer `PagesLocales.tsx` pour lire la source statique**

Dans `frontend/src/pages/PagesLocales.tsx` : remplacer toute source de villes issue de l'API par `import { CITIES } from '../data/cities'` et itérer sur `CITIES` pour la liste. (Si la page ne chargeait pas encore les villes, ajouter simplement l'usage de `CITIES` là où la liste des villes doit s'afficher.)

- [ ] **Step 4: Vérifier en dev (non-régression navigation)**

Run (depuis `frontend/`) :
```bash
npm run dev
```
Ouvrir `http://localhost:3000/pages-locales/creation-de-sites-internet/cestas` : la page s'affiche immédiatement, sans skeleton de chargement, avec le nom « Cestas ». Une ville inexistante (`.../zzz`) redirige vers `/pages-locales`. Arrêter le serveur ensuite.

- [ ] **Step 5: Vérifier lint + types**

Run (depuis `frontend/`) :
```bash
npm run lint && npx tsc -b
```
Expected : aucune erreur (notamment pas d'import inutilisé `API_BASE`/`useEffect`).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/cities.ts frontend/src/pages/PageLocaleDetail.tsx frontend/src/pages/PagesLocales.tsx
git commit -m "feat(seo): villes en source statique, fin du fetch client sur pages locales"
```

---

### Task 3: Conversion complète des routes + migration Head

**But :** déclarer toutes les routes en format vite-react-ssg (layout racine + providers), énumérer les routes dynamiques via `getStaticPaths`, et migrer chaque page de `react-helmet-async` vers le `Head` de vite-react-ssg pour que `<title>`/`<meta>`/JSON-LD soient dans le HTML pré-rendu.

**Files:**
- Create: `frontend/src/RootLayout.tsx`
- Modify: `frontend/src/routes.tsx` (routes complètes + getStaticPaths)
- Modify: `frontend/src/App.tsx` (extraire `ScrollToTop`/`PublicLayout` vers le layout, ou supprimer si absorbé)
- Modify: toutes les pages avec `<Helmet>` : `Home`, `Contact`, `FAQ`, `PrendreRdv`, `MentionsLegales`, `PolitiqueConfidentialite`, `PagesLocales`, `PageLocaleDetail`
- Modify: `frontend/package.json` (retirer `react-helmet-async` si plus utilisé)

**Interfaces:**
- Consumes: `routes` (Task 1), `CITIES` (Task 2), `SERVICES_LOCAL` (de `localPages.ts`).
- Produces: `RootLayout` (élément racine avec `<Outlet/>`, providers, Header/Footer, ScrollToTop) ; `routes` enrichi consommé par la génération de sitemap (Task 5).

- [ ] **Step 1: Créer le layout racine**

Create `frontend/src/RootLayout.tsx` (reprend `ThemeProvider`, `CookieConsentInit`, `ScrollToTop`, `Header`, `Footer` depuis l'ancien `App.tsx`) :
```tsx
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CookieConsentInit from './components/ui/CookieConsent'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
  return null
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CookieConsentInit />
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </ThemeProvider>
  )
}
```
Note : le layout inclut Header/Footer pour toutes les pages publiques. Les pages admin ne doivent PAS avoir Header/Footer → elles seront des routes hors de ce layout (voir Step 2).

- [ ] **Step 2: Déclarer les routes complètes**

Replace `frontend/src/routes.tsx` :
```tsx
import type { RouteRecord } from 'vite-react-ssg'
import RootLayout from './RootLayout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import PrendreRdv from './pages/PrendreRdv'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import PagesLocales from './pages/PagesLocales'
import PageLocaleDetail from './pages/PageLocaleDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFound from './pages/NotFound'
import { SERVICES_LOCAL } from './data/localPages'
import { CITIES } from './data/cities'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home />, entry: 'src/pages/Home.tsx' },
      { path: 'contactez-nous', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'prendre-rdv', element: <PrendreRdv /> },
      { path: 'mentions-legales', element: <MentionsLegales /> },
      { path: 'politique-de-confidentialite', element: <PolitiqueConfidentialite /> },
      { path: 'pages-locales', element: <PagesLocales /> },
      {
        path: 'pages-locales/:service/:city',
        element: <PageLocaleDetail />,
        getStaticPaths: () =>
          SERVICES_LOCAL.flatMap((s) =>
            CITIES.map((c) => `/pages-locales/${s.slug}/${c.slug}`),
          ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Routes admin : client-only, exclues du pré-rendu via ssgOptions.includedRoutes (Step 3bis)
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin/dashboard', element: <AdminDashboard /> },
]
```
Note : par défaut vite-react-ssg pré-rend TOUTES les routes à chemin statique — y compris `/admin`, ce qui risque de casser le build (composants dépendant de `window`/auth). L'exclusion se fait explicitement au Step 3bis via `ssgOptions.includedRoutes`. Les routes admin restent servies via le fallback SPA (rewrite Vercel vers `index.html`).

- [ ] **Step 3bis: Exclure `/admin` du pré-rendu (config SSG)**

Modify `frontend/vite.config.ts` : ajouter la clé `ssgOptions.includedRoutes` en fin de `defineConfig({...})` (ce même objet `ssgOptions` sera complété par `onFinished` en Task 5) :
```ts
export default defineConfig({
  // ...plugins/server existants...
  ssgOptions: {
    includedRoutes(paths: string[]) {
      return paths.filter((p) => !p.startsWith('/admin'))
    },
  },
})
```
Si TypeScript signale une clé de config inconnue, importer le type de config étendu depuis `vite-react-ssg` ou caster ; documenter en commentaire la solution retenue.

- [ ] **Step 3: Extraire la page 404 dans son composant**

Create `frontend/src/pages/NotFound.tsx` avec le JSX du bloc `path="*"` actuel de `App.tsx` (le bloc « 404 / Page introuvable »), y compris un `<Head>` posant `noindex` :
```tsx
import { Head } from 'vite-react-ssg'

export default function NotFound() {
  return (
    <>
      <Head><meta name="robots" content="noindex" /></Head>
      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-syne font-extrabold text-9xl text-nemo-orange mb-4" aria-hidden="true">404</p>
          <h1 className="font-syne font-bold text-3xl text-nemo-dark-bg dark:text-nemo-bg mb-4">Page introuvable</h1>
          <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 mb-6">La page que vous cherchez n'existe pas ou a été déplacée.</p>
          <a href="/" className="btn-primary">Retour à l'accueil</a>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 4: Supprimer l'ancien `App.tsx`**

Le contenu de `frontend/src/App.tsx` est désormais réparti entre `RootLayout.tsx`, `routes.tsx` et `NotFound.tsx`. Supprimer le fichier :
```bash
git rm frontend/src/App.tsx
```
Vérifier qu'aucun autre fichier n'importe `App` (`main.tsx` a déjà été converti en Task 1).

- [ ] **Step 5: Migrer chaque page de `Helmet` vers `Head`**

Pour CHACUNE des pages `Home`, `Contact`, `FAQ`, `PrendreRdv`, `MentionsLegales`, `PolitiqueConfidentialite`, `PagesLocales`, `PageLocaleDetail`, appliquer la transformation mécanique suivante (le contenu enfant reste identique, seul le composant change) :
- Remplacer `import { Helmet } from 'react-helmet-async'` par `import { Head } from 'vite-react-ssg'`.
- Remplacer la balise ouvrante `<Helmet>` par `<Head>` et la fermante `</Helmet>` par `</Head>`.

Exemple concret sur `Home.tsx` (avant → après) :
```tsx
// avant
import { Helmet } from 'react-helmet-async';
...
      <Helmet>
        <title>...</title>
        <meta name="description" content="..." />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>
// après
import { Head } from 'vite-react-ssg';
...
      <Head>
        <title>...</title>
        <meta name="description" content="..." />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Head>
```

- [ ] **Step 6: Retirer `react-helmet-async` du projet**

Vérifier qu'il ne reste aucune occurrence :
```bash
grep -rn "react-helmet-async\|Helmet\|HelmetProvider" src
```
Expected : aucun résultat. Puis désinstaller :
```bash
npm uninstall react-helmet-async
```

- [ ] **Step 7: Build et vérifier le pré-rendu de plusieurs routes**

Run (depuis `frontend/`) :
```bash
npm run build
ls dist dist/pages-locales/creation-de-sites-internet/cestas
grep -o "<title>[^<]*</title>" dist/pages-locales/creation-de-sites-internet/cestas/index.html
grep -c "Cestas" dist/pages-locales/creation-de-sites-internet/cestas/index.html
ls dist/admin 2>/dev/null && echo "ERREUR: admin pre-rendu" || echo "OK admin non pre-rendu"
```
Expected : chaque route publique a son dossier + `index.html` ; le `<title>` de la page Cestas est spécifique (« Création de sites internet à Cestas — Nemo Solutions ») ; le texte « Cestas » est présent ; aucun HTML généré sous `dist/admin`.

- [ ] **Step 8: Non-régression dev**

Run (depuis `frontend/`) : `npm run dev`, vérifier navigation (accueil, pages-locales, une page ville, admin login) puis arrêter.

- [ ] **Step 9: Commit**

```bash
git add -A frontend
git commit -m "feat(ssg): conversion complete des routes + Head pre-rendu, remplace react-helmet-async"
```

---

### Task 4: robots.txt

**Files:**
- Create: `frontend/public/robots.txt`

- [ ] **Step 1: Créer le fichier**

Create `frontend/public/robots.txt` :
```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://www.nemosolutions.fr/sitemap.xml
```

- [ ] **Step 2: Vérifier la copie au build**

Run (depuis `frontend/`) :
```bash
npm run build && cat dist/robots.txt
```
Expected : `dist/robots.txt` présent et identique.

- [ ] **Step 3: Commit**

```bash
git add frontend/public/robots.txt
git commit -m "feat(seo): ajout robots.txt (bloque /admin, declare le sitemap)"
```

---

### Task 5: sitemap.xml généré au build

**But :** générer `dist/sitemap.xml` listant toutes les URLs publiques à partir des mêmes données que le routage (pages statiques + `SERVICES_LOCAL` × `CITIES`), via le hook `onFinished` de vite-react-ssg.

**Files:**
- Create: `frontend/scripts/sitemap-paths.ts` (liste des chemins publics, réutilisable)
- Modify: `frontend/vite.config.ts` (ajout `ssgOptions.onFinished`)

**Interfaces:**
- Consumes: `SERVICES_LOCAL`, `CITIES`.
- Produces: `export function getPublicPaths(): string[]`.

- [ ] **Step 1: Créer la liste des chemins publics**

Create `frontend/scripts/sitemap-paths.ts` :
```ts
import { SERVICES_LOCAL } from '../src/data/localPages'
import { CITIES } from '../src/data/cities'

const STATIC_PATHS = [
  '/',
  '/contactez-nous',
  '/faq',
  '/prendre-rdv',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/pages-locales',
]

export function getPublicPaths(): string[] {
  const local = SERVICES_LOCAL.flatMap((s) =>
    CITIES.map((c) => `/pages-locales/${s.slug}/${c.slug}`),
  )
  return [...STATIC_PATHS, ...local]
}
```

- [ ] **Step 2: Brancher la génération sur le build**

Modify `frontend/vite.config.ts` : l'objet `ssgOptions` existe déjà (créé en Task 3bis avec `includedRoutes`). Y AJOUTER la méthode `onFinished` et les imports nécessaires en haut du fichier :
```ts
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getPublicPaths } from './scripts/sitemap-paths'
// ...
  ssgOptions: {
    includedRoutes(paths: string[]) {           // déjà présent (Task 3bis)
      return paths.filter((p) => !p.startsWith('/admin'))
    },
    onFinished() {                                // AJOUT
      const base = 'https://www.nemosolutions.fr'
      const urls = getPublicPaths()
        .map((p) => `  <url><loc>${base}${p === '/' ? '/' : p}</loc></url>`)
        .join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      writeFileSync(resolve(__dirname, 'dist/sitemap.xml'), xml)
    },
  },
```

- [ ] **Step 3: Build et vérifier le sitemap**

Run (depuis `frontend/`) :
```bash
npm run build
grep -c "<loc>" dist/sitemap.xml
grep "creation-de-sites-internet/cestas" dist/sitemap.xml
grep -c "/admin" dist/sitemap.xml
```
Expected : `<loc>` = 7 statiques + (7 services × 8 villes = 56) = **63** URLs ; l'URL Cestas présente ; **0** occurrence de `/admin`.

- [ ] **Step 4: Commit**

```bash
git add frontend/scripts/sitemap-paths.ts frontend/vite.config.ts
git commit -m "feat(seo): sitemap.xml genere au build (URLs publiques, /admin exclu)"
```

---

### Task 6: Schema LocalBusiness — visibilité serveur + ciblage ville

**But :** garantir que le JSON-LD `LocalBusiness` (déjà riche dans `Home.tsx`) est bien dans le HTML pré-rendu, réconcilier le JSON-LD statique obsolète de `index.html`, et ajouter un JSON-LD ciblé sur la ville dans `PageLocaleDetail`.

**Files:**
- Modify: `frontend/index.html` (JSON-LD statique)
- Modify: `frontend/src/pages/Home.tsx` (cohérence des champs)
- Modify: `frontend/src/pages/PageLocaleDetail.tsx` (JSON-LD ciblé ville dans `<Head>`)

- [ ] **Step 1: Réconcilier le JSON-LD statique de `index.html`**

Dans `frontend/index.html`, remplacer le bloc `<script type="application/ld+json">` actuel (type `ProfessionalService`, sans adresse/téléphone) par le même objet `LocalBusiness` que `Home.tsx` (name, address 29 Avenue des Pins 33830 Belin-Béliet, telephone `+33621145888`, url `https://www.nemosolutions.fr`, areaServed, priceRange). Objectif : plus de contradiction entre le fallback statique et le schema pré-rendu.

- [ ] **Step 2: Vérifier la cohérence des champs de `Home.tsx`**

Dans `frontend/src/pages/Home.tsx`, vérifier que `url` = `https://www.nemosolutions.fr` (aligné sur le canonique) et que `telephone` = `+33621145888`. Corriger si divergent.

- [ ] **Step 3: Ajouter un JSON-LD ciblé ville dans `PageLocaleDetail.tsx`**

Dans le `<Head>` de `PageLocaleDetail.tsx`, ajouter un script JSON-LD `LocalBusiness` dont `areaServed` cible la ville courante :
```tsx
<script type="application/ld+json">
  {JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Nemo Solutions',
    url: canonical,
    telephone: '+33621145888',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '29 Avenue des Pins',
      addressLocality: 'Belin-Béliet',
      postalCode: '33830',
      addressCountry: 'FR',
    },
    areaServed: { '@type': 'City', name: city.name },
    priceRange: '€€',
  })}
</script>
```
(`canonical` et `city` sont déjà disponibles dans le composant.)

- [ ] **Step 4: Build et vérifier le JSON-LD dans le HTML**

Run (depuis `frontend/`) :
```bash
npm run build
grep -c "LocalBusiness" dist/index.html
grep -c "LocalBusiness" dist/pages-locales/creation-de-sites-internet/cestas/index.html
grep "areaServed" dist/pages-locales/creation-de-sites-internet/cestas/index.html
```
Expected : `LocalBusiness` présent dans le HTML de l'accueil ET de la page ville ; `areaServed` avec « Cestas » sur la page ville.

- [ ] **Step 5: Commit**

```bash
git add frontend/index.html frontend/src/pages/Home.tsx frontend/src/pages/PageLocaleDetail.tsx
git commit -m "feat(seo): LocalBusiness pre-rendu + schema cible ville, index.html reconcilie"
```

---

### Task 7: Redirection 301 de l'URL WordPress héritée

**Files:**
- Modify: `vercel.json` (ajout bloc `redirects`)

- [ ] **Step 1: Ajouter la redirection**

Modify `vercel.json` : ajouter un tableau `redirects` AVANT `rewrites` :
```json
"redirects": [
  { "source": "/agence-web-wordpress-a-cestas", "destination": "/pages-locales/creation-de-sites-internet/cestas", "permanent": true },
  { "source": "/agence-web-wordpress-a-cestas/", "destination": "/pages-locales/creation-de-sites-internet/cestas", "permanent": true }
],
```
(`permanent: true` = 301. Les deux variantes couvrent avec/sans slash final.)

- [ ] **Step 2: Vérifier la validité JSON**

Run (depuis la racine) :
```bash
node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('vercel.json valide')"
```
Expected : « vercel.json valide ».

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "fix(seo): redirection 301 de l'ancienne URL WordPress vers la page Cestas"
```

---

### Task 8: Vérification finale et non-régression

**But :** prouver que le critère de succès de l'audit est atteint (contenu + SEO dans le HTML servi) et qu'aucune régression n'est introduite.

- [ ] **Step 1: Build propre complet**

Run (depuis `frontend/`) :
```bash
rm -rf dist && npm run build
```
Expected : build réussi sans erreur.

- [ ] **Step 2: Preuve « robot » sur routes clés**

Run (depuis `frontend/`) :
```bash
for f in "index.html" "faq/index.html" "pages-locales/index.html" "pages-locales/creation-de-sites-internet/cestas/index.html"; do
  echo "=== $f ==="
  grep -o "<title>[^<]*</title>" "dist/$f"
  grep -c "Nemo" "dist/$f"
done
```
Expected : chaque route a un `<title>` propre et du texte présent dans le HTML.

- [ ] **Step 3: Vérifier fichiers SEO**

Run (depuis `frontend/`) :
```bash
test -f dist/robots.txt && echo "robots OK"
test -f dist/sitemap.xml && echo "sitemap OK"
grep -c "<loc>" dist/sitemap.xml
```
Expected : robots OK, sitemap OK, 63 `<loc>`.

- [ ] **Step 4: Lint + types**

Run (depuis `frontend/`) :
```bash
npm run lint && npx tsc -b
```
Expected : aucune erreur.

- [ ] **Step 5: Non-régression runtime**

Run (depuis `frontend/`) : `npm run dev`, vérifier accueil / navigation / une page ville / admin login, puis arrêter. Optionnel : `npm run preview` sur le build pour confirmer le rendu statique servi.

- [ ] **Step 6: Commit final (si ajustements)**

```bash
git add -A
git commit -m "chore(seo): verification finale socle SSG + SEO technique"
```

---

## Notes d'exécution

- **Task 1 est un gate bloquant.** Ne pas enchaîner tant que le build SSG avec react-router 7 n'est pas vert (repli : pin `react-router-dom@^6`).
- Toutes les commandes de vérification s'exécutent **depuis `frontend/`** sauf Task 7 (racine).
- Nombre attendu d'URLs sitemap = 63 (7 statiques + 7 services × 8 villes). Si la liste de villes évolue au chantier 2, ce nombre change.
- Chantier 2 (hors de ce plan) : pages villes dédiées à contenu unique, ajout Marcheprime/Biganos, correction structurelle du soft-404.
