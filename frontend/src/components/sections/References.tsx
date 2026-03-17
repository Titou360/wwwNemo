import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Globe, ExternalLink } from 'lucide-react';

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
}

const LINK_ICONS: Record<string, React.ElementType> = {
  website: Globe,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: ExternalLink,
  other: ExternalLink,
};

// Placeholder data shown when API is not yet available
const PLACEHOLDER_CLIENTS: Client[] = [
  { _id: '1', name: 'Client Référence', links: [{ type: 'website', url: '#' }] },
  { _id: '2', name: 'Client Référence', links: [{ type: 'facebook', url: '#' }, { type: 'instagram', url: '#' }] },
  { _id: '3', name: 'Client Référence', links: [{ type: 'website', url: '#' }] },
  { _id: '4', name: 'Client Référence', links: [{ type: 'linkedin', url: '#' }] },
  { _id: '5', name: 'Client Référence', links: [{ type: 'website', url: '#' }, { type: 'facebook', url: '#' }] },
  { _id: '6', name: 'Client Référence', links: [{ type: 'instagram', url: '#' }] },
];

export default function References() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => {
        setClients(Array.isArray(data) && data.length > 0 ? data : PLACEHOLDER_CLIENTS);
      })
      .catch(() => setClients(PLACEHOLDER_CLIENTS))
      .finally(() => setLoading(false));
  }, []);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-nemo h-28 animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client, i) => (
              <motion.article
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-nemo p-4 flex flex-col items-center justify-center gap-3 min-h-27.5 group"
              >
                {/* Logo or placeholder */}
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.logoAlt || `Logo ${client.name}`}
                    className="h-10 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full bg-nemo-blue/10 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Globe size={18} className="text-nemo-blue" />
                  </div>
                )}

                <p className="font-jakarta font-semibold text-xs text-center text-nemo-dark-bg dark:text-nemo-dark-text line-clamp-2">
                  {client.name}
                </p>

                {/* Links */}
                {client.links && client.links.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {client.links.map((link, j) => {
                      const Icon = LINK_ICONS[link.type] || Globe;
                      return (
                        <a
                          key={j}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${client.name} — ${link.type}`}
                          className="w-6 h-6 rounded-full bg-nemo-blue/10 flex items-center justify-center text-nemo-blue hover:bg-nemo-blue hover:text-white transition-all duration-200"
                        >
                          <Icon size={11} />
                        </a>
                      );
                    })}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
