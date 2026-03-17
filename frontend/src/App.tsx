import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieConsentInit from './components/ui/CookieConsent';
import Home from './pages/Home';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrendreRdv from './pages/PrendreRdv';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function PageLocale() {
  const { pathname } = useLocation();
  const city = pathname.split('/').pop()?.replace(/-/g, ' ') ?? '';
  const cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <PublicLayout>
      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo max-w-3xl text-center">
          <h1 className="font-syne font-extrabold text-4xl text-nemo-dark-bg dark:text-nemo-bg mb-6">
            Agence web <span className="text-nemo-orange">{cityCapitalized}</span>
          </h1>
          <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-lg leading-relaxed">
            Nemo Solutions accompagne les entreprises de {cityCapitalized} dans leur développement digital.
            Création de sites internet, SEO local, gestion des réseaux sociaux.
          </p>
        </div>
      </main>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <CookieConsentInit />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/contactez-nous" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/prendre-rdv" element={<PublicLayout><PrendreRdv /></PublicLayout>} />
            <Route path="/mentions-legales" element={<PublicLayout><MentionsLegales /></PublicLayout>} />
            <Route path="/politique-de-confidentialite" element={<PublicLayout><PolitiqueConfidentialite /></PublicLayout>} />
            <Route path="/pages-locales/:city" element={<PageLocale />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={
              <PublicLayout>
                <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-syne font-extrabold text-9xl text-nemo-orange mb-4" aria-hidden="true">404</p>
                    <h1 className="font-syne font-bold text-3xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
                      Page introuvable
                    </h1>
                    <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 mb-6">
                      La page que vous cherchez n'existe pas ou a été déplacée.
                    </p>
                    <a href="/" className="btn-primary">Retour à l'accueil</a>
                  </div>
                </main>
              </PublicLayout>
            } />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
