import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../lib/api';
import { Facebook, Instagram, Linkedin, Globe, ExternalLink, X, Twitter } from 'lucide-react';

interface ClientLink {
  type: 'website' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'other';
  url: string;
}

interface Client {
  _id: string;
  name: string;
  logo?: string;
  logoAlt?: string;
  links: ClientLink[];
  description?: string;
}

const LINK_ICONS: Record<string, React.ElementType> = {
  website:   Globe,
  facebook:  Facebook,
  instagram: Instagram,
  linkedin:  Linkedin,
  twitter:   Twitter,
  other:     ExternalLink,
};

const LINK_LABELS: Record<string, string> = {
  website:   'Site web',
  facebook:  'Facebook',
  instagram: 'Instagram',
  linkedin:  'LinkedIn',
  twitter:   'Twitter / X',
  other:     'Lien externe',
};

// ── Client Modal ──────────────────────────────────────────────────────────────

function ClientModal({ client, onClose }: { client: Client; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleOverlay = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="client-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        style={{ background: 'rgba(13,27,42,0.75)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleOverlay}
        role="dialog"
        aria-modal="true"
        aria-label={`À propos de ${client.name}`}
      >
        <motion.div
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl bg-nemo-bg dark:bg-nemo-dark-surface border border-nemo-dark-bg/8 dark:border-nemo-dark-border"
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-nemo-dark-bg/8 dark:bg-white/8 text-nemo-dark-bg/50 dark:text-nemo-bg/50 flex items-center justify-center hover:bg-nemo-dark-bg/15 dark:hover:bg-white/15 hover:text-nemo-dark-bg dark:hover:text-white transition-all"
          >
            <X size={15} />
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-8 py-8">
            {/* Logo */}
            <div className="flex justify-center mb-5">
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.logoAlt || `Logo ${client.name}`}
                  className="h-20 w-auto max-w-45 object-contain"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-nemo-blue/10 dark:bg-nemo-blue/15 flex items-center justify-center">
                  <Globe size={32} className="text-nemo-blue" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Name */}
            <h2 className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-dark-text text-center mb-6">
              {client.name}
            </h2>

            {/* Description */}
            {client.description && client.description !== '<p></p>' && (
              <>
                <hr className="border-nemo-dark-bg/8 dark:border-nemo-dark-border mb-6" />
                <div
                  className="article-body font-jakarta text-sm text-nemo-dark-bg/75 dark:text-nemo-dark-text/80 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: client.description }}
                />
              </>
            )}

            {/* Links */}
            {client.links && client.links.length > 0 && (
              <>
                <hr className="border-nemo-dark-bg/8 dark:border-nemo-dark-border mb-5" />
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {client.links.map((link, i) => {
                    const Icon = LINK_ICONS[link.type] ?? Globe;
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${client.name} — ${LINK_LABELS[link.type] ?? link.type}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nemo-dark-bg/15 dark:border-nemo-dark-border text-nemo-dark-bg/60 dark:text-nemo-dark-muted hover:border-nemo-orange hover:text-nemo-orange font-jakarta text-xs font-semibold transition-all duration-200"
                      >
                        <Icon size={13} />
                        {LINK_LABELS[link.type] ?? link.type}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Section principale ────────────────────────────────────────────────────────

export default function References() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Client | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/clients`)
      .then(r => r.json())
      .then(data => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && clients.length === 0) return null;

  return (
    <section
      id="references"
      aria-labelledby="references-title"
      className="section-py bg-white/60 dark:bg-nemo-dark-bg relative"
    >
      <div className="container-nemo">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-blue/10 text-nemo-blue text-sm font-jakarta font-semibold mb-4 border border-nemo-blue/25">
            Ils nous font confiance
          </span>
          <h2
            id="references-title"
            className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-nemo-dark-bg dark:text-nemo-dark-text mb-4"
          >
            Références <span className="text-nemo-blue">clés</span>
          </h2>
          <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-dark-muted text-lg max-w-xl mx-auto">
            Entreprises, artisans et associations qui nous ont confié leur développement digital.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-nemo h-36 animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {clients.map((client, i) => (
              <motion.article
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-nemo p-5 flex flex-col items-center justify-between gap-4 group"
              >
                {/* Logo ou icône */}
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.logoAlt || `Logo ${client.name}`}
                    className="h-12 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-nemo-blue/10 flex items-center justify-center" aria-hidden="true">
                    <Globe size={20} className="text-nemo-blue" />
                  </div>
                )}

                {/* Nom */}
                <p className="font-jakarta font-semibold text-sm text-center text-nemo-dark-bg dark:text-nemo-dark-text line-clamp-2">
                  {client.name}
                </p>

                {/* Bouton En savoir + */}
                <button
                  onClick={() => setSelected(client)}
                  className="text-xs font-jakarta font-semibold text-nemo-blue/70 hover:text-nemo-blue border border-nemo-blue/20 hover:border-nemo-blue/50 px-3 py-1 rounded-full transition-all duration-200"
                  aria-label={`En savoir plus sur ${client.name}`}
                >
                  En savoir +
                </button>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
