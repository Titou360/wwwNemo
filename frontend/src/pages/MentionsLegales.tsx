import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function MentionsLegales() {
  return (
    <>
      <Helmet>
        <title>Mentions légales — Nemo Solutions</title>
        <meta name="description" content="Mentions légales de Nemo Solutions, entreprise individuelle de Clément FELICES, agence web basée à Belin-Béliet, Gironde." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-nemo-dark-bg dark:text-nemo-bg mb-2">
              Mentions légales
            </h1>
            <p className="font-jakarta text-sm text-nemo-dark-bg/50 dark:text-nemo-bg/50 mb-10">
              Dernière mise à jour : mars 2026
            </p>

            <div className="prose prose-sm max-w-none font-jakarta text-nemo-dark-bg/80 dark:text-nemo-bg/80 space-y-8
              [&_h2]:font-syne [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-nemo-dark-bg [&_h2]:dark:text-nemo-bg [&_h2]:mb-3
              [&_h3]:font-syne [&_h3]:font-semibold [&_h3]:text-base [&_h3]:text-nemo-orange [&_h3]:mb-2
              [&_p]:leading-relaxed [&_p]:mb-3
              [&_a]:text-nemo-orange [&_a]:underline">

              <section aria-labelledby="editeur">
                <h2 id="editeur">1. Éditeur du site</h2>
                <p>
                  Le présent site <strong>nemosolutions.fr</strong> est édité par :
                </p>
                <address className="not-italic bg-white/50 dark:bg-nemo-dark-surface/50 rounded-xl p-4 border border-nemo-dark-bg/10 dark:border-nemo-bg/10">
                  <strong>Nemo Solutions</strong><br />
                  Entreprise Individuelle — Clément FELICES<br />
                  29 Avenue des Pins<br />
                  33830 Belin-Béliet, France<br />
                  <a href="tel:+33621145888">06 21 14 58 88</a><br />
                  <a href="mailto:clement@nemosolutions.fr">clement@nemosolutions.fr</a><br />
                  SIRET : [À compléter]<br />
                  Numéro de TVA intracommunautaire : [À compléter si assujetti]
                </address>
              </section>

              <section aria-labelledby="hebergeur">
                <h2 id="hebergeur">2. Hébergement</h2>
                <p>
                  Ce site est hébergé par :<br />
                  <strong>Hostinger International Ltd</strong><br />
                  61 Lordou Vironos, 6023 Larnaca, Chypre<br />
                  <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer">www.hostinger.fr</a>
                </p>
              </section>

              <section aria-labelledby="propriete">
                <h2 id="propriete">3. Propriété intellectuelle</h2>
                <p>
                  L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes, vidéos)
                  sont protégés par le droit d'auteur et appartiennent à Clément FELICES / Nemo Solutions,
                  sauf mentions contraires.
                </p>
                <p>
                  Toute reproduction, distribution, modification ou utilisation sans autorisation préalable
                  et écrite est interdite.
                </p>
              </section>

              <section aria-labelledby="responsabilite">
                <h2 id="responsabilite">4. Limitation de responsabilité</h2>
                <p>
                  Nemo Solutions s'efforce de maintenir les informations de ce site à jour et exactes.
                  Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des
                  informations diffusées.
                </p>
              </section>

              <section aria-labelledby="liens">
                <h2 id="liens">5. Liens hypertextes</h2>
                <p>
                  Ce site peut contenir des liens vers des sites tiers. Nemo Solutions n'est pas responsable
                  du contenu de ces sites et de leur politique de confidentialité.
                </p>
              </section>

              <section aria-labelledby="droit">
                <h2 id="droit">6. Droit applicable</h2>
                <p>
                  Le présent site et ses mentions légales sont régis par le droit français.
                  En cas de litige, les tribunaux français sont compétents.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
