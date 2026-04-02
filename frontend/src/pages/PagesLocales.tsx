import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SERVICES_LOCAL, type City } from '../data/localPages';
import { API_BASE } from '../lib/api';

export default function PagesLocales() {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/cities`)
      .then(r => r.json())
      .then(data => setCities(Array.isArray(data) ? data : []))
      .catch(() => setCities([]));
  }, []);

  return (
    <>
      <Helmet>
        <title>Pages locales — Nemo Solutions | Agence web Val de l'Eyre</title>
        <meta
          name="description"
          content="Nemo Solutions intervient dans toute la Gironde : Belin-Béliet, Salles, Le Barp et alentours. Création de sites, SEO, réseaux sociaux, maintenance web."
        />
        <link rel="canonical" href="https://www.nemosolutions.fr/pages-locales" />
      </Helmet>

      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo">
          <Breadcrumb crumbs={[{ label: 'Pages locales' }]} />

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-4 border border-nemo-orange/25">
              <MapPin size={14} aria-hidden="true" />
              Présence locale
            </span>
            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
              Votre agence web <span className="text-nemo-orange">près de chez vous</span>
            </h1>
            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Nemo Solutions accompagne les artisans, commerçants et entreprises du Val de l'Eyre
              et de la Gironde dans leur développement digital.
            </p>
          </div>

          {/* Grille services × villes */}
          <div className="space-y-12">
            {SERVICES_LOCAL.map((service, si) => (
              <motion.section
                key={service.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: si * 0.05, ease: [0.22, 1, 0.36, 1] }}
                aria-labelledby={`service-${service.slug}`}
              >
                {/* Titre de catégorie */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-1 h-8 rounded-full ${
                      service.color === 'nemo-orange' ? 'bg-nemo-orange' : 'bg-nemo-blue'
                    }`}
                    aria-hidden="true"
                  />
                  <h2
                    id={`service-${service.slug}`}
                    className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg"
                  >
                    {service.title}
                  </h2>
                </div>

                {/* Cards villes */}
                {cities.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-20 rounded-2xl bg-nemo-dark-bg/5 dark:bg-nemo-dark-surface animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cities.map((city) => (
                      <Link
                        key={city.slug}
                        to={`/pages-locales/${service.slug}/${city.slug}`}
                        className="card-nemo p-5 group flex items-center justify-between gap-3 hover:border-nemo-orange/40 transition-colors"
                        aria-label={`${service.title} à ${city.name}`}
                      >
                        <div>
                          <p className="font-syne font-semibold text-base text-nemo-dark-bg dark:text-nemo-bg group-hover:text-nemo-orange dark:group-hover:text-nemo-orange transition-colors">
                            {service.title}
                          </p>
                          <p className="font-jakarta text-sm text-nemo-dark-bg/50 dark:text-nemo-dark-muted mt-0.5 flex items-center gap-1">
                            <MapPin size={12} aria-hidden="true" />
                            {city.name} — {city.dept}
                          </p>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-nemo-dark-bg/20 dark:text-nemo-dark-muted group-hover:text-nemo-orange dark:group-hover:text-nemo-orange transition-colors shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            ))}
          </div>

          {/* CTA bas de page */}
          <div className="mt-20 text-center bg-nemo-orange/5 dark:bg-nemo-dark-surface border border-nemo-orange/20 rounded-3xl p-10">
            <h2 className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-3">
              Votre ville n'est pas listée ?
            </h2>
            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-dark-muted mb-6">
              Nemo Solutions intervient dans toute la Nouvelle-Aquitaine. Contactez-nous pour discuter de votre projet.
            </p>
            <Link to="/contactez-nous" className="btn-primary">
              Nous contacter
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
