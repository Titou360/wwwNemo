import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, Star, LogOut, Plus, Pencil, Trash2,
  Eye, EyeOff, AlertTriangle, X, Check, ExternalLink
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Article {
  _id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

interface Client {
  _id: string;
  name: string;
  logo?: string;
  featured: boolean;
  order: number;
}

interface Testimonial {
  _id: string;
  author: string;
  company?: string;
  rating: number;
  published: boolean;
}

type Section = 'articles' | 'clients' | 'testimonials';

// ── Delete Confirm Modal ───────────────────────────────────────────────────────

function DeleteModal({
  label,
  onConfirm,
  onCancel,
}: { label: string; onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('');
  const required = 'SUPPRIMER';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-nemo-dark-surface border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={24} className="text-red-400 shrink-0" aria-hidden="true" />
          <h2 id="delete-modal-title" className="font-syne font-bold text-lg text-white">
            Confirmer la suppression
          </h2>
        </div>
        <p className="font-jakarta text-nemo-bg/70 text-sm mb-2">
          Vous allez supprimer : <strong className="text-white">{label}</strong>
        </p>
        <p className="font-jakarta text-nemo-bg/70 text-sm mb-5">
          Pour confirmer, tapez <strong className="text-red-400">{required}</strong> ci-dessous :
        </p>
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder={required}
          aria-label={`Tapez ${required} pour confirmer`}
          className="w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm mb-5 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm px-5 py-2">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== required}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-jakarta font-semibold text-sm rounded-[25px] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label={`Confirmer la suppression de ${label}`}
          >
            <Trash2 size={14} aria-hidden="true" />
            Supprimer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Article Form ───────────────────────────────────────────────────────────────

function ArticleForm({
  article,
  token,
  onSave,
  onCancel,
}: {
  article?: Partial<Article> & { content?: string; slug?: string; excerpt?: string; image?: string };
  token: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: article?.title ?? '',
    subtitle: article?.subtitle ?? '',
    slug: (article as { slug?: string })?.slug ?? '',
    tag: article?.tag ?? '',
    excerpt: (article as { excerpt?: string })?.excerpt ?? '',
    content: (article as { content?: string })?.content ?? '',
    published: article?.published ?? false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const id = (article as { _id?: string })?._id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append('image', imageFile);
    try {
      const url = id ? `/api/articles/${id}` : '/api/articles';
      await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      onSave();
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all placeholder:text-nemo-bg/20';

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={id ? 'Modifier l\'article' : 'Nouvel article'}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-nemo-dark-surface rounded-2xl p-8 max-w-2xl w-full my-8 border border-nemo-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-xl text-white">{id ? 'Modifier l\'article' : 'Nouvel article'}</h2>
          <button onClick={onCancel} aria-label="Fermer" className="text-nemo-bg/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="a-title" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Titre *</label>
              <input id="a-title" name="title" required value={form.title} onChange={handleChange} className={inputCls} placeholder="Titre de l'article" />
            </div>
            <div>
              <label htmlFor="a-subtitle" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Sous-titre</label>
              <input id="a-subtitle" name="subtitle" value={form.subtitle} onChange={handleChange} className={inputCls} placeholder="Sous-titre" />
            </div>
            <div>
              <label htmlFor="a-slug" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Slug (URL)</label>
              <input id="a-slug" name="slug" value={form.slug} onChange={handleChange} className={inputCls} placeholder="mon-article" />
            </div>
            <div>
              <label htmlFor="a-tag" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Tag</label>
              <input id="a-tag" name="tag" value={form.tag} onChange={handleChange} className={inputCls} placeholder="Conseil, SEO, IA..." />
            </div>
            <div>
              <label htmlFor="a-image" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Image</label>
              <input id="a-image" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-nemo-bg/70 font-jakarta text-sm file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-nemo-orange/20 file:text-nemo-orange file:font-semibold file:text-xs hover:file:bg-nemo-orange/30 file:transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="a-excerpt" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Extrait</label>
              <textarea id="a-excerpt" name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} className={inputCls} placeholder="Résumé court de l'article..." />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="a-content" className="block text-sm text-nemo-bg/70 font-jakarta mb-1">
                Contenu (HTML) *
              </label>
              <textarea id="a-content" name="content" required rows={10} value={form.content} onChange={handleChange} className={`${inputCls} font-mono text-xs`} placeholder="<p>Votre contenu HTML...</p>" />
              <p className="text-xs text-nemo-bg/40 font-jakarta mt-1">Éditeur visuel Gutenberg : à intégrer ultérieurement (ex : @wordpress/block-editor)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="a-published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-nemo-orange" />
            <label htmlFor="a-published" className="font-jakarta text-sm text-nemo-bg/80">Publié</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary text-sm px-5 py-2">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} aria-hidden="true" />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('nemo-admin-token') ?? '';

  const [section, setSection] = useState<Section>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; type: Section } | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null | 'new'>(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    if (!token) { navigate('/admin'); return; }
    setLoading(true);
    try {
      const [a, c, t] = await Promise.all([
        fetch('/api/articles/admin', { headers: authHeader }).then(r => r.json()),
        fetch('/api/clients/admin', { headers: authHeader }).then(r => r.json()),
        fetch('/api/testimonials/admin', { headers: authHeader }).then(r => r.json()),
      ]);
      setArticles(Array.isArray(a) ? a : []);
      setClients(Array.isArray(c) ? c : []);
      setTestimonials(Array.isArray(t) ? t : []);
    } catch {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/${deleteTarget.type}/${deleteTarget.id}`, {
      method: 'DELETE',
      headers: authHeader,
    });
    setDeleteTarget(null);
    load();
  };

  const togglePublish = async (type: 'articles' | 'testimonials', id: string, current: boolean) => {
    await fetch(`/api/${type}/${id}`, {
      method: 'PUT',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    load();
  };

  const logout = () => {
    localStorage.removeItem('nemo-admin-token');
    navigate('/admin');
  };

  const NAV_ITEMS = [
    { key: 'articles' as Section, label: 'Articles', icon: FileText, count: articles.length },
    { key: 'clients' as Section, label: 'Clients', icon: Users, count: clients.length },
    { key: 'testimonials' as Section, label: 'Avis', icon: Star, count: testimonials.length },
  ];

  const tdCls = 'px-4 py-3 text-sm font-jakarta text-nemo-bg/80';
  const thCls = 'px-4 py-3 text-xs font-syne font-bold text-nemo-bg/50 uppercase tracking-wider text-left';

  return (
    <div className="min-h-screen bg-nemo-dark-bg flex">
      {/* Sidebar */}
      <nav className="w-64 bg-nemo-dark-surface border-r border-nemo-dark-border flex flex-col p-5 shrink-0" aria-label="Navigation administration">
        <div className="mb-8">
          <p className="font-syne font-bold text-white text-lg">Nemo Admin</p>
          <p className="font-jakarta text-nemo-bg/40 text-xs mt-0.5">Tableau de bord</p>
        </div>

        <ul className="space-y-1 flex-1" role="list">
          {NAV_ITEMS.map(({ key, label, icon: Icon, count }) => (
            <li key={key}>
              <button
                onClick={() => setSection(key)}
                aria-current={section === key ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-jakarta text-sm font-medium transition-all duration-200 ${
                  section === key
                    ? 'bg-nemo-orange text-white'
                    : 'text-nemo-bg/60 hover:bg-white/5 hover:text-nemo-bg'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${section === key ? 'bg-white/20' : 'bg-nemo-dark-bg'}`}>
                  {count}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-nemo-bg/60 hover:bg-white/5 hover:text-nemo-bg font-jakarta text-sm transition-all mt-2"
        >
          <ExternalLink size={16} aria-hidden="true" />
          Voir le site
        </a>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 font-jakarta text-sm transition-all mt-1"
          aria-label="Se déconnecter"
        >
          <LogOut size={16} aria-hidden="true" />
          Déconnexion
        </button>
      </nav>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={24} className="text-nemo-orange" aria-hidden="true" />
            <div>
              <h1 className="font-syne font-bold text-xl text-white">
                {NAV_ITEMS.find(n => n.key === section)?.label}
              </h1>
              <p className="font-jakarta text-xs text-nemo-bg/40">
                {section === 'articles' && 'Légende : ✏️ Modifier — 🗑️ Supprimer — 👁️ Publier/Dépublier'}
                {section === 'clients' && 'Légende : ✏️ Modifier — 🗑️ Supprimer'}
                {section === 'testimonials' && 'Légende : 🗑️ Supprimer — 👁️ Publier/Dépublier'}
              </p>
            </div>
          </div>

          {section === 'articles' && (
            <button
              onClick={() => setEditArticle('new')}
              className="btn-primary text-sm px-4 py-2"
              aria-label="Créer un nouvel article"
            >
              <Plus size={14} aria-hidden="true" />
              Nouvel article
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Chargement en cours">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-nemo-dark-surface animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <div className="bg-nemo-dark-surface rounded-2xl border border-nemo-dark-border overflow-hidden">
            {/* ── ARTICLES ── */}
            <AnimatePresence mode="wait">
              {section === 'articles' && (
                <motion.div key="articles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {articles.length === 0 ? (
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucun article pour le moment.</p>
                  ) : (
                    <table className="w-full" role="table" aria-label="Liste des articles">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls} scope="col">Titre</th>
                          <th className={thCls} scope="col">Tag</th>
                          <th className={thCls} scope="col">Statut</th>
                          <th className={thCls} scope="col">Date</th>
                          <th className={thCls} scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map(a => (
                          <tr key={a._id} className="border-b border-nemo-dark-border/50 hover:bg-white/2 transition-colors">
                            <td className={tdCls}>
                              <span className="font-semibold text-white line-clamp-1">{a.title}</span>
                              {a.subtitle && <span className="block text-xs text-nemo-bg/40 line-clamp-1">{a.subtitle}</span>}
                            </td>
                            <td className={tdCls}>
                              {a.tag && <span className="px-2 py-0.5 bg-nemo-orange/20 text-nemo-orange rounded-full text-xs font-semibold">{a.tag}</span>}
                            </td>
                            <td className={tdCls}>
                              <span className={`flex items-center gap-1.5 text-xs font-semibold ${a.published ? 'text-green-400' : 'text-nemo-bg/40'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${a.published ? 'bg-green-400' : 'bg-nemo-bg/30'}`} aria-hidden="true" />
                                {a.published ? 'Publié' : 'Brouillon'}
                              </span>
                            </td>
                            <td className={tdCls + ' text-nemo-bg/50 text-xs'}>
                              {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditArticle(a)}
                                  title="Modifier"
                                  aria-label={`Modifier l'article : ${a.title}`}
                                  className="w-8 h-8 rounded-lg bg-nemo-blue/10 text-nemo-blue hover:bg-nemo-blue hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => togglePublish('articles', a._id, a.published)}
                                  title={a.published ? 'Dépublier' : 'Publier'}
                                  aria-label={a.published ? `Dépublier : ${a.title}` : `Publier : ${a.title}`}
                                  className="w-8 h-8 rounded-lg bg-nemo-bg/5 text-nemo-bg/60 hover:bg-nemo-orange/10 hover:text-nemo-orange flex items-center justify-center transition-all"
                                >
                                  {a.published ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ id: a._id, label: a.title, type: 'articles' })}
                                  title="Supprimer"
                                  aria-label={`Supprimer l'article : ${a.title}`}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}

              {/* ── CLIENTS ── */}
              {section === 'clients' && (
                <motion.div key="clients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {clients.length === 0 ? (
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucun client pour le moment.</p>
                  ) : (
                    <table className="w-full" role="table" aria-label="Liste des clients">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls} scope="col">Client</th>
                          <th className={thCls} scope="col">Logo</th>
                          <th className={thCls} scope="col">Affiché</th>
                          <th className={thCls} scope="col">Ordre</th>
                          <th className={thCls} scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map(c => (
                          <tr key={c._id} className="border-b border-nemo-dark-border/50 hover:bg-white/2 transition-colors">
                            <td className={tdCls + ' font-semibold text-white'}>{c.name}</td>
                            <td className={tdCls}>
                              {c.logo ? (
                                <img src={c.logo} alt={`Logo ${c.name}`} className="h-8 w-auto object-contain" />
                              ) : (
                                <span className="text-nemo-bg/30 text-xs">Aucun</span>
                              )}
                            </td>
                            <td className={tdCls}>
                              <span className={`text-xs font-semibold ${c.featured ? 'text-green-400' : 'text-nemo-bg/40'}`}>
                                {c.featured ? 'Oui' : 'Non'}
                              </span>
                            </td>
                            <td className={tdCls + ' text-nemo-bg/60'}>{c.order}</td>
                            <td className={tdCls}>
                              <button
                                onClick={() => setDeleteTarget({ id: c._id, label: c.name, type: 'clients' })}
                                title="Supprimer"
                                aria-label={`Supprimer le client : ${c.name}`}
                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}

              {/* ── TESTIMONIALS ── */}
              {section === 'testimonials' && (
                <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {testimonials.length === 0 ? (
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucun avis pour le moment.</p>
                  ) : (
                    <table className="w-full" role="table" aria-label="Liste des avis clients">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls} scope="col">Auteur</th>
                          <th className={thCls} scope="col">Entreprise</th>
                          <th className={thCls} scope="col">Note</th>
                          <th className={thCls} scope="col">Statut</th>
                          <th className={thCls} scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map(t => (
                          <tr key={t._id} className="border-b border-nemo-dark-border/50 hover:bg-white/2 transition-colors">
                            <td className={tdCls + ' font-semibold text-white'}>{t.author}</td>
                            <td className={tdCls + ' text-nemo-bg/60'}>{t.company ?? '—'}</td>
                            <td className={tdCls}>
                              <span className="flex items-center gap-1 text-nemo-orange text-xs font-bold">
                                ★ {t.rating}/5
                              </span>
                            </td>
                            <td className={tdCls}>
                              <span className={`flex items-center gap-1.5 text-xs font-semibold ${t.published ? 'text-green-400' : 'text-nemo-bg/40'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${t.published ? 'bg-green-400' : 'bg-nemo-bg/30'}`} aria-hidden="true" />
                                {t.published ? 'Publié' : 'Masqué'}
                              </span>
                            </td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => togglePublish('testimonials', t._id, t.published)}
                                  title={t.published ? 'Masquer' : 'Publier'}
                                  aria-label={t.published ? `Masquer l'avis de ${t.author}` : `Publier l'avis de ${t.author}`}
                                  className="w-8 h-8 rounded-lg bg-nemo-bg/5 text-nemo-bg/60 hover:bg-nemo-orange/10 hover:text-nemo-orange flex items-center justify-center transition-all"
                                >
                                  {t.published ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ id: t._id, label: `Avis de ${t.author}`, type: 'testimonials' })}
                                  title="Supprimer"
                                  aria-label={`Supprimer l'avis de ${t.author}`}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modals */}
      {deleteTarget && (
        <DeleteModal
          label={deleteTarget.label}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {editArticle && (
        <ArticleForm
          article={editArticle === 'new' ? undefined : editArticle}
          token={token}
          onSave={() => { setEditArticle(null); load(); }}
          onCancel={() => setEditArticle(null)}
        />
      )}
    </div>
  );
}
