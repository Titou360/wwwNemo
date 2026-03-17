import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar, Tag, Clock } from 'lucide-react';

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
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  return (
    <motion.article
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`Lire l'article : ${article.title}`}
      className="card-nemo overflow-hidden cursor-pointer group focus-visible:outline-nemo-orange"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Image */}
      <div className="relative h-48 bg-nemo-orange/8 dark:bg-nemo-dark-border overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-syne font-bold text-4xl text-nemo-orange/20">NS</span>
          </div>
        )}
        {/* Tag */}
        {article.tag && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-nemo-orange text-white text-xs font-jakarta font-bold">
            <Tag size={10} aria-hidden="true" />
            {article.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-nemo-dark-bg/40 dark:text-nemo-dark-muted font-jakarta mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={11} aria-hidden="true" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {readingTime(article.content)} min
          </span>
        </div>
        <h3 className="font-syne font-bold text-base text-nemo-dark-bg dark:text-nemo-dark-text mb-2 line-clamp-2 group-hover:text-nemo-orange transition-colors duration-200">
          {article.title}
        </h3>
        {article.subtitle && (
          <p className="font-jakarta text-nemo-orange/80 text-xs font-semibold mb-2">{article.subtitle}</p>
        )}
        <p className="font-jakarta text-sm text-nemo-dark-bg/60 dark:text-nemo-dark-muted line-clamp-3">
          {article.excerpt}
        </p>
      </div>
    </motion.article>
  );
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
        onClick={e => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${article._id}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-nemo-bg dark:bg-nemo-dark-surface rounded-3xl overflow-hidden max-w-3xl w-full my-8 shadow-2xl"
        >
          {/* Header image */}
          <div className="relative h-56 sm:h-72 bg-linear-to-br from-nemo-orange/20 to-nemo-blue/20">
            {article.image && (
              <img src={article.image} alt={article.imageAlt || article.title} className="w-full h-full object-cover" />
            )}
            {article.tag && (
              <span className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-nemo-orange text-white text-xs font-jakarta font-bold">
                <Tag size={11} aria-hidden="true" />
                {article.tag}
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Fermer l'article"
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-4 text-xs text-nemo-dark-bg/40 dark:text-nemo-dark-muted font-jakarta mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={12} aria-hidden="true" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                {readingTime(article.content)} min de lecture
              </span>
            </div>

            <h2 id={`modal-title-${article._id}`} className="font-syne font-extrabold text-2xl sm:text-3xl text-nemo-dark-bg dark:text-nemo-bg mb-2">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="font-jakarta text-nemo-orange font-semibold mb-6">{article.subtitle}</p>
            )}

            <div
              className="font-jakarta text-nemo-dark-bg/80 dark:text-nemo-bg/80 leading-relaxed prose prose-sm max-w-none [&_p]:mb-4 [&_h2]:font-syne [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-nemo-dark-bg [&_h2]:dark:text-nemo-bg [&_h2]:mb-3 [&_a]:text-nemo-orange [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

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

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(total - VISIBLE, c + 1));

  const visible = articles.slice(current, current + VISIBLE);

  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="section-py bg-nemo-bg dark:bg-nemo-dark-bg"
    >
      <div className="container-nemo">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-4 border border-nemo-orange/20">
              Actualités &amp; conseils
            </span>
            <h2
              id="blog-title"
              className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-nemo-dark-bg dark:text-nemo-bg"
            >
              Notre <span className="text-nemo-orange">blog</span>
            </h2>
          </div>

          {/* Slider controls */}
          {total > VISIBLE && (
            <div className="flex items-center gap-3" role="group" aria-label="Navigation des articles">
              <button
                onClick={prev}
                disabled={!canPrev}
                aria-label="Article précédent"
                className="w-11 h-11 rounded-full border-2 border-nemo-orange/30 flex items-center justify-center text-nemo-orange hover:bg-nemo-orange hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-jakarta text-sm text-nemo-dark-bg/50 dark:text-nemo-bg/50">
                {current + 1}–{Math.min(current + VISIBLE, total)} / {total}
              </span>
              <button
                onClick={next}
                disabled={!canNext}
                aria-label="Article suivant"
                className="w-11 h-11 rounded-full border-2 border-nemo-orange/30 flex items-center justify-center text-nemo-orange hover:bg-nemo-orange hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Articles grid */}
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
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map(article => (
              <ArticleCard
                key={article._id}
                article={article}
                onClick={() => setSelected(article)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
