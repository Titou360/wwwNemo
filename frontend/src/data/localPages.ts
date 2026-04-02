export interface ServiceLocal {
  slug: string;
  title: string;
  tagline: string;
  color: 'nemo-orange' | 'nemo-blue';
  pitch: string; // intro de la page détail
  bullets: string[]; // prestations listées
  faq: { q: string; a: string }[];
}

export interface City {
  _id?: string;
  slug: string;
  name: string;
  dept: string;
  context: string;
  order?: number;
}

export const SERVICES_LOCAL: ServiceLocal[] = [
  {
    slug: 'creation-de-sites-internet',
    title: 'Création de sites internet',
    tagline: 'Sites vitrines, e-commerce et portfolios sur-mesure',
    color: 'nemo-orange',
    pitch:
      'Vous avez un projet de site web ? Nemo Solutions conçoit des sites modernes, rapides et optimisés SEO pour les artisans, commerçants et TPE/PME de votre secteur. Chaque site est pensé pour convertir les visiteurs en clients.',
    bullets: [
      'Site vitrine responsive (mobile, tablette, ordinateur)',
      'Boutique en ligne (e-commerce)',
      'Portfolio et site professionnel',
      'Optimisation SEO intégrée dès la conception',
      'Hébergement et nom de domaine conseillés',
      'Formation à la gestion de votre site',
    ],
    faq: [
      { q: 'Quel est le délai de réalisation ?', a: 'Un site vitrine est livré en 2 à 4 semaines. Un projet e-commerce ou sur-mesure peut prendre de 4 à 8 semaines selon la complexité.' },
      { q: 'Puis-je mettre à jour mon site seul ?', a: 'Oui. Nous vous formons à l\'utilisation de votre interface d\'administration pour une autonomie complète.' },
      { q: 'Mon site sera-t-il visible sur mobile ?', a: 'Tous nos sites sont conçus mobile-first et s\'adaptent parfaitement à tous les écrans.' },
    ],
  },
  {
    slug: 'referencement-seo',
    title: 'Référencement SEO',
    tagline: 'Apparaissez en première page Google',
    color: 'nemo-blue',
    pitch:
      'Le SEO local est l\'outil le plus puissant pour attirer des clients près de chez vous sans payer de publicité. Nemo Solutions audite, optimise et fait progresser votre site dans les résultats Google pour les recherches de votre zone géographique.',
    bullets: [
      'Audit SEO complet de votre site',
      'Optimisation technique (vitesse, balises, structure)',
      'Création de contenu optimisé pour Google',
      'SEO local et Google Business Profile',
      'Suivi mensuel des positions',
      'Netlinking et autorité de domaine',
    ],
    faq: [
      { q: 'Combien de temps avant de voir des résultats ?', a: 'Les premiers effets apparaissent généralement au bout de 3 à 6 mois. Le SEO local peut porter ses fruits plus rapidement.' },
      { q: 'Intervenez-vous sur mon site existant ?', a: 'Oui, nous pouvons optimiser n\'importe quel site existant, qu\'il soit sous WordPress, Wix, Prestashop ou développé sur-mesure.' },
      { q: 'Qu\'est-ce que le SEO local ?', a: 'Le SEO local cible les recherches géolocalisées (ex. "créateur de site Belin-Béliet") pour attirer des clients de votre secteur directement sur votre site.' },
    ],
  },
  {
    slug: 'reseaux-sociaux',
    title: 'Réseaux sociaux',
    tagline: 'Stratégie, contenu et gestion de vos pages',
    color: 'nemo-orange',
    pitch:
      'Facebook, Instagram, LinkedIn : les réseaux sociaux sont devenus incontournables pour fidéliser votre audience et gagner en visibilité locale. Nemo Solutions prend en charge la création et la gestion de vos pages pour que vous puissiez vous concentrer sur votre métier.',
    bullets: [
      'Création et optimisation de vos profils',
      'Stratégie éditoriale adaptée à votre secteur',
      'Création de visuels et rédaction des publications',
      'Programmation et gestion des posts',
      'Animation de communauté et réponse aux commentaires',
      'Reporting mensuel des performances',
    ],
    faq: [
      { q: 'Sur quels réseaux intervenez-vous ?', a: 'Facebook, Instagram et LinkedIn principalement. Nous pouvons également intervenir sur TikTok ou Google Business Profile selon votre cible.' },
      { q: 'Dois-je fournir les photos ?', a: 'Nous pouvons travailler avec vos photos existantes ou créer des visuels professionnels. Un shooting est aussi possible sur devis.' },
      { q: 'Puis-je garder la main sur mes réseaux ?', a: 'Bien sûr. Nous pouvons gérer vos réseaux en totalité ou vous accompagner en formation pour que vous les animitez vous-même.' },
    ],
  },
  {
    slug: 'intelligence-artificielle',
    title: 'Intelligence artificielle',
    tagline: 'Automatisez et gagnez en efficacité avec l\'IA',
    color: 'nemo-blue',
    pitch:
      'L\'IA n\'est plus réservée aux grandes entreprises. Nemo Solutions vous aide à intégrer des outils d\'intelligence artificielle adaptés à votre activité : génération de contenu, chatbots, automatisation de tâches répétitives, analyse de données.',
    bullets: [
      'Intégration de chatbots IA sur votre site',
      'Génération de contenu assistée par IA',
      'Automatisation de processus métier',
      'Formation et accompagnement aux outils IA',
      'Veille et conseil sur les nouvelles solutions',
      'Audit de vos besoins en automatisation',
    ],
    faq: [
      { q: 'L\'IA est-elle adaptée à ma petite entreprise ?', a: 'Absolument. Des outils simples et abordables existent pour tous les secteurs : rédaction, service client, planification, comptabilité.' },
      { q: 'Faut-il des compétences techniques pour utiliser ces outils ?', a: 'Non. Nous sélectionnons des outils accessibles et vous formons à leur utilisation.' },
      { q: 'Quels gains peut-on espérer ?', a: 'Gain de temps significatif sur les tâches répétitives, meilleure réactivité client et réduction des coûts opérationnels.' },
    ],
  },
  {
    slug: 'depannage-maintenance',
    title: 'Dépannage & maintenance',
    tagline: 'Intervention rapide sur votre site web',
    color: 'nemo-orange',
    pitch:
      'Votre site est en panne, lent ou a été piraté ? Nemo Solutions intervient rapidement pour diagnostiquer et résoudre tous les problèmes techniques. Nous proposons aussi des forfaits de maintenance préventive pour éviter les mauvaises surprises.',
    bullets: [
      'Diagnostic et résolution de bugs',
      'Nettoyage et sécurisation après piratage',
      'Mises à jour CMS, thèmes et extensions',
      'Sauvegardes régulières de votre site',
      'Monitoring de disponibilité et de sécurité',
      'Optimisation des performances',
    ],
    faq: [
      { q: 'Intervenez-vous en urgence ?', a: 'Oui. Pour les pannes critiques, nous faisons notre maximum pour intervenir dans la journée, y compris le week-end pour les situations graves.' },
      { q: 'Sur quels CMS intervenez-vous ?', a: 'WordPress, Prestashop, Joomla, Wix, Squarespace et les sites développés sur-mesure.' },
      { q: 'Proposez-vous un contrat de maintenance ?', a: 'Oui. Nos forfaits mensuels incluent les mises à jour, sauvegardes, monitoring et petites retouches de contenu.' },
    ],
  },
  {
    slug: 'refonte-mise-a-jour',
    title: 'Refonte & mise à jour',
    tagline: 'Modernisez votre site sans tout recommencer',
    color: 'nemo-blue',
    pitch:
      'Votre site a vieilli, est lent ou ne reflète plus votre image ? La refonte est souvent la meilleure solution pour repartir sur des bases solides. Nemo Solutions analyse votre existant, conserve ce qui fonctionne et modernise le reste.',
    bullets: [
      'Audit complet de votre site actuel',
      'Nouvelle charte graphique et design modernisé',
      'Migration de contenu existant',
      'Amélioration des performances et de la vitesse',
      'Optimisation SEO post-refonte',
      'Accompagnement et formation post-livraison',
    ],
    faq: [
      { q: 'Vais-je perdre mon référencement lors de la refonte ?', a: 'Non, si elle est bien gérée. Nous préservons vos URLs, mettons en place les redirections nécessaires et optimisons le SEO tout au long du projet.' },
      { q: 'Combien coûte une refonte ?', a: 'Cela dépend de la taille de votre site et des évolutions souhaitées. Nous établissons un devis gratuit après analyse de votre site.' },
      { q: 'Mon site actuel reste-t-il en ligne pendant la refonte ?', a: 'Oui. Nous travaillons sur un environnement de développement séparé. La bascule vers le nouveau site se fait en quelques minutes, sans interruption visible.' },
    ],
  },
  {
    slug: 'conseil-strategie-digitale',
    title: 'Conseil & stratégie digitale',
    tagline: 'Un accompagnement sur-mesure pour votre développement digital',
    color: 'nemo-orange',
    pitch:
      'Vous ne savez pas par où commencer votre présence digitale, ou vous souhaitez structurer votre stratégie numérique ? Nemo Solutions vous accompagne de l\'audit initial à la mise en oeuvre, avec des conseils adaptés à votre budget et à votre secteur.',
    bullets: [
      'Audit de votre présence digitale actuelle',
      'Définition de votre stratégie numérique',
      'Conseil en choix d\'outils et de plateformes',
      'Accompagnement à la transformation digitale',
      'Formation de vos équipes',
      'Suivi et ajustement de la stratégie',
    ],
    faq: [
      { q: 'À qui s\'adresse ce service ?', a: 'À toute entreprise souhaitant structurer sa présence en ligne : artisans qui démarrent, commerçants qui veulent se développer, TPE/PME en transformation digitale.' },
      { q: 'Sous quelle forme se déroule l\'accompagnement ?', a: 'Rendez-vous en présentiel ou en visio, remise d\'un plan d\'action écrit, puis suivi régulier selon vos besoins.' },
      { q: 'Dois-je déjà avoir un site internet ?', a: 'Non. Nous intervenons aussi bien pour des créations from scratch que pour optimiser l\'existant.' },
    ],
  },
];

