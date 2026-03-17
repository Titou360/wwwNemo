import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Helmet>
        <title>Politique de confidentialité & RGPD — Nemo Solutions</title>
        <meta name="description" content="Politique de confidentialité et gestion des données personnelles de Nemo Solutions, conformément au RGPD." />
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
              Politique de confidentialité
            </h1>
            <p className="font-jakarta text-sm text-nemo-dark-bg/50 dark:text-nemo-bg/50 mb-10">
              Conforme au RGPD — Dernière mise à jour : mars 2026
            </p>

            <div className="prose prose-sm max-w-none font-jakarta text-nemo-dark-bg/80 dark:text-nemo-bg/80 space-y-8
              [&_h2]:font-syne [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-nemo-dark-bg [&_h2]:dark:text-nemo-bg [&_h2]:mb-3
              [&_p]:leading-relaxed [&_p]:mb-3 [&_li]:mb-1.5 [&_ul]:pl-4 [&_ul]:list-disc
              [&_a]:text-nemo-orange [&_a]:underline">

              <section aria-labelledby="intro">
                <h2 id="intro">1. Responsable du traitement</h2>
                <p>
                  Clément FELICES — Nemo Solutions<br />
                  29 Avenue des Pins, 33830 Belin-Béliet<br />
                  <a href="mailto:clement@nemosolutions.fr">clement@nemosolutions.fr</a> — 06 21 14 58 88
                </p>
              </section>

              <section aria-labelledby="donnees">
                <h2 id="donnees">2. Données collectées</h2>
                <p>Nous collectons les données suivantes :</p>
                <ul>
                  <li><strong>Formulaire de contact</strong> : nom, email, téléphone, message</li>
                  <li><strong>Cookies techniques</strong> : préférences de navigation (thème), cookies analytiques anonymisés</li>
                  <li><strong>Données de navigation</strong> : adresse IP anonymisée, pages visitées (analytics)</li>
                </ul>
              </section>

              <section aria-labelledby="finalites">
                <h2 id="finalites">3. Finalités du traitement</h2>
                <ul>
                  <li>Répondre à vos demandes de contact ou de devis</li>
                  <li>Améliorer notre site et nos services (analytics)</li>
                  <li>Mémoriser vos préférences de navigation</li>
                </ul>
                <p>Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
              </section>

              <section aria-labelledby="base">
                <h2 id="base">4. Base légale</h2>
                <p>
                  Le traitement de vos données repose sur votre <strong>consentement</strong> (cookies non essentiels)
                  et notre <strong>intérêt légitime</strong> (réponse aux demandes de contact).
                </p>
              </section>

              <section aria-labelledby="conservation">
                <h2 id="conservation">5. Durée de conservation</h2>
                <ul>
                  <li>Données de contact : 3 ans à compter du dernier contact</li>
                  <li>Cookies analytiques : 13 mois maximum</li>
                  <li>Préférences de thème : durée indéterminée (stockage local)</li>
                </ul>
              </section>

              <section id="cookies" aria-labelledby="cookies-title">
                <h2 id="cookies-title">6. Cookies</h2>
                <p>Ce site utilise :</p>
                <ul>
                  <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement (préférences thème, sécurité)</li>
                  <li><strong>Cookies analytiques</strong> : mesure d'audience anonymisée (avec votre consentement)</li>
                </ul>
                <p>
                  Vous pouvez gérer vos préférences à tout moment en cliquant sur le bouton ci-dessous
                  ou depuis les paramètres de votre navigateur.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    import('vanilla-cookieconsent').then(cc => cc.showPreferences());
                  }}
                  className="btn-secondary mt-3 text-sm px-5 py-2"
                >
                  Gérer mes préférences de cookies
                </button>
              </section>

              <section aria-labelledby="droits">
                <h2 id="droits">7. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul>
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement ("droit à l'oubli")</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité</li>
                  <li>Droit d'opposition</li>
                </ul>
                <p>
                  Pour exercer ces droits :{' '}
                  <a href="mailto:clement@nemosolutions.fr">clement@nemosolutions.fr</a>
                </p>
                <p>
                  En cas de litige, vous pouvez saisir la{' '}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
