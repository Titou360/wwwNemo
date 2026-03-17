import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  {
    category: 'Création de site',
    items: [
      {
        q: 'Combien coûte la création d\'un site internet ?',
        a: 'Le tarif dépend de la complexité du projet. Un site vitrine simple démarre à partir de 800€, un site e-commerce ou sur-mesure peut aller de 2000€ à 5000€ et plus. Nous proposons toujours un devis gratuit et personnalisé après étude de votre besoin.',
      },
      {
        q: 'Combien de temps pour créer mon site ?',
        a: 'Un site vitrine est généralement livré en 2 à 4 semaines. Un projet plus complexe peut prendre 4 à 8 semaines. Tout dépend de votre réactivité pour nous fournir les contenus et valider les étapes.',
      },
      {
        q: 'Mon site sera-t-il responsive (mobile) ?',
        a: 'Absolument. Tous nos sites sont conçus mobile-first et s\'adaptent parfaitement aux smartphones, tablettes, ordinateurs et grands écrans. C\'est une exigence non négociable.',
      },
      {
        q: 'Puis-je modifier mon site moi-même ensuite ?',
        a: 'Oui. Selon la solution choisie (WordPress, etc.), nous vous formons à l\'utilisation de votre interface d\'administration pour que vous puissiez mettre à jour vos contenus en toute autonomie.',
      },
    ],
  },
  {
    category: 'SEO & Référencement',
    items: [
      {
        q: 'Combien de temps avant d\'apparaître sur Google ?',
        a: 'Les premiers résultats SEO organiques se voient généralement au bout de 3 à 6 mois. Le SEO local (Google Business Profile) peut porter ses fruits plus rapidement, parfois en quelques semaines.',
      },
      {
        q: 'Proposez-vous du référencement payant (SEA) ?',
        a: 'Nous pouvons vous conseiller sur les campagnes Google Ads, mais notre cœur de métier est le SEO naturel. Nous travaillons avec des partenaires spécialisés SEA si besoin.',
      },
    ],
  },
  {
    category: 'Accompagnement & maintenance',
    items: [
      {
        q: 'Proposez-vous un service de maintenance ?',
        a: 'Oui. Nous proposons des forfaits maintenance mensuelle incluant : mises à jour CMS/plugins, sauvegardes, monitoring de sécurité et petites modifications. Sur devis selon vos besoins.',
      },
      {
        q: 'Intervenez-vous sur des sites existants ?',
        a: 'Tout à fait. Refonte, mise à jour, correction de bugs, amélioration des performances ou du SEO : nous intervenons sur tous types de sites web existants.',
      },
      {
        q: 'Êtes-vous disponible en cas d\'urgence ?',
        a: 'Nous sommes disponibles du lundi au vendredi de 9h à 19h. Pour les urgences critiques (site en panne), nous faisons notre maximum pour intervenir rapidement, y compris en dehors des horaires.',
      },
    ],
  },
  {
    category: 'Zone d\'intervention',
    items: [
      {
        q: 'Intervenez-vous uniquement en local ?',
        a: 'Non ! Bien que basés à Belin-Béliet dans le Val de l\'Eyre, nous travaillons avec des clients partout en Nouvelle-Aquitaine et en France entière. Tout se fait facilement à distance par visio, email et téléphone.',
      },
    ],
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;

  return (
    <div className="border-b border-nemo-dark-bg/10 dark:border-nemo-bg/10 last:border-0">
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-controls={`${id}-answer`}
        id={`${id}-question`}
        className="w-full flex items-center justify-between gap-4 py-5 text-left font-jakarta font-semibold text-base text-nemo-dark-bg dark:text-nemo-bg hover:text-nemo-orange dark:hover:text-nemo-orange transition-colors duration-200"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-nemo-orange"
          aria-hidden="true"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-answer`}
            role="region"
            aria-labelledby={`${id}-question`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-jakarta text-sm text-nemo-dark-bg/70 dark:text-nemo-bg/70 leading-relaxed pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  let globalIndex = 0;

  return (
    <>
      <Helmet>
        <title>FAQ — Questions fréquentes — Nemo Solutions</title>
        <meta name="description" content="Toutes les réponses à vos questions sur la création de sites internet, le SEO, la maintenance et les tarifs de Nemo Solutions." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-blue/10 text-nemo-blue text-sm font-jakarta font-semibold mb-4 border border-nemo-blue/20">
              FAQ
            </span>
            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
              Questions <span className="text-nemo-blue">fréquentes</span>
            </h1>
            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-lg">
              Vous ne trouvez pas la réponse ?{' '}
              <Link to="/contactez-nous" className="text-nemo-orange underline hover:no-underline transition-all">
                Contactez-nous directement.
              </Link>
            </p>
          </motion.div>

          {/* FAQ by category */}
          <div className="space-y-10">
            {FAQ_ITEMS.map(({ category, items }) => (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                aria-labelledby={`cat-${category}`}
              >
                <h2
                  id={`cat-${category}`}
                  className="font-syne font-bold text-lg text-nemo-orange mb-4 pb-2 border-b-2 border-nemo-orange/20"
                >
                  {category}
                </h2>
                <div className="card-nemo p-0 overflow-hidden">
                  <div className="px-6">
                    {items.map(item => (
                      <FAQItem key={item.q} q={item.q} a={item.a} index={globalIndex++} />
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14 card-nemo p-8"
          >
            <p className="font-syne font-bold text-xl text-nemo-dark-bg dark:text-nemo-bg mb-3">
              Votre question n'est pas ici ?
            </p>
            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 mb-6">
              On est là pour vous répondre sous 24h.
            </p>
            <Link to="/contactez-nous" className="btn-primary">
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
