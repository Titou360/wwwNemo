import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  _id: string;
  author: string;
  company?: string;
  role?: string;
  avatar?: string;
  rating: number;
  text: string;
}

const PLACEHOLDER: Testimonial[] = [
  {
    _id: '1',
    author: 'Marie D.',
    company: 'Fleuriste du Bassin',
    role: 'Gérante',
    rating: 5,
    text: 'Clément a créé notre site en un temps record. Le résultat est magnifique et nos clients adorent la facilité d\'utilisation. Notre chiffre d\'affaires en ligne a augmenté de 40% !',
  },
  {
    _id: '2',
    author: 'Pierre M.',
    company: 'Menuiserie Bordelaise',
    role: 'Artisan',
    rating: 5,
    text: 'Enfin un prestataire qui comprend les besoins des artisans. Disponible, réactif et professionnel. Je recommande vivement Nemo Solutions à tous mes confrères.',
  },
  {
    _id: '3',
    author: 'Sophie L.',
    company: 'Cabinet Médical',
    role: 'Praticienne',
    rating: 5,
    text: 'La refonte de notre site et le travail SEO ont doublé nos prises de rendez-vous en ligne. Un accompagnement au top, avec des explications claires à chaque étape.',
  },
  {
    _id: '4',
    author: 'Thomas R.',
    company: 'Restaurant Les Landes',
    role: 'Restaurateur',
    rating: 5,
    text: 'Site vitrine + gestion des réseaux sociaux, Nemo Solutions gère tout. On peut enfin se concentrer sur notre cuisine pendant qu\'eux gèrent notre visibilité digitale.',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Note : ${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-nemo-orange fill-nemo-orange' : 'text-nemo-dark-bg/20 dark:text-nemo-bg/20'}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => setTestimonials(Array.isArray(data) && data.length > 0 ? data : PLACEHOLDER))
      .catch(() => setTestimonials(PLACEHOLDER))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="temoignages"
      aria-labelledby="testimonials-title"
      className="section-py bg-white/60 dark:bg-nemo-dark-surface relative"
    >
      <div className="container-nemo">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-quote/10 text-nemo-quote text-sm font-jakarta font-semibold mb-4 border border-nemo-quote/25">
            Avis clients
          </span>
          <h2
            id="testimonials-title"
            className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-nemo-dark-bg dark:text-nemo-dark-text mb-4"
          >
            Ce que disent{' '}
            <span className="text-nemo-quote">nos clients</span>
          </h2>
          <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-dark-muted text-lg max-w-xl mx-auto">
            La satisfaction de nos clients est notre meilleure carte de visite.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-nemo h-56 animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card-nemo p-6 relative"
              >
                {/* Quote icon */}
                <Quote
                  size={28}
                  className="text-nemo-quote/20 mb-4"
                  aria-hidden="true"
                />

                {/* Stars */}
                <StarRating rating={t.rating} />

                {/* Text */}
                <p className="font-jakarta text-sm text-nemo-dark-bg/80 dark:text-nemo-dark-text/90 leading-relaxed mt-3 mb-4 italic">
                  "{t.text}"
                </p>

                {/* Author */}
                <footer className="flex items-center gap-3 mt-auto pt-4 border-t border-nemo-dark-bg/8 dark:border-nemo-dark-border">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={`Photo de ${t.author}`}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full bg-nemo-orange/15 dark:bg-nemo-orange/20 text-nemo-orange flex items-center justify-center font-jakarta font-bold text-sm shrink-0"
                      aria-hidden="true"
                    >
                      {t.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <cite className="font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-dark-text not-italic">
                      {t.author}
                    </cite>
                    {(t.company || t.role) && (
                      <p className="font-jakarta text-xs text-nemo-dark-bg/50 dark:text-nemo-dark-muted">
                        {[t.role, t.company].filter(Boolean).join(' — ')}
                      </p>
                    )}
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
