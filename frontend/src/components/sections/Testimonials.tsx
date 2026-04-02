import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../../lib/api';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

type SourceKey = 'google' | 'linkedin' | 'facebook' | 'instagram' | 'malt' | 'fiverr';

interface Testimonial {
  _id: string;
  author: string;
  company?: string;
  role?: string;
  avatar?: string;
  rating: number;
  text: string;
  source?: SourceKey | '';
  reviewDate?: string; // "YYYY-MM"
}

function formatReviewDate(d?: string) {
  if (!d) return null;
  const [year, month] = d.split('-');
  const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// ── Source badges ─────────────────────────────────────────────────────────────

const SOURCE_CONFIG: Record<SourceKey, { label: string; bg: string; text: string; logo: React.ReactNode }> = {
  google: {
    label: 'Google',
    bg: '#fff',
    text: '#444',
    logo: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    bg: '#0077B5',
    text: '#fff',
    logo: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    bg: '#1877F2',
    text: '#fff',
    logo: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    text: '#fff',
    logo: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  malt: {
    label: 'Malt',
    bg: '#FC5656',
    text: '#fff',
    logo: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
        <path d="M20.987 3.014a3.485 3.485 0 00-4.929 0l-4.06 4.06-4.058-4.06a3.485 3.485 0 10-4.929 4.929L7.07 12l-4.059 4.059a3.485 3.485 0 104.929 4.928l4.058-4.059 4.06 4.059a3.485 3.485 0 004.929-4.928L16.928 12l4.059-4.058a3.485 3.485 0 000-4.928z"/>
      </svg>
    ),
  },
  fiverr: {
    label: 'Fiverr',
    bg: '#1DBF73',
    text: '#fff',
    logo: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
        <path d="M23.004 15.588a.995.995 0 10-1.99 0 .995.995 0 001.99 0zm-2.987 0a1.992 1.992 0 113.985 0 1.992 1.992 0 01-3.985 0zm-.7-4.956c.199 0 .362.162.362.362v7.062a.362.362 0 01-.724 0v-7.062c0-.2.162-.362.362-.362zm-1.993.724h-1.634v6.338a.362.362 0 01-.724 0v-6.338H13.33a.362.362 0 010-.724h3.994c.2 0 .362.162.362.362a.362.362 0 01-.362.362zm-5.984 2.232a2.716 2.716 0 10-5.432 0 2.716 2.716 0 005.432 0zm.724 0a3.44 3.44 0 11-6.88 0 3.44 3.44 0 016.88 0zm-8.131-3.318H1.595a.362.362 0 010-.724h2.338c.2 0 .362.162.362.362v7.062a.362.362 0 01-.724 0v-6.7zM1.957 8.628a.724.724 0 100-1.448.724.724 0 000 1.448z"/>
      </svg>
    ),
  },
};

function SourceBadge({ source }: { source?: SourceKey | '' }) {
  if (!source) return null;
  const cfg = SOURCE_CONFIG[source];
  if (!cfg) return null;
  return (
    <div
      className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full shadow-sm text-xs font-jakarta font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
      aria-label={`Avis ${cfg.label}`}
      title={`Avis ${cfg.label}`}
    >
      {cfg.logo}
      <span>{cfg.label}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Note : ${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? 'text-nemo-orange fill-nemo-orange' : 'text-nemo-dark-bg/20 dark:text-nemo-bg/20'} aria-hidden="true" />
      ))}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <blockquote className="card-nemo p-6 relative flex flex-col h-full select-none">
      <SourceBadge source={t.source} />
      <Quote size={28} className="text-nemo-quote/20 mb-4" aria-hidden="true" />
      <StarRating rating={t.rating} />
      <p className="font-jakarta text-sm text-nemo-dark-bg/80 dark:text-nemo-dark-text/90 leading-relaxed mt-3 mb-4 italic flex-1">
        "{t.text}"
      </p>
      <footer className="flex flex-col gap-3 pt-4 border-t border-nemo-dark-bg/8 dark:border-nemo-dark-border">
        <div className="flex items-center gap-3">
          {t.avatar ? (
            <img src={t.avatar} alt={`Photo de ${t.author}`} className="w-9 h-9 rounded-full object-cover shrink-0" loading="lazy" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-nemo-orange/15 dark:bg-nemo-orange/20 text-nemo-orange flex items-center justify-center font-jakarta font-bold text-sm shrink-0" aria-hidden="true">
              {t.author.charAt(0)}
            </div>
          )}
          <div>
            <cite className="font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-dark-text not-italic">{t.author}</cite>
            {(t.company || t.role) && (
              <p className="font-jakarta text-xs text-nemo-dark-bg/50 dark:text-nemo-dark-muted">
                {[t.role, t.company].filter(Boolean).join(' — ')}
              </p>
            )}
          </div>
        </div>
        {formatReviewDate(t.reviewDate) && (
          <p className="font-jakarta text-xs text-nemo-dark-bg/35 dark:text-nemo-dark-muted/60 text-right">
            {formatReviewDate(t.reviewDate)}
          </p>
        )}
      </footer>
    </blockquote>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const GAP = 24;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [current, setCurrent]           = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [containerW, setContainerW]     = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPaused     = useRef(false);
  const autoRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX  = useRef(0);

  // Fetch
  useEffect(() => {
    fetch(`${API_BASE}/api/testimonials`)
      .then(r => r.json())
      .then(data => setTestimonials(Array.isArray(data) ? data : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  // Responsive: 1 on mobile, 3 on sm+
  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth < 640 ? 1 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Container width (for pixel-perfect card sizing)
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(entries => setContainerW(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, testimonials.length]); // re-déclenche quand le div apparaît après le fetch

  const total    = testimonials.length;
  const maxIndex = Math.max(0, total - visibleCount);
  const useSlider = total > 1 && (visibleCount === 1 ? total > 1 : total > visibleCount);

  const goTo = useCallback((i: number) => setCurrent(Math.max(0, Math.min(i, maxIndex))), [maxIndex]);
  const next = useCallback(() => setCurrent(p => p >= maxIndex ? 0 : p + 1), [maxIndex]);
  const prev = useCallback(() => setCurrent(p => p <= 0 ? maxIndex : p - 1), [maxIndex]);

  // Clamp on resize
  useEffect(() => { setCurrent(p => Math.min(p, maxIndex)); }, [maxIndex]);

  // Auto-play
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (!useSlider) return;
    autoRef.current = setInterval(() => {
      if (!isPaused.current) setCurrent(p => p >= maxIndex ? 0 : p + 1);
    }, 4500);
  }, [useSlider, maxIndex]);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
  };

  if (!loading && total === 0) return null;

  // Slider geometry
  const cardW      = containerW > 0 ? Math.floor((containerW - GAP * (visibleCount - 1)) / visibleCount) : 0;
  const slideBy    = cardW + GAP;
  const translateX = -(current * slideBy);
  const dotsCount  = maxIndex + 1;

  return (
    <section
      id="temoignages"
      aria-labelledby="testimonials-title"
      className="section-py bg-white/60 dark:bg-nemo-dark-surface relative"
    >
      <div className="container-nemo">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
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
        </motion.div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-nemo h-56 animate-pulse" aria-hidden="true" />
            ))}
          </div>
        )}

        {/* Slider */}
        {!loading && total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.15 }}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
          >
            {/* Track */}
            <div
              ref={containerRef}
              className="overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                style={{
                  display: 'flex',
                  gap: `${GAP}px`,
                  transform: `translateX(${translateX}px)`,
                  transition: 'transform 0.52s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                }}
              >
                {testimonials.map(t => (
                  <div
                    key={t._id}
                    style={{ width: `${cardW}px`, flexShrink: 0, minWidth: 0 }}
                  >
                    <TestimonialCard t={t} />
                  </div>
                ))}
              </div>
            </div>

            {/* Controls: dots + arrows */}
            {useSlider && (
              <div className="flex items-center justify-center gap-4 mt-8">

                {/* Left arrow — desktop only */}
                {visibleCount > 1 && (
                  <button
                    onClick={prev}
                    aria-label="Avis précédents"
                    className="w-10 h-10 rounded-full border border-nemo-dark-bg/15 dark:border-nemo-dark-border text-nemo-dark-bg/50 dark:text-nemo-dark-muted hover:border-nemo-quote hover:text-nemo-quote flex items-center justify-center transition-all duration-200"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                {/* Dots */}
                <div className="flex items-center gap-2" role="tablist" aria-label="Navigation des avis">
                  {Array.from({ length: dotsCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Aller à l'avis ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? 'bg-nemo-quote w-6 h-2.5'
                          : 'bg-nemo-dark-bg/20 dark:bg-nemo-dark-border w-2.5 h-2.5 hover:bg-nemo-quote/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Right arrow — desktop only */}
                {visibleCount > 1 && (
                  <button
                    onClick={next}
                    aria-label="Avis suivants"
                    className="w-10 h-10 rounded-full border border-nemo-dark-bg/15 dark:border-nemo-dark-border text-nemo-dark-bg/50 dark:text-nemo-dark-muted hover:border-nemo-quote hover:text-nemo-quote flex items-center justify-center transition-all duration-200"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
