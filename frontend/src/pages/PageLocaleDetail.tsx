import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, ChevronDown, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SERVICES_LOCAL, type City } from '../data/localPages';
import { API_BASE } from '../lib/api';

export default function PageLocaleDetail() {
  const { service: serviceSlug, city: citySlug } = useParams<{ service: string; city: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [city, setCity] = useState<City | null | 'not-found'>(null);

  const service = SERVICES_LOCAL.find((s) => s.slug === serviceSlug);

  useEffect(() => {
    fetch(`${API_BASE}/api/cities`)
      .then(r => r.json())
      .then((data: City[]) => {
        const found = Array.isArray(data) ? data.find(c => c.slug === citySlug) : null;
        setCity(found ?? 'not-found');
      })
      .catch(() => setCity('not-found'));
  }, [citySlug]);

  if (!service) return <Navigate to="/pages-locales" replace />;
  if (city === null) {
    // Chargement
    return (
      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo max-w-4xl space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-nemo-dark-bg/5 dark:bg-nemo-dark-surface animate-pulse" />
          ))}
        </div>
      </main>
    );
  }
  if (city === 'not-found') return <Navigate to="/pages-locales" replace />;

  const pageTitle = `${service.title} à ${city.name}`;
  const metaDesc = `Nemo Solutions propose ses services de ${service.title.toLowerCase()} à ${city.name} (${city.dept}). ${service.tagline}. Devis gratuit et sans engagement.`;
  const canonical = `https://www.nemosolutions.fr/pages-locales/${service.slug}/${city.slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle} — Nemo Solutions</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo max-w-4xl">
          <Breadcrumb
            crumbs={[
              { label: 'Pages locales', href: '/pages-locales' },
              { label: service.title, href: `/pages-locales#service-${service.slug}` },
              { label: city.name },
            ]}
          />

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-5 border border-nemo-orange/25">
              <MapPin size={14} aria-hidden="true" />
              {city.name} — {city.dept}
            </span>

            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-nemo-dark-bg dark:text-nemo-bg mb-4 leading-tight">
              {service.title}{' '}
              <span className="text-nemo-orange">à {city.name}</span>
            </h1>

            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-lg leading-relaxed">
              {service.tagline}
            </p>
          </motion.div>

          {/* Intro */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="card-nemo p-8 mb-8"
            aria-labelledby="intro-title"
          >
            <h2 id="intro-title" className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
              Votre partenaire digital {city.context}
            </h2>
            <p className="font-jakarta text-nemo-dark-bg/70 dark:text-nemo-dark-muted leading-relaxed">
              {service.pitch}
            </p>
            <p className="font-jakarta text-nemo-dark-bg/70 dark:text-nemo-dark-muted leading-relaxed mt-4">
              Basée à Belin-Béliet, Nemo Solutions intervient à {city.name} et dans toute la Gironde.
              Nous connaissons le tissu économique local et adaptons nos solutions aux réalités des entreprises
              de votre secteur.
            </p>
          </motion.section>

          {/* Ce que nous faisons */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
            aria-labelledby="prestations-title"
          >
            <h2 id="prestations-title" className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-5">
              Nos prestations de {service.title.toLowerCase()} à {city.name}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="card-nemo p-4 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-nemo-orange shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-jakarta text-sm text-nemo-dark-bg/80 dark:text-nemo-dark-muted leading-snug">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Pourquoi Nemo */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="card-nemo p-8 mb-8 border-nemo-orange/20 bg-nemo-orange/5 dark:bg-nemo-dark-surface"
            aria-labelledby="pourquoi-title"
          >
            <h2 id="pourquoi-title" className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
              Pourquoi choisir Nemo Solutions à {city.name} ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Proximité', desc: `Agence locale basée dans le Val de l'Eyre, nous connaissons bien ${city.name} et ses environs.` },
                { label: 'Transparence', desc: 'Devis gratuit et détaillé, pas de mauvaises surprises. Vous savez exactement ce que vous payez.' },
                { label: 'Réactivité', desc: 'Un interlocuteur unique, disponible et réactif tout au long de votre projet.' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-syne font-bold text-nemo-orange mb-1">{item.label}</p>
                  <p className="font-jakarta text-sm text-nemo-dark-bg/70 dark:text-nemo-dark-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
            aria-labelledby="faq-title"
          >
            <h2 id="faq-title" className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-5">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {service.faq.map((item, i) => (
                <div key={i} className="card-nemo overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-bg">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-nemo-orange shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="font-jakarta text-sm text-nemo-dark-bg/70 dark:text-nemo-dark-muted leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-nemo-dark-bg dark:bg-nemo-dark-surface rounded-3xl p-10 text-center"
          >
            <h2 className="font-syne font-bold text-2xl text-nemo-bg mb-3">
              Un projet de {service.title.toLowerCase()} à {city.name} ?
            </h2>
            <p className="font-jakarta text-nemo-bg/60 mb-8 leading-relaxed">
              Devis gratuit et sans engagement. Réponse sous 24 h.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contactez-nous" className="btn-primary">
                Demander un devis gratuit
              </Link>
              <a
                href="tel:+33621145888"
                className="flex items-center gap-2 font-jakarta font-semibold text-nemo-bg/80 hover:text-nemo-orange transition-colors text-sm"
              >
                <Phone size={16} aria-hidden="true" />
                06 21 14 58 88
              </a>
              <a
                href="mailto:clement@nemosolutions.fr"
                className="flex items-center gap-2 font-jakarta font-semibold text-nemo-bg/80 hover:text-nemo-orange transition-colors text-sm"
              >
                <Mail size={16} aria-hidden="true" />
                clement@nemosolutions.fr
              </a>
            </div>
          </motion.div>

          {/* Liens vers autres villes */}
          <CityCrossLinks serviceSlug={service.slug} currentCitySlug={city.slug} serviceTitle={service.title} />
        </div>
      </main>
    </>
  );
}

function CityCrossLinks({ serviceSlug, currentCitySlug, serviceTitle }: { serviceSlug: string; currentCitySlug: string; serviceTitle: string }) {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/cities`)
      .then(r => r.json())
      .then(data => setCities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const others = cities.filter(c => c.slug !== currentCitySlug);
  if (others.length === 0) return null;

  return (
    <div className="mt-12">
      <p className="font-jakarta text-sm text-nemo-dark-bg/40 dark:text-nemo-dark-muted mb-3">Voir aussi :</p>
      <div className="flex flex-wrap gap-2">
        {others.map((c) => (
          <Link
            key={c.slug}
            to={`/pages-locales/${serviceSlug}/${c.slug}`}
            className="font-jakarta text-sm px-4 py-2 rounded-full border border-nemo-dark-bg/10 dark:border-nemo-dark-border text-nemo-dark-bg/60 dark:text-nemo-dark-muted hover:border-nemo-orange hover:text-nemo-orange transition-colors"
          >
            {serviceTitle} à {c.name}
          </Link>
        ))}
        <Link
          to="/pages-locales"
          className="font-jakarta text-sm px-4 py-2 rounded-full border border-nemo-dark-bg/10 dark:border-nemo-dark-border text-nemo-dark-bg/60 dark:text-nemo-dark-muted hover:border-nemo-orange hover:text-nemo-orange transition-colors"
        >
          ← Toutes les pages locales
        </Link>
      </div>
    </div>
  );
}
