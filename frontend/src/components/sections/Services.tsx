import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe, Wrench, Share2, Brain, TrendingUp, RefreshCw, MessageSquare, Palette,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: Globe,
    title: 'Création de sites internet',
    description: 'Sites vitrines, e-commerce, portfolios. Design premium, responsive et optimisé SEO pour une présence digitale forte.',
    color: 'nemo-orange',
  },
  {
    icon: TrendingUp,
    title: 'Référencement SEO',
    description: 'Optimisation technique, contenu et netlinking pour hisser votre site dans les premières positions Google.',
    color: 'nemo-blue',
  },
  {
    icon: Share2,
    title: 'Réseaux sociaux',
    description: 'Stratégie, création de contenu et gestion de vos pages Facebook, Instagram et LinkedIn.',
    color: 'nemo-orange',
  },
  {
    icon: Brain,
    title: 'Intelligence artificielle',
    description: 'Intégration d\'outils IA pour automatiser, créer du contenu et gagner en efficacité.',
    color: 'nemo-blue',
  },
  {
    icon: Wrench,
    title: 'Dépannage & maintenance',
    description: 'Intervention rapide, mises à jour, sauvegardes et sécurisation de votre présence en ligne.',
    color: 'nemo-orange',
  },
  {
    icon: RefreshCw,
    title: 'Refonte & mise à jour',
    description: 'Modernisation de sites existants, amélioration des performances et de l\'expérience utilisateur.',
    color: 'nemo-blue',
  },
  {
    icon: MessageSquare,
    title: 'Conseil & stratégie digitale',
    description: 'Accompagnement personnalisé pour définir et déployer votre stratégie numérique.',
    color: 'nemo-orange',
  },
  {
    icon: Palette,
    title: 'Identité visuelle',
    description: 'Logo, charte graphique et supports de communication alignés avec votre image de marque.',
    color: 'nemo-blue',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 80%', once: true },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="services-title"
      className="section-py bg-white/60 dark:bg-nemo-dark-surface relative"
    >
      <div className="container-nemo">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-4 border border-nemo-orange/25">
            Ce que nous faisons
          </span>
          <h2
            id="services-title"
            className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-nemo-dark-bg dark:text-nemo-dark-text mb-4"
          >
            Nos <span className="text-nemo-orange">services</span>
          </h2>
          <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-dark-muted text-lg max-w-2xl mx-auto leading-relaxed">
            De la création à la maintenance, nous accompagnons les entreprises du Val de l'Eyre
            et de toute la Nouvelle-Aquitaine dans leur développement digital.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="card-nemo p-6 cursor-default group"
              aria-label={service.title}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  service.color === 'nemo-orange'
                    ? 'bg-nemo-orange/10 text-nemo-orange group-hover:bg-nemo-orange group-hover:text-white'
                    : 'bg-nemo-blue/10 text-nemo-blue group-hover:bg-nemo-blue group-hover:text-white'
                } transition-all duration-300`}
                aria-hidden="true"
              >
                <service.icon size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-syne font-bold text-base text-nemo-dark-bg dark:text-nemo-dark-text mb-2 leading-snug">
                {service.title}
              </h3>
              <p className="font-jakarta text-sm text-nemo-dark-bg/60 dark:text-nemo-dark-muted leading-relaxed">
                {service.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
