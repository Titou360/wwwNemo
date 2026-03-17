import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Globe, Phone, Mail, MapPin, Heart } from 'lucide-react';

const LOCAL_PAGES = [
  { label: 'Agence web Bordeaux', href: '/pages-locales/bordeaux' },
  { label: 'Agence web Arcachon', href: '/pages-locales/arcachon' },
  { label: 'Agence web Belin-Béliet', href: '/pages-locales/belin-beliet' },
  { label: 'Agence web La Teste-de-Buch', href: '/pages-locales/la-teste-de-buch' },
  { label: 'Agence web Facture', href: '/pages-locales/facture' },
  { label: 'Agence web Mios', href: '/pages-locales/mios' },
  { label: 'Agence web Salles', href: '/pages-locales/salles' },
  { label: 'Agence web Landes', href: '/pages-locales/landes' },
];

const SERVICES_LINKS = [
  { label: 'Création de site internet', href: '/#services' },
  { label: 'Référencement SEO', href: '/#services' },
  { label: 'Réseaux sociaux', href: '/#services' },
  { label: 'Conseil digital', href: '/#services' },
  { label: 'Dépannage informatique', href: '/#services' },
  { label: 'Intelligence artificielle', href: '/#services' },
];

const USEFUL_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Blog', href: '/#blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Prendre RDV', href: '/prendre-rdv' },
  { label: 'Nous contacter', href: '/contactez-nous' },
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
  { label: 'Gestion des cookies', href: '/politique-de-confidentialite#cookies' },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/nemosolutions', label: 'Suivez-nous sur Facebook' },
  { icon: Instagram, href: 'https://instagram.com/nemosolutions', label: 'Suivez-nous sur Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/nemosolutions', label: 'Suivez-nous sur LinkedIn' },
  { icon: Globe, href: 'https://google.com/search?q=nemosolutions', label: 'Nemo Solutions sur Google' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-nemo-dark-bg text-nemo-bg/80">
      {/* Main footer */}
      <div className="py-20 lg:py-28">
      <div className="container-nemo">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="Nemo Solutions - Retour accueil" className="inline-block mb-5">
              <img
                src="/images/NemoSolutions.webp"
                alt="Nemo Solutions"
                className="h-30 w-auto"
                onError={e => { e.currentTarget.src = '/images/NemoSolutions.png'; }}
              />
            </Link>
            <p className="font-jakarta text-sm leading-relaxed text-nemo-bg/60 mb-6">
              Votre partenaire digital en Val de l'Eyre et Nouvelle-Aquitaine.
              Création de sites internet, SEO, réseaux sociaux et conseil.
            </p>
            <p className="font-jakarta text-xs text-nemo-orange/80 font-semibold italic mb-5">
              "Naviguez vers la réussite avec Nemo Solutions"
            </p>

            {/* Social */}
            <div className="flex items-center gap-3" aria-label="Nos réseaux sociaux">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-nemo-bg/50 hover:text-nemo-orange hover:border-nemo-orange transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-syne font-bold text-white text-sm uppercase tracking-widest mb-5">
              Nos services
            </h3>
            <ul className="space-y-2.5" role="list">
              {SERVICES_LINKS.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-jakarta text-sm text-nemo-bg/60 hover:text-nemo-orange transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-nemo-orange/40 group-hover:bg-nemo-orange transition-colors" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages locales */}
          <div>
            <h3 className="font-syne font-bold text-white text-sm uppercase tracking-widest mb-5">
              Pages locales
            </h3>
            <ul className="space-y-2.5" role="list">
              {LOCAL_PAGES.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-jakarta text-sm text-nemo-bg/60 hover:text-nemo-orange transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-nemo-blue/40 group-hover:bg-nemo-orange transition-colors" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + useful links */}
          <div>
            <h3 className="font-syne font-bold text-white text-sm uppercase tracking-widest mb-5">
              Contact
            </h3>
            <address className="not-italic space-y-3 mb-6">
              <a
                href="tel:+33621145888"
                className="flex items-start gap-3 text-nemo-bg/60 hover:text-nemo-orange transition-colors font-jakarta text-sm group"
                aria-label="Appeler le 06 21 14 58 88"
              >
                <Phone size={14} className="mt-0.5 text-nemo-orange shrink-0" aria-hidden="true" />
                06 21 14 58 88
              </a>
              <a
                href="mailto:clement@nemosolutions.fr"
                className="flex items-start gap-3 text-nemo-bg/60 hover:text-nemo-orange transition-colors font-jakarta text-sm"
              >
                <Mail size={14} className="mt-0.5 text-nemo-orange shrink-0" aria-hidden="true" />
                clement@nemosolutions.fr
              </a>
              <p className="flex items-start gap-3 text-nemo-bg/60 font-jakarta text-sm">
                <MapPin size={14} className="mt-0.5 text-nemo-blue shrink-0" aria-hidden="true" />
                <span>29 Av. des Pins<br />33830 Belin-Béliet, France</span>
              </p>
            </address>

            <nav aria-label="Liens utiles">
              <h4 className="font-syne font-bold text-white/50 text-xs uppercase tracking-wider mb-3">
                Liens utiles
              </h4>
              <ul className="space-y-2" role="list">
                {USEFUL_LINKS.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-jakarta text-sm text-nemo-bg/50 hover:text-nemo-orange transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="py-7">
          <div className="container-nemo">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-jakarta text-nemo-bg/40">
              <p>
                © {currentYear} Nemo Solutions — Entreprise Individuelle Clément FELICES.
                Tous droits réservés.
              </p>
              <p className="flex items-center gap-1">
                Fait avec <Heart size={12} className="text-nemo-orange fill-nemo-orange" aria-label="amour" /> en Val de l'Eyre
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
