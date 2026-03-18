import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Sun, Moon, Menu, X, Facebook, Instagram, Linkedin, Globe, Mail, Phone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos services', href: '/#services' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Références', href: '/#references' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Prendre RDV', href: '/prendre-rdv' },
  { label: 'Contact', href: '/contactez-nous' },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/nemosolutions', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/nemosolutions', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/nemosolutions', label: 'LinkedIn' },
  { icon: Globe, href: 'https://google.com/maps', label: 'Google' },
];

const BEZIER: [number, number, number, number] = [0.76, 0, 0.24, 1];

const menuVariants: Variants = {
  closed: { opacity: 0, x: '100%' },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: 'tween' as const, duration: 0.4, ease: BEZIER },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { type: 'tween' as const, duration: 0.35, ease: BEZIER },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 60 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  }),
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-nemo-bg/95 dark:bg-nemo-dark-bg/95 backdrop-blur-md shadow-sm shadow-nemo-orange/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container-nemo">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" aria-label="Nemo Solutions - Retour à l'accueil" className="shrink-0">
              <img
                src="/images/NemoSolutions.png"
                alt="Nemo Solutions"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'font-syne font-bold text-2xl text-nemo-orange';
                  fallback.textContent = 'Nemo Solutions';
                  t.parentElement?.appendChild(fallback);
                }}
              />
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Dark/Light toggle */}
              <button
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
                title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-nemo-blue/30 dark:border-nemo-blue/50 text-nemo-blue hover:border-nemo-blue hover:bg-nemo-blue/10 transition-all duration-300"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuOpen}
                aria-controls="main-nav"
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-nemo-orange/30 text-nemo-orange hover:border-nemo-orange hover:bg-nemo-orange/10 transition-all duration-300"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-page menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="main-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 z-40 bg-nemo-dark-bg flex flex-col overflow-y-auto"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-nemo-orange/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-nemo-blue/5 rounded-full blur-3xl" />
            </div>

            <div className="relative flex flex-col h-full min-h-screen p-6 md:p-16">
              {/* Top spacer */}
              <div className="h-16" />

              {/* Navigation links */}
              <nav className="flex-1 flex flex-col justify-center" aria-label="Navigation principale">
                <ul className="list-none p-0 m-0 space-y-0">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center gap-3 text-2xl sm:text-4xl md:text-6xl font-syne font-bold text-white/80 hover:text-nemo-orange transition-colors duration-300 py-1.5 sm:py-2"
                      >
                        <span className="text-xs sm:text-sm font-jakarta text-nemo-orange/60 w-6 sm:w-8">
                          0{i + 1}
                        </span>
                        <span className="relative">
                          {link.label}
                          <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-nemo-orange group-hover:w-full transition-all duration-500" />
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer menu : contacts + socials */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 pt-8 border-t border-white/10"
              >
                {/* Contacts */}
                <address className="not-italic text-white/60 space-y-1 text-sm font-jakarta">
                  <p className="text-white font-semibold mb-2">Nemo Solutions</p>
                  <a
                    href="tel:+33621145888"
                    className="flex items-center gap-2 hover:text-nemo-orange transition-colors"
                    aria-label="Appeler le 06 21 14 58 88"
                  >
                    <Phone size={14} /> 06 21 14 58 88
                  </a>
                  <a
                    href="mailto:clement@nemosolutions.fr"
                    className="flex items-center gap-2 hover:text-nemo-orange transition-colors"
                  >
                    <Mail size={14} /> clement@nemosolutions.fr
                  </a>
                  <p className="text-xs mt-1">29 Av. des Pins, 33830 Belin-Béliet</p>
                </address>

                {/* Social links */}
                <div className="flex items-center gap-4">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-nemo-orange hover:border-nemo-orange transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
