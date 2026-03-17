import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

export default function CookieConsentInit() {
  useEffect(() => {
    CookieConsent.run({
      // Révision : si tu changes les catégories, incrémente ce numéro
      revision: 1,

      // UI
      guiOptions: {
        consentModal: {
          layout: 'bar',
          position: 'bottom',
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: false,
          flipButtons: false,
        },
      },

      // Catégories
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [
              { name: /^_ga/ },
              { name: '_gid' },
            ],
          },
        },
      },

      // Traductions FR
      language: {
        default: 'fr',
        autoDetect: 'browser',
        translations: {
          fr: {
            consentModal: {
              title: '🍪 Nemo Solutions utilise des cookies',
              description:
                'Nous utilisons des cookies essentiels au fonctionnement du site et des cookies analytiques anonymisés (avec votre accord) pour améliorer votre expérience. <a href="/politique-de-confidentialite#cookies" class="cc__link">En savoir plus</a>.',
              acceptAllBtn: 'Tout accepter',
              acceptNecessaryBtn: 'Refuser',
              showPreferencesBtn: 'Personnaliser',
              footer:
                '<a href="/mentions-legales">Mentions légales</a> • <a href="/politique-de-confidentialite">Confidentialité</a>',
            },
            preferencesModal: {
              title: 'Préférences de cookies',
              acceptAllBtn: 'Tout accepter',
              acceptNecessaryBtn: 'Tout refuser',
              savePreferencesBtn: 'Sauvegarder mes préférences',
              closeIconLabel: 'Fermer',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Vos choix en matière de confidentialité',
                  description:
                    'Vous pouvez choisir les catégories de cookies que vous autorisez. Vos préférences sont sauvegardées et peuvent être modifiées à tout moment.',
                },
                {
                  title: 'Cookies essentiels <span class="pm__badge">Toujours actifs</span>',
                  description:
                    'Ces cookies sont indispensables au fonctionnement du site : préférences de thème (clair/sombre), sécurité de session. Ils ne peuvent pas être désactivés.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Cookies analytiques',
                  description:
                    'Ces cookies nous permettent de mesurer l\'audience de façon anonymisée (pages vues, temps de visite) afin d\'améliorer votre expérience. Aucune donnée personnelle n\'est transmise à des tiers.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    caption: 'Cookies analytiques',
                    headers: {
                      name: 'Cookie',
                      domain: 'Domaine',
                      desc: 'Description',
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: location.hostname,
                        desc: 'Google Analytics — identifiant de session anonymisé (2 ans)',
                      },
                      {
                        name: '_gid',
                        domain: location.hostname,
                        desc: 'Google Analytics — session du jour (24h)',
                      },
                    ],
                  },
                },
                {
                  title: 'Davantage d\'informations',
                  description:
                    'Pour toute question sur notre politique de cookies, <a class="cc__link" href="/contactez-nous">contactez-nous</a>.',
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}
