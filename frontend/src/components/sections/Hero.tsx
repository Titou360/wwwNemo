import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

const MARQUEE_TERMS = [
  'Création digitale',
  'Sites internet',
  'Dépannage & Maintenance',
  'Conseil & stratégie',
  'Mise à jour & Optimisation',
  'Réseaux sociaux',
  'Référencement SEO',
  'Val de l\'Eyre',
  'Nouvelle-Aquitaine',
  'Wordpress & Woocommerce',
  'Solutions sur-mesure',
  'Accompagnement personnalisé',
  'Performance & sécurité',
  'Formation & conseils',
];

const marqueeContent = [...MARQUEE_TERMS, ...MARQUEE_TERMS];

export default function Hero() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: -10,
          duration: 3.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      aria-label="Section principale"
      className="relative min-h-screen flex flex-col bg-nemo-bg dark:bg-nemo-dark-bg overflow-hidden"
    >
      {/* Ligne déco verticale légère */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-nemo-dark-bg/5 dark:bg-nemo-bg/5 pointer-events-none hidden lg:block"
      />

      {/* Main content */}
      <div className="container-nemo flex-1 flex items-center pt-28 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Texte */}
          <div className="order-2 lg:order-1">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nemo-orange/10 border border-nemo-orange/25 text-nemo-orange text-sm font-jakarta font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-nemo-orange animate-pulse" aria-hidden="true" />
                Agence web — Val de l'Eyre & Nouvelle-Aquitaine
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="font-syne font-extrabold text-4xl sm:text-5xl xl:text-6xl leading-[1.1] text-nemo-dark-bg dark:text-nemo-dark-text mb-5"
            >
              Naviguez vers{' '}
              <span className="text-nemo-orange">la réussite</span>
              <br />
              avec Nemo Solutions
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="font-jakarta text-lg text-nemo-dark-bg/65 dark:text-nemo-dark-muted leading-relaxed mb-8 max-w-lg"
            >
              Création de sites internet, conseil digital et accompagnement personnalisé.
              Votre réussite en ligne est notre cap.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/contactez-nous"
                className="btn-primary group"
                aria-label="Demander un devis gratuit"
              >
                Devis gratuit
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                to="/prendre-rdv"
                className="btn-secondary"
                aria-label="Prendre rendez-vous"
              >
                Prendre RDV
              </Link>
            </motion.div>

            {/* Indicateurs de confiance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 mt-10 font-jakarta text-sm text-nemo-dark-bg/45 dark:text-nemo-dark-muted"
            >
              {['Entreprise individuelle', 'Basé à Belin-Béliet', 'Réponse sous 24h'].map(item => (
                <span key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-nemo-orange" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Visuel logo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              ref={logoRef}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.25 }}
              className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 lg:w-104 lg:h-104 rounded-full bg-nemo-dark-bg/5 dark:bg-nemo-bg/5"
            >
              <img
                src="/images/NemoSolutions.webp"
                alt="Nemo Solutions — Agence web Val de l'Eyre"
                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 object-contain drop-shadow-[0_4px_24px_rgba(253,105,4,0.20)]"
                onError={(e) => { e.currentTarget.src = '/images/NemoSolutions.png'; }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="flex justify-center pb-8"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="text-nemo-dark-bg/30 dark:text-nemo-dark-muted"
        >
          <ChevronDown size={26} />
        </motion.div>
      </motion.div>

      {/* Barre marquee */}
      <div
        className="bg-nemo-orange py-4 overflow-hidden"
        aria-label="Nos domaines d'expertise"
        role="region"
      >
        <div className="marquee-wrapper">
          <div className="marquee-inner">
            {marqueeContent.map((term, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-4 px-6 text-white font-jakarta font-semibold text-sm uppercase tracking-widest"
              >
                {term}
                <span aria-hidden="true" className="text-white/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
