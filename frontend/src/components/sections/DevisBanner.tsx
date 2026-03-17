import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const POINTS = [
  'Réponse sous 24h',
  'Sans engagement',
  'Étude personnalisée',
  'Tarifs transparents',
];

export default function DevisBanner() {
  return (
    <section
      aria-labelledby="devis-title"
      className="relative overflow-hidden py-20"
      style={{
        background: 'linear-gradient(135deg, #fd6904 0%, #e55a00 40%, #2596be 100%)',
      }}
    >
      {/* Decorative wave top */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full">
            <path d="M0 0C360 60 1080 60 1440 0V60H0V0Z" fill="white" className="dark:fill-nemo-dark-bg opacity-10" />
          </svg>
        </div>
        {/* Bubbles décoratives */}
        <div className="absolute top-8 right-16 w-32 h-32 rounded-full bg-white/5 border border-white/10" />
        <div className="absolute bottom-4 left-8 w-20 h-20 rounded-full bg-white/5 border border-white/10" />
        <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full bg-white/10" />
      </div>

      <div className="container-nemo relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left max-w-xl"
          >
            <p className="font-jakarta font-semibold text-white/80 uppercase tracking-widest text-sm mb-3">
              C'est gratuit &amp; sans engagement
            </p>
            <h2
              id="devis-title"
              className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4"
            >
              Votre projet mérite{' '}
              <span className="text-white/80">une étude sur-mesure</span>
            </h2>
            <p className="font-jakarta text-white/80 text-lg leading-relaxed">
              Décrivez-nous votre projet et recevez une proposition adaptée à vos besoins
              et à votre budget.
            </p>

            {/* Checkpoints */}
            <ul className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2" role="list">
              {POINTS.map(point => (
                <li key={point} className="flex items-center gap-2 text-white/90 font-jakarta text-sm font-medium">
                  <CheckCircle size={16} className="text-white flex-shrink-0" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/contactez-nous"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-nemo-orange font-jakarta font-bold text-base rounded-[25px] hover:bg-nemo-bg transition-all duration-300 shadow-xl shadow-black/20 group"
              aria-label="Demander un devis gratuit maintenant"
            >
              Demander un devis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/prendre-rdv"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-jakarta font-bold text-base rounded-[25px] border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300"
              aria-label="Prendre rendez-vous en ligne"
            >
              Prendre RDV
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
