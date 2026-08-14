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
