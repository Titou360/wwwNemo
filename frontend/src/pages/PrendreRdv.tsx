import { Head, ClientOnly } from 'vite-react-ssg';
import { motion } from 'framer-motion';
import { Calendar, Phone, Video, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import Breadcrumb from '../components/ui/Breadcrumb';

// Embed Cal.com — 100% client (getCalApi/window/iframe). Rendu uniquement via
// <ClientOnly> pour ne pas casser le pré-rendu SSG.
function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#fd6904' },
          dark: { 'cal-brand': '#fcefdd' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <Cal
      namespace="30min"
      calLink="clemfelices/30min"
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'auto' }}
    />
  );
}

function CalLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-nemo-dark-bg/50 dark:text-nemo-bg/50">
      <Loader2 size={28} className="animate-spin text-nemo-orange mb-3" aria-hidden="true" />
      <p className="font-jakarta text-sm">Chargement du calendrier…</p>
    </div>
  );
}

export default function PrendreRdv() {
  return (
    <>
      <Head>
        <title>Prendre RDV — Nemo Solutions</title>
        <meta name="description" content="Réservez un créneau avec Clément FELICES de Nemo Solutions pour parler de votre projet digital. En visio, par téléphone ou en présentiel à Belin-Béliet." />
        <meta name="robots" content="index, follow" />
      </Head>

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

          {/* Cal.com embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="card-nemo overflow-hidden"
          >
            <div className="min-h-[700px] w-full">
              <ClientOnly fallback={<CalLoading />}>
                {() => <CalEmbed />}
              </ClientOnly>
            </div>
          </motion.div>

          {/* Repli contact direct */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+33621145888"
              className="btn-secondary"
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
        </div>
      </main>
    </>
  );
}
