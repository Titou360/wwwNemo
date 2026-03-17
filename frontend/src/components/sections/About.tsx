import { motion } from 'framer-motion';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function About() {
  return (
    <section
      id="a-propos"
      aria-labelledby="about-title"
      className="section-py bg-nemo-bg dark:bg-nemo-dark-bg"
    >
      <div className="container-nemo">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-blue/10 text-nemo-blue text-sm font-jakarta font-semibold mb-4 border border-nemo-blue/20">
            Qui sommes-nous
          </span>
          <h2
            id="about-title"
            className="font-syne font-bold text-3xl sm:text-4xl text-nemo-dark-bg dark:text-nemo-bg"
          >
            Rencontrez <span className="text-nemo-blue">votre partenaire digital</span>
          </h2>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="card-nemo p-8 max-w-md w-full text-center"
          >
            {/* Photo */}
            <div className="relative mx-auto mb-6 w-32 h-32">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-linear-to-br from-nemo-orange to-nemo-blue blur-md opacity-40 scale-110"
              />
              <img
                src="/images/clement-felices.png"
                alt="Clément FELICES - Fondateur de Nemo Solutions"
                className="relative w-32 h-32 rounded-full object-cover object-[center_5%] border-4 border-white dark:border-nemo-dark-surface shadow-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = 'width:8rem;height:8rem;border-radius:9999px;background-color:#fd6904;display:flex;align-items:center;justify-content:center;color:#fff;font-family:Syne,sans-serif;font-weight:700;font-size:2.25rem;border:4px solid #fff;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);position:relative;';
                    placeholder.textContent = 'CF';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>

            {/* Name & role */}
            <h3 className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-1">
              Clément FELICES
            </h3>
            <p className="font-jakarta text-nemo-orange font-semibold text-sm mb-4 uppercase tracking-wide">
              Fondateur — Nemo Solutions
            </p>

            {/* Bio */}
            <p className="font-jakarta text-nemo-dark-bg/70 dark:text-nemo-bg/70 text-sm leading-relaxed mb-6">
              Passionné par le digital et ancré dans le territoire du Val de l'Eyre,
              j'accompagne les entreprises et artisans de Nouvelle-Aquitaine dans leur
              développement en ligne. Proximité, réactivité et expertise sont mes maîtres mots.
            </p>

            {/* Contacts */}
            <address className="not-italic space-y-3 mb-6">
              <a
                href="tel:+33621145888"
                className="flex items-center justify-center gap-3 text-nemo-dark-bg/70 dark:text-nemo-bg/70 hover:text-nemo-orange dark:hover:text-nemo-orange transition-colors font-jakarta text-sm"
                aria-label="Appeler Clément au 06 21 14 58 88"
              >
                <span className="w-8 h-8 rounded-full bg-nemo-orange/10 flex items-center justify-center text-nemo-orange shrink-0" aria-hidden="true">
                  <Phone size={14} />
                </span>
                06 21 14 58 88
              </a>
              <a
                href="mailto:clement@nemosolutions.fr"
                className="flex items-center justify-center gap-3 text-nemo-dark-bg/70 dark:text-nemo-bg/70 hover:text-nemo-orange dark:hover:text-nemo-orange transition-colors font-jakarta text-sm"
              >
                <span className="w-8 h-8 rounded-full bg-nemo-orange/10 flex items-center justify-center text-nemo-orange shrink-0" aria-hidden="true">
                  <Mail size={14} />
                </span>
                clement@nemosolutions.fr
              </a>
              <p className="flex items-center justify-center gap-3 text-nemo-dark-bg/70 dark:text-nemo-bg/70 font-jakarta text-sm">
                <span className="w-8 h-8 rounded-full bg-nemo-blue/10 flex items-center justify-center text-nemo-blue shrink-0" aria-hidden="true">
                  <MapPin size={14} />
                </span>
                29 Av. des Pins, 33830 Belin-Béliet
              </p>
            </address>

            {/* LinkedIn CTA */}
            <a
              href="https://linkedin.com/in/clement-felices"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Voir le profil LinkedIn de Clément FELICES"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[25px] bg-[#0077B5] text-white font-jakarta font-semibold text-sm hover:bg-[#006097] transition-colors"
            >
              <Linkedin size={16} aria-hidden="true" />
              Voir mon LinkedIn
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
