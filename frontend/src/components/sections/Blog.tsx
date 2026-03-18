import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Tag, ArrowRight, ZoomIn } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  tag?: string;
  publishedAt?: string;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200));
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
        <button
          onClick={onClose}
          aria-label="Fermer la photo"
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <X size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── BlogCard ──────────────────────────────────────────────────────────────────

function BlogCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const mins = readingTime(article.content);

  return (
    <motion.article
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`Lire l'article : ${article.title}`}
      className="card-nemo overflow-hidden cursor-pointer group focus-visible:outline-nemo-orange flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Image */}
      <div className="relative h-48 bg-nemo-orange/8 dark:bg-nemo-dark-border overflow-hidden shrink-0">
        {article.image ? (
          <img
            src={article.image}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-syne font-bold text-4xl text-nemo-orange/20">NS</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Tag badge */}
        {article.tag && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-nemo-orange text-white text-xs font-jakarta font-bold shadow-lg">
            <Tag size={9} aria-hidden="true" />
            {article.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-nemo-dark-bg/40 dark:text-nemo-dark-muted font-jakarta mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={10} aria-hidden="true" />
            {formatDate(article.publishedAt)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock size={10} aria-hidden="true" />
            {mins} min
          </span>
        </div>

        {/* Title */}
        <h3 className="font-syne font-bold text-base text-nemo-dark-bg dark:text-nemo-dark-text mb-1.5 line-clamp-2 group-hover:text-nemo-orange transition-colors duration-200">
          {article.title}
        </h3>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="font-jakarta text-nemo-orange/80 text-xs font-semibold mb-2">{article.subtitle}</p>
        )}

        {/* Excerpt */}
        <p className="font-jakarta text-sm text-nemo-dark-bg/60 dark:text-nemo-dark-muted line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-1.5 mt-4 text-nemo-orange font-jakarta text-sm font-semibold">
          Lire l'article
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
}

// ── ArticleModal ──────────────────────────────────────────────────────────────

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const mins = readingTime(article.content);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="article-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          style={{ background: 'rgba(13,27,42,0.75)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${article._id}`}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl bg-nemo-bg dark:bg-nemo-dark-surface border border-nemo-dark-bg/8 dark:border-nemo-dark-border"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Image header */}
            {article.image ? (
              <div
                className="relative h-52 sm:h-64 shrink-0 overflow-hidden cursor-zoom-in group/img"
                onClick={e => { e.stopPropagation(); setLightboxOpen(true); }}
                title="Voir en grand"
              >
                <img
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  className="w-full h-full object-cover group-hover/img:scale-[1.03] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                  <ZoomIn size={14} />
                </div>
                {/* Tag on image */}
                {article.tag && (
                  <span className="absolute bottom-3 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-nemo-orange text-white text-xs font-jakarta font-bold backdrop-blur-sm">
                    <Tag size={9} aria-hidden="true" />
                    {article.tag}
                  </span>
                )}
                {/* Close button */}
                <button
                  onClick={e => { e.stopPropagation(); onClose(); }}
                  aria-label="Fermer l'article"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              /* Close button when no image */
              <div className="flex justify-end p-4 pb-0 shrink-0">
                <button
                  onClick={onClose}
                  aria-label="Fermer l'article"
                  className="w-8 h-8 rounded-full border border-nemo-dark-bg/10 dark:border-nemo-dark-border text-nemo-dark-bg/40 dark:text-nemo-bg/40 flex items-center justify-center hover:text-nemo-dark-bg dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Scrollable content */}
            <div ref={scrollRef} className="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-nemo-dark-bg/40 dark:text-nemo-dark-muted font-jakarta mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={11} aria-hidden="true" />
                  {formatDate(article.publishedAt)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} aria-hidden="true" />
                  {mins} min de lecture
                </span>
              </div>

              {/* Title */}
              <h2
                id={`modal-title-${article._id}`}
                className="font-syne font-extrabold text-2xl sm:text-3xl text-nemo-dark-bg dark:text-nemo-dark-text mb-2 leading-tight"
              >
                {article.title}
              </h2>

              {/* Subtitle */}
              {article.subtitle && (
                <p className="font-jakarta text-nemo-orange font-semibold mb-5">{article.subtitle}</p>
              )}

              {/* Separator */}
              <hr className="border-nemo-dark-bg/8 dark:border-nemo-dark-border mb-6" />

              {/* Body */}
              <div
                className="article-body font-jakarta text-sm sm:text-base text-nemo-dark-bg/80 dark:text-nemo-dark-text/85 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="h-4" />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && article.image && (
          <Lightbox
            key="lightbox"
            src={article.image}
            alt={article.imageAlt ?? article.title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Section principale ────────────────────────────────────────────────────────

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const VISIBLE = 3;

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  const total = articles.length;
  const canPrev = current > 0;
  const canNext = current + VISIBLE < total;
  const visible = articles.slice(current, current + VISIBLE);

  return (
    <section id="blog" aria-labelledby="blog-title" className="section-py bg-nemo-bg dark:bg-nemo-dark-bg">
      <div className="container-nemo">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-4 border border-nemo-orange/20">
              Actualités &amp; conseils
            </span>
            <h2 id="blog-title" className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-nemo-dark-bg dark:text-nemo-bg">
              Notre <span className="text-nemo-orange">blog</span>
            </h2>
          </div>

          {total > VISIBLE && (
            <div className="flex items-center gap-3" role="group" aria-label="Navigation des articles">
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={!canPrev}
                aria-label="Articles précédents"
                className="w-11 h-11 rounded-full border-2 border-nemo-orange/30 flex items-center justify-center text-nemo-orange hover:bg-nemo-orange hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-jakarta text-sm text-nemo-dark-bg/50 dark:text-nemo-bg/50">
                {current + 1}–{Math.min(current + VISIBLE, total)} / {total}
              </span>
              <button
                onClick={() => setCurrent(c => Math.min(total - VISIBLE, c + 1))}
                disabled={!canNext}
                aria-label="Articles suivants"
                className="w-11 h-11 rounded-full border-2 border-nemo-orange/30 flex items-center justify-center text-nemo-orange hover:bg-nemo-orange hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-nemo h-80 animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map(article => (
              <BlogCard key={article._id} article={article} onClick={() => setSelected(article)} />
            ))}
          </motion.div>
        )}
      </div>

      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
