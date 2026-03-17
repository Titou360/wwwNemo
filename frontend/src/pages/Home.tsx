import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import DevisBanner from '../components/sections/DevisBanner';
import About from '../components/sections/About';
import References from '../components/sections/References';
import Blog from '../components/sections/Blog';
import Testimonials from '../components/sections/Testimonials';

const LD_JSON = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nemo Solutions',
  description: 'Agence web spécialisée en création de sites internet, SEO et réseaux sociaux, basée à Belin-Béliet dans le Val de l\'Eyre, Nouvelle-Aquitaine.',
  url: 'https://nemosolutions.fr',
  telephone: '+33621145888',
  email: 'clement@nemosolutions.fr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '29 Avenue des Pins',
    addressLocality: 'Belin-Béliet',
    postalCode: '33830',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.5027,
    longitude: -0.7894,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  priceRange: '€€',
  sameAs: [
    'https://facebook.com/nemosolutions',
    'https://instagram.com/nemosolutions',
    'https://linkedin.com/company/nemosolutions',
  ],
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Nemo Solutions — Agence web Val de l'Eyre & Nouvelle-Aquitaine</title>
        <meta
          name="description"
          content="Nemo Solutions, agence web basée à Belin-Béliet. Création de sites internet, SEO, réseaux sociaux et conseil digital pour les entreprises de Nouvelle-Aquitaine. Devis gratuit."
        />
        <meta name="keywords" content="agence web Belin-Béliet, création site internet Val de l'Eyre, SEO Gironde, agence web Nouvelle-Aquitaine, Nemo Solutions" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Nemo Solutions — Agence web Val de l'Eyre" />
        <meta property="og:description" content="Création de sites internet, SEO, réseaux sociaux. Basé à Belin-Béliet, on vous accompagne partout en Nouvelle-Aquitaine." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <link rel="canonical" href="https://nemosolutions.fr" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <main id="main-content">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-nemo-orange text-white px-4 py-2 rounded-xl font-jakarta font-semibold text-sm">
          Aller au contenu principal
        </a>
        <Hero />
        <Services />
        <DevisBanner />
        <About />
        <References />
        <Blog />
        <Testimonials />
      </main>
    </>
  );
}
