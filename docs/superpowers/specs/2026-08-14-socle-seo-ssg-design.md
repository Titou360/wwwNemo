# Socle SEO — Conversion SSG + fondamentaux techniques

Date : 2026-08-14
Branche : `migration-vercel`
Statut : design validé en chat, en attente de relecture avant plan d'implémentation

## Contexte et problème

`nemosolutions.fr` est le site de l'agence Nemo Solutions (Val de l'Eyre / Nouvelle-Aquitaine).
Objectif métier : atteindre le top 3 Google sur « agence web [ville] » et « création site
internet [ville] » sur la zone de chalandise.

Un audit externe a identifié 3 problèmes. Diagnostic réel après exploration du dépôt :

1. **Rendu côté robots (priorité absolue)** — Le site n'est **pas** en Next.js comme le
   supposait l'audit. C'est un **SPA Vite/React en CSR pur** : `frontend/index.html` ne contient
   que `<div id="root"></div>` + le bundle JS. Tout le texte, les `<title>`/`<meta>` par page
   (via `react-helmet-async`) et même les données des pages villes (`fetch('/api/cities')` en
   `useEffect`) sont produits **côté navigateur**. Le HTML servi est identique pour toutes les
   URLs. Handicap majeur pour une nouvelle agence sans autorité de domaine visant des requêtes
   locales concurrentielles.

2. **Page cassée `/agence-web-wordpress-a-cestas/`** — Cette URL **n'existe pas dans le dépôt**.
   C'est une URL héritée de l'ancien site WordPress, indexée par Google avec un message
   « maintenance ». Sur le nouveau site elle tombe sur le catch-all SPA (soft-404 en HTTP 200).

3. **SEO technique de base** — `robots.txt` **absent**, `sitemap.xml` **absent**. Le JSON-LD
   existe (statique dans `index.html`) mais est incomplet : type `ProfessionalService`, sans
   `address` ni `telephone`, `areaServed` vague.

## Objectif de ce chantier (Socle SEO)

Rendre le contenu et les métadonnées SEO présents dans le **HTML servi** (pas seulement après
exécution du JS), et poser les fondamentaux techniques. La création de pages villes dédiées
(contenu unique par ville) est un **2e chantier** distinct, hors périmètre de cette spec.

## Décisions validées (via dialogue)

- **Stratégie de rendu** : SSG au build via **`vite-react-ssg`** (pas de migration Next.js, pas
  de serveur SSR). Compatible React 19 + Vite 6. Risque : peer `react-router-dom ^6` alors que le
  projet est en v7 → traité en validation initiale (voir Risques).
- **Périmètre** : « Socle SEO complet d'abord » = SSG + robots.txt + sitemap + schema enrichi +
  redirection 301. Les pages villes uniques = chantier 2.
- **Source des villes** : **liste statique dans le repo** (source de vérité pour la
  pré-génération). L'admin `cities` (Mongo) et `/api/cities` restent en place mais ne pilotent
  plus les pages SEO.

## Informations métier fournies

- **Adresse** : 29 Avenue des Pins, 33830 Belin-Béliet
- **Téléphone** : +33 6 21 14 58 88 (0621145888)
- **Redirection 301** : `/agence-web-wordpress-a-cestas/` → `/pages-locales/creation-de-sites-internet/cestas`

## Architecture

### 1. Conversion SSG (`vite-react-ssg`)

- Ajouter la dépendance `vite-react-ssg`.
- **Point d'entrée** `frontend/src/main.tsx` : remplacer
  `createRoot(...).render(<App/>)` par l'export attendu :
  `export const createRoot = ViteReactSSG({ routes }, setupFn)`.
- **Routes** : convertir le JSX `<BrowserRouter><Routes><Route>` de `App.tsx` en **tableau de
  routes** (objets `{ path, element, ... }`) consommé par vite-react-ssg. Les providers globaux
  (`HelmetProvider` remplacé, `ThemeProvider`, `CookieConsentInit`, `ScrollToTop`, `PublicLayout`)
  sont réorganisés dans un layout racine.
- **Script build** : `frontend/package.json` → `"build": "vite-react-ssg build"` (le `tsc -b`
  reste en amont). `vercel.json` `outputDirectory` inchangé (`frontend/dist`).
- **Routes dynamiques** : `/pages-locales/:service/:city` énumérées via `getStaticPaths`
  croisant les 7 services (`SERVICES_LOCAL`) × la liste de villes statique → 1 HTML par combinaison.
- **Head par page** : migrer de `react-helmet-async` vers le composant `Head` de vite-react-ssg,
  qui écrit `<title>`/`<meta>`/canonical/JSON-LD dans le HTML pré-rendu. Concerne :
  `Home`, `Contact`, `FAQ`, `PrendreRdv`, `MentionsLegales`, `PolitiqueConfidentialite`,
  `PagesLocales`, `PageLocaleDetail`.
- **Admin** : `/admin` et `/admin/dashboard` restent `noindex` et **non pré-rendus** (rendu
  client uniquement) ; ils ne doivent pas casser le build.

### 2. Villes en source statique

- Nouveau module `frontend/src/data/cities.ts` : tableau des villes cibles (`slug`, `name`,
  `dept`, `context`), même forme que `backend/src/seed.js`. Reprend **la liste actuelle du seed**
  telle quelle pour ce chantier (Belin-Béliet, Salles, Le Barp, Mios, Hostens, Cestas, Arcachon,
  Saugnacq-et-Muret). L'ajustement de la liste finale (ajout Marcheprime, Biganos) se fera au
  chantier 2.
- `PageLocaleDetail.tsx` : supprimer le `fetch('/api/cities')` + `useEffect` + états
  `loading/not-found` associés ; lire la ville depuis `cities.ts` par `citySlug`. Redirection
  `Navigate` vers `/pages-locales` si service ou ville introuvable (comportement conservé).
- `PagesLocales.tsx` : consommer la même source statique.
- **Non touché** : modèle `City`, `routes/cities.js`, `seed.js`, section `cities` de l'admin
  restent fonctionnels (rétro-compat).

### 3. Fondamentaux SEO

- **`frontend/public/robots.txt`** (statique) : `Allow` global, `Disallow: /admin`, ligne
  `Sitemap: https://www.nemosolutions.fr/sitemap.xml`.
- **`dist/sitemap.xml`** généré au build via le hook `onFinished` de vite-react-ssg (qui connaît
  les routes pré-rendues) : toutes les URLs publiques absolues, `/admin*` exclu. Se régénère à
  chaque déploiement.
- **Schema JSON-LD** : passer de `ProfessionalService` à **`LocalBusiness`** complet — `name`,
  `address` (PostalAddress : 29 Avenue des Pins, 33830 Belin-Béliet), `telephone`
  (+33 6 21 14 58 88), `areaServed` explicite (les villes), `url`, `logo`, `image`, `founder`,
  `priceRange`. Sur `PageLocaleDetail`, JSON-LD ciblé sur la ville concernée.
- **Redirection 301** : bloc `redirects` dans `vercel.json` :
  `/agence-web-wordpress-a-cestas/` → `/pages-locales/creation-de-sites-internet/cestas` (301).
  Emplacement prévu pour d'autres URLs WordPress héritées si Search Console en révèle.

## Data flow (après changement)

Build (Vercel) → `vite-react-ssg build` lit `SERVICES_LOCAL` + `cities.ts` → rend chaque route en
HTML (texte + Head + JSON-LD) dans `dist/` → `onFinished` écrit `sitemap.xml` → `robots.txt` copié
depuis `public/`. Runtime : navigateur reçoit du HTML riche, React hydrate. `/api/*` inchangé
(fonction serverless Express). Redirections gérées en edge par Vercel.

## Risques et mitigations

- **react-router-dom v7 vs peer ^6 de vite-react-ssg** (risque principal) : valider **en tout
  début d'implémentation** qu'un build SSG minimal fonctionne avec RR7. Repli si blocage :
  (a) épingler `react-router-dom@^6`, ou (b) bascule vers `react-snap`. Ne pas avancer sur le
  reste tant que ce point n'est pas levé.
- **Clash `react-helmet-async`** (projet ^3.0.0 vs dépendance interne ^1.3.0 de vite-react-ssg) :
  on retire l'usage direct de helmet au profit de `Head` ; retirer la dépendance `react-helmet-async`
  du projet si plus utilisée.
- **Build local vs Mongo** : la source villes étant statique, le build SSG ne dépend plus de Mongo
  → build local fiable malgré l'antivirus/TLS.
- **Soft-404** : le catch-all renvoie 200 sur host statique. Souci mineur ; on traite en priorité
  les URLs héritées connues par redirections explicites.

## Critères de succès / vérification

1. `npm run build` produit un `dist/<route>/index.html` par route, chacun avec `<title>`/`<meta>`/
   JSON-LD propres et le **texte visible présent dans le HTML** (accueil + ≥1 page ville).
2. Test « robot » : inspection du HTML brut généré (sans exécuter le JS) → texte + schema présents.
3. `dist/sitemap.xml` existe, liste les URLs publiques, exclut `/admin`.
4. `dist/robots.txt` présent et cohérent (sitemap déclaré, `/admin` bloqué).
5. Redirection 301 présente dans `vercel.json` (test réel après déploiement).
6. Non-régression : `npm run dev` OK, navigation client OK, admin fonctionnel.

## Hors périmètre (chantier 2)

- Pages villes dédiées à contenu unique par ville (Belin-Béliet, Salles, Le Barp, Marcheprime,
  Biganos, Cestas), ajout de Marcheprime/Biganos à la liste, rédaction du contenu non dupliqué.
- Correction structurelle du soft-404 générique.
