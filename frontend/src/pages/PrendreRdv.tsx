import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, Video } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';

export default function PrendreRdv() {
  return (
    <>
      <Helmet>
        <title>Prendre RDV — Nemo Solutions</title>
        <meta name="description" content="Réservez un créneau avec Clément FELICES de Nemo Solutions pour parler de votre projet digital. En visio, par téléphone ou en présentiel à Belin-Béliet." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo max-w-4xl">
          <Breadcrumb crumbs={[{ label: 'Prendre RDV' }]} />
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-4 border border-nemo-orange/20">
              Rendez-vous en ligne
            </span>
            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
              Réservez votre <span className="text-nemo-orange">consultation</span>
            </h1>
            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-lg max-w-xl mx-auto">
              Choisissez un créneau qui vous convient pour échanger sur votre projet digital.
              Premier échange gratuit et sans engagement.
            </p>
          </motion.div>

          {/* Format options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Video, label: 'Visioconférence', desc: 'Google Meet ou Zoom' },
              { icon: Phone, label: 'Téléphone', desc: '06 21 14 58 88' },
              { icon: Calendar, label: 'Présentiel', desc: 'Belin-Béliet (sur RDV)' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card-nemo p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-nemo-orange/10 text-nemo-orange flex items-center justify-center shrink-0" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-syne font-bold text-sm text-nemo-dark-bg dark:text-nemo-bg">{label}</p>
                  <p className="font-jakarta text-xs text-nemo-dark-bg/60 dark:text-nemo-bg/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar embed placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="card-nemo overflow-hidden"
          >
            {/* TODO: Replace with your actual Calendly / Cal.com / iCal widget URL */}
            {/* Example: <iframe src="https://calendly.com/votre-lien" ... /> */}
            <div className="bg-linear-to-br from-nemo-orange/5 to-nemo-blue/5 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-nemo-orange/10 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Calendar size={28} className="text-nemo-orange" />
              </div>
              <h2 className="font-syne font-bold text-xl text-nemo-dark-bg dark:text-nemo-bg mb-3">
                Planning de réservation
              </h2>
              <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-sm mb-6 max-w-md mx-auto">
                Intégrez ici votre lien Calendly, Cal.com ou votre calendrier iCal pour que vos visiteurs puissent
                choisir directement un créneau disponible.
              </p>

              {/* Temporary direct contact option */}
              <div className="inline-flex flex-wrap gap-4 justify-center">
                <a
                  href="tel:+33621145888"
                  className="btn-primary"
                  aria-label="Appeler directement le 06 21 14 58 88"
                >
                  <Phone size={16} aria-hidden="true" />
                  Appeler directement
                </a>
                <a
                  href="mailto:clement@nemosolutions.fr?subject=Demande de rendez-vous"
                  className="btn-secondary"
                  aria-label="Envoyer un email pour prendre rendez-vous"
                >
                  Prendre RDV par email
                </a>
              </div>

              {/* Instructions for integration */}
              <div className="mt-8 p-4 rounded-xl bg-nemo-blue/5 border border-nemo-blue/10 text-left max-w-lg mx-auto">
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-nemo-blue mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="font-jakarta text-xs text-nemo-dark-bg/60 dark:text-nemo-bg/60">
                    <strong className="text-nemo-blue">Pour intégrer votre planning :</strong>{' '}
                    Remplacez ce bloc par votre iframe Calendly :{' '}
                    <code className="bg-nemo-dark-bg/5 dark:bg-nemo-bg/5 px-1 rounded text-xs">
                      {'<iframe src="https://calendly.com/votre-lien" />'}
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
