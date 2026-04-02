import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, Star, LogOut, Plus, Pencil, Trash2,
  Eye, EyeOff, AlertTriangle, X, Check, ExternalLink, Globe, Facebook,
  Instagram, Linkedin, Twitter, Image, FileImage, MapPin,
} from 'lucide-react';
import RichTextEditor from '../../components/ui/RichTextEditor';

// ── Types ──────────────────────────────────────────────────────────────────────

type LinkType = 'website' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'other';

interface ClientLink { type: LinkType; url: string; }

interface Article {
  _id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
}

interface Client {
  _id: string;
  name: string;
  logo?: string;
  logoAlt?: string;
  links: ClientLink[];
  description?: string;
  featured: boolean;
  order: number;
}

type TestimonialSource = '' | 'google' | 'linkedin' | 'facebook' | 'instagram' | 'malt' | 'fiverr';

interface Testimonial {
  _id: string;
  author: string;
  company?: string;
  role?: string;
  avatar?: string;
  rating: number;
  text: string;
  source?: TestimonialSource;
  reviewDate?: string;
  published: boolean;
  order?: number;
}

interface City {
  _id: string;
  name: string;
  slug: string;
  dept: string;
  context: string;
  order: number;
}

type Section = 'articles' | 'clients' | 'testimonials' | 'media' | 'cities';

const CONFIRM_PHRASES: Record<'articles' | 'clients' | 'testimonials' | 'cities', string> = {
  articles:     "Je supprime l'article",
  clients:      'Je supprime le client',
  testimonials: "Je supprime l'avis",
  cities:       'Je supprime la ville',
};

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

const LINK_TYPE_LABELS: Record<LinkType, string> = {
  website:   'Site web',
  facebook:  'Facebook',
  instagram: 'Instagram',
  linkedin:  'LinkedIn',
  twitter:   'Twitter / X',
  other:     'Autre',
};

const LINK_ICONS: Record<LinkType, React.ElementType> = {
  website:   Globe,
  facebook:  Facebook,
  instagram: Instagram,
  linkedin:  Linkedin,
  twitter:   Twitter,
  other:     Globe,
};

// ── Delete Confirm Modal ───────────────────────────────────────────────────────

function DeleteModal({
  label, confirmPhrase, onConfirm, onCancel,
}: { label: string; confirmPhrase: string; onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-nemo-dark-surface border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={24} className="text-red-400 shrink-0" aria-hidden="true" />
          <h2 id="delete-modal-title" className="font-syne font-bold text-lg text-white">Confirmer la suppression</h2>
        </div>
        <p className="font-jakarta text-nemo-bg/70 text-sm mb-2">
          Vous allez supprimer : <strong className="text-white">{label}</strong>
        </p>
        <p className="font-jakarta text-nemo-bg/70 text-sm mb-5">
          Pour confirmer, tapez <strong className="text-red-400">"{confirmPhrase}"</strong> ci-dessous :
        </p>
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder={confirmPhrase}
          className="w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm mb-5 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm px-5 py-2">Annuler</button>
          <button
            onClick={onConfirm}
            disabled={typed !== confirmPhrase}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-jakarta font-semibold text-sm rounded-[25px] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
  article, token, onSave, onCancel,
}: {
  article?: Partial<Article>;
  token: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title:     article?.title     ?? '',
    subtitle:  article?.subtitle  ?? '',
    slug:      article?.slug      ?? '',
    tag:       article?.tag       ?? '',
    excerpt:   article?.excerpt   ?? '',
    content:   article?.content   ?? '',
    published: article?.published ?? false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const id = article?._id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append('image', imageFile);
    try {
      await fetch(id ? `${API_BASE}/api/articles/${id}` : `${API_BASE}/api/articles`, {
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
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-nemo-dark-surface rounded-2xl p-8 max-w-3xl w-full my-8 border border-nemo-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-xl text-white">{id ? "Modifier l'article" : 'Nouvel article'}</h2>
          <button onClick={onCancel} aria-label="Fermer" className="text-nemo-bg/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Titre *</label>
              <input name="title" required value={form.title} onChange={handleChange} className={inputCls} placeholder="Titre de l'article" />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Sous-titre</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} className={inputCls} placeholder="Sous-titre" />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} placeholder="mon-article" />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Tag</label>
              <input name="tag" value={form.tag} onChange={handleChange} className={inputCls} placeholder="Conseil, SEO, IA..." />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-nemo-bg/70 font-jakarta text-sm file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-nemo-orange/20 file:text-nemo-orange file:font-semibold file:text-xs hover:file:bg-nemo-orange/30 file:transition-colors" />
              {article?.image && <p className="text-xs text-nemo-bg/40 mt-1 font-jakarta">Image actuelle : {article.image}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Extrait</label>
              <textarea name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} className={inputCls} placeholder="Résumé court..." />
            </div>
          </div>

          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-2">Contenu *</label>
            <RichTextEditor
              value={form.content}
              onChange={html => setForm(prev => ({ ...prev, content: html }))}
              placeholder="Rédigez votre article ici..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="a-published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-nemo-orange" />
            <label htmlFor="a-published" className="font-jakarta text-sm text-nemo-bg/80">Publier cet article</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary text-sm px-5 py-2">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Client Form ────────────────────────────────────────────────────────────────

function ClientForm({
  client, token, onSave, onCancel,
}: {
  client?: Partial<Client>;
  token: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name:        client?.name        ?? '',
    logoAlt:     client?.logoAlt     ?? '',
    description: client?.description ?? '',
    featured:    client?.featured    ?? true,
    order:       client?.order       ?? 0,
  });
  const [links, setLinks] = useState<ClientLink[]>(client?.links ?? []);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const id = client?._id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
             : name === 'order'   ? Number(value)
             : value,
    }));
  };

  const addLink = () => setLinks(prev => [...prev, { type: 'website', url: '' }]);
  const removeLink = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i));
  const updateLink = (i: number, key: keyof ClientLink, value: string) =>
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [key]: value } : l));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('logoAlt', form.logoAlt);
    fd.append('featured', String(form.featured));
    fd.append('order', String(form.order));
    fd.append('description', form.description);
    fd.append('links', JSON.stringify(links));
    if (logoFile) fd.append('logo', logoFile);
    try {
      await fetch(id ? `${API_BASE}/api/clients/${id}` : `${API_BASE}/api/clients`, {
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
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-nemo-dark-surface rounded-2xl p-8 max-w-2xl w-full my-8 border border-nemo-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-xl text-white">{id ? 'Modifier le client' : 'Nouveau client'}</h2>
          <button onClick={onCancel} className="text-nemo-bg/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Nom *</label>
            <input name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="Nom du client" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Logo</label>
              <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] ?? null)} className="w-full text-nemo-bg/70 font-jakarta text-sm file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-nemo-orange/20 file:text-nemo-orange file:font-semibold file:text-xs hover:file:bg-nemo-orange/30 file:transition-colors" />
              {client?.logo && <p className="text-xs text-nemo-bg/40 mt-1 font-jakarta">Logo actuel : {client.logo}</p>}
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Texte alternatif du logo</label>
              <input name="logoAlt" value={form.logoAlt} onChange={handleChange} className={inputCls} placeholder="Logo Nom Client" />
            </div>
          </div>

          {/* Liens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-nemo-bg/70 font-jakarta">Liens</label>
              <button type="button" onClick={addLink} className="inline-flex items-center gap-1 text-xs text-nemo-orange hover:text-nemo-orange/80 font-jakarta font-semibold transition-colors">
                <Plus size={12} /> Ajouter un lien
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link, i) => {
                const Icon = LINK_ICONS[link.type];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon size={14} className="text-nemo-bg/40 shrink-0" />
                    <select
                      value={link.type}
                      onChange={e => updateLink(i, 'type', e.target.value)}
                      className="px-3 py-2 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-xs focus:outline-none focus:border-nemo-orange transition-all shrink-0"
                    >
                      {(Object.entries(LINK_TYPE_LABELS) as [LinkType, string][]).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                    <input
                      value={link.url}
                      onChange={e => updateLink(i, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-xs focus:outline-none focus:border-nemo-orange transition-all placeholder:text-nemo-bg/20"
                    />
                    <button type="button" onClick={() => removeLink(i)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                      <X size={11} />
                    </button>
                  </div>
                );
              })}
              {links.length === 0 && <p className="text-xs text-nemo-bg/30 font-jakarta italic">Aucun lien pour l'instant.</p>}
            </div>
          </div>

          {/* Description riche */}
          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-2">
              Description <span className="text-nemo-bg/30 font-normal">(affichée dans la modale "En savoir +")</span>
            </label>
            <RichTextEditor
              value={form.description}
              onChange={html => setForm(prev => ({ ...prev, description: html }))}
              placeholder="Décrivez le projet réalisé pour ce client..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Ordre d'affichage</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} className={inputCls} min={0} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="c-featured" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-nemo-orange" />
              <label htmlFor="c-featured" className="font-jakarta text-sm text-nemo-bg/80">Affiché sur le site</label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary text-sm px-5 py-2">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Testimonial Form ───────────────────────────────────────────────────────────

function TestimonialForm({
  testimonial, token, onSave, onCancel,
}: {
  testimonial?: Partial<Testimonial>;
  token: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    author:    testimonial?.author    ?? '',
    company:   testimonial?.company   ?? '',
    role:      testimonial?.role      ?? '',
    text:      testimonial?.text      ?? '',
    rating:     testimonial?.rating     ?? 5,
    source:     (testimonial?.source   ?? '') as TestimonialSource,
    reviewDate: testimonial?.reviewDate ?? '',
    published:  testimonial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const id = testimonial?._id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(id ? `${API_BASE}/api/testimonials/${id}` : `${API_BASE}/api/testimonials`, {
        method: id ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onSave();
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all placeholder:text-nemo-bg/20';

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-nemo-dark-surface rounded-2xl p-8 max-w-xl w-full my-8 border border-nemo-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-xl text-white">{id ? "Modifier l'avis" : 'Nouvel avis'}</h2>
          <button onClick={onCancel} className="text-nemo-bg/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Auteur *</label>
              <input name="author" required value={form.author} onChange={handleChange} className={inputCls} placeholder="Marie D." />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Entreprise</label>
              <input name="company" value={form.company} onChange={handleChange} className={inputCls} placeholder="Nom de l'entreprise" />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Rôle / Métier</label>
              <input name="role" value={form.role} onChange={handleChange} className={inputCls} placeholder="Gérante, Artisan..." />
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-2">Note</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, rating: n }))}
                    className={`text-2xl transition-all ${n <= form.rating ? 'text-nemo-orange' : 'text-nemo-dark-border'}`}
                    aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                <span className="font-jakarta text-sm text-nemo-bg/50 ml-1">{form.rating}/5</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Source de l'avis</label>
              <select
                name="source"
                value={form.source}
                onChange={e => setForm(prev => ({ ...prev, source: e.target.value as TestimonialSource }))}
                className="w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
              >
                <option value="">— Non spécifié —</option>
                <option value="google">Google</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="malt">Malt</option>
                <option value="fiverr">Fiverr</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Date de l'avis</label>
              <input
                type="month"
                value={form.reviewDate}
                onChange={e => setForm(prev => ({ ...prev, reviewDate: e.target.value }))}
                max={new Date().toISOString().slice(0, 7)}
                className="w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all scheme-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Témoignage *</label>
            <textarea name="text" required rows={5} value={form.text} onChange={handleChange} className={inputCls} placeholder="Le témoignage du client..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="t-published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-nemo-orange" />
            <label htmlFor="t-published" className="font-jakarta text-sm text-nemo-bg/80">Publier cet avis</label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary text-sm px-5 py-2">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Media Library ──────────────────────────────────────────────────────────────

function MediaLibrary({ token }: { token: string }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [typed, setTyped] = useState('');
  const PHRASE = 'Je supprime cette image';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API_BASE}/api/media`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
      setFiles(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget || typed !== PHRASE) return;
    await fetch(`${API_BASE}/api/media/${encodeURIComponent(deleteTarget.filename)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleteTarget(null);
    setTyped('');
    load();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-nemo-dark-bg animate-pulse" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-nemo-bg/30">
        <FileImage size={48} aria-hidden="true" />
        <p className="font-jakarta text-sm">Aucune image uploadée pour le moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <p className="font-jakarta text-xs text-nemo-bg/40 mb-5">{files.length} fichier{files.length > 1 ? 's' : ''}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map(file => (
            <div key={file.filename} className="group relative aspect-square rounded-xl overflow-hidden bg-nemo-dark-bg border border-nemo-dark-border">
              <img
                src={file.url}
                alt={file.filename}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col justify-between p-2">
                {/* Delete button */}
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => { setDeleteTarget(file); setTyped(''); }}
                    title="Supprimer"
                    className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                    aria-label={`Supprimer ${file.filename}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {/* File info */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="font-jakarta text-white text-xs font-semibold truncate leading-tight">{file.filename}</p>
                  <p className="font-jakarta text-white/60 text-xs">{formatSize(file.size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-nemo-dark-surface border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400 shrink-0" aria-hidden="true" />
              <h2 className="font-syne font-bold text-lg text-white">Supprimer l'image</h2>
            </div>
            <div className="mb-4 rounded-xl overflow-hidden bg-nemo-dark-bg border border-nemo-dark-border">
              <img src={deleteTarget.url} alt={deleteTarget.filename} className="w-full max-h-40 object-contain" />
            </div>
            <p className="font-jakarta text-nemo-bg/70 text-sm mb-2">
              Fichier : <strong className="text-white">{deleteTarget.filename}</strong>
            </p>
            <p className="font-jakarta text-nemo-bg/70 text-sm mb-5">
              Pour confirmer, tapez <strong className="text-red-400">"{PHRASE}"</strong> :
            </p>
            <input
              type="text"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder={PHRASE}
              className="w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm mb-5 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setDeleteTarget(null); setTyped(''); }}
                className="btn-secondary text-sm px-5 py-2"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={typed !== PHRASE}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-jakarta font-semibold text-sm rounded-[25px] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Trash2 size={14} aria-hidden="true" />
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

// ── City Form ──────────────────────────────────────────────────────────────────

function CityForm({
  city, token, onSave, onCancel,
}: { city?: Partial<City>; token: string; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name:    city?.name    ?? '',
    dept:    city?.dept    ?? '',
    context: city?.context ?? '',
    order:   city?.order   ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const id = city?._id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(id ? `${API_BASE}/api/cities/${id}` : `${API_BASE}/api/cities`, {
        method: id ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onSave();
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-nemo-dark-bg border border-nemo-dark-border text-white font-jakarta text-sm focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all placeholder:text-nemo-bg/20';

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-nemo-dark-surface rounded-2xl p-8 max-w-lg w-full my-8 border border-nemo-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-xl text-white">{id ? 'Modifier la ville' : 'Nouvelle ville'}</h2>
          <button onClick={onCancel} aria-label="Fermer" className="text-nemo-bg/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Nom de la ville *</label>
            <input name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="ex : Belin-Béliet" />
          </div>
          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Département *</label>
            <input name="dept" required value={form.dept} onChange={handleChange} className={inputCls} placeholder="ex : Gironde" />
          </div>
          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Contexte géographique *</label>
            <input name="context" required value={form.context} onChange={handleChange} className={inputCls} placeholder="ex : au cœur du Val de l'Eyre, en Gironde" />
            <p className="text-xs text-nemo-bg/40 font-jakarta mt-1">Apparaît dans "Votre partenaire digital {'{contexte}'}"</p>
          </div>
          <div>
            <label className="block text-sm text-nemo-bg/70 font-jakarta mb-1">Ordre d'affichage</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className={inputCls} placeholder="0" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary text-sm px-5 py-2">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</> : <><Check size={14} />{id ? 'Mettre à jour' : 'Créer la ville'}</>}
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
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; type: 'articles' | 'clients' | 'testimonials' | 'cities' } | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null | 'new'>(null);
  const [editClient, setEditClient] = useState<Client | null | 'new'>(null);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null | 'new'>(null);
  const [editCity, setEditCity] = useState<City | null | 'new'>(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    if (!token) { navigate('/admin'); return; }
    setLoading(true);
    try {
      const [a, c, t, ci] = await Promise.all([
        fetch(`${API_BASE}/api/articles/admin`,      { headers: authHeader }).then(r => r.json()),
        fetch(`${API_BASE}/api/clients/admin`,       { headers: authHeader }).then(r => r.json()),
        fetch(`${API_BASE}/api/testimonials/admin`,  { headers: authHeader }).then(r => r.json()),
        fetch(`${API_BASE}/api/cities`).then(r => r.json()),
      ]);
      setArticles(Array.isArray(a) ? a : []);
      setClients(Array.isArray(c) ? c : []);
      setTestimonials(Array.isArray(t) ? t : []);
      setCities(Array.isArray(ci) ? ci : []);
    } catch {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`${API_BASE}/api/${deleteTarget.type}/${deleteTarget.id}`, { method: 'DELETE', headers: authHeader });
    setDeleteTarget(null);
    load();
  };

  const togglePublish = async (type: 'articles' | 'testimonials', id: string, current: boolean) => {
    await fetch(`${API_BASE}/api/${type}/${id}`, {
      method: 'PUT',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    load();
  };

  const logout = () => { localStorage.removeItem('nemo-admin-token'); navigate('/admin'); };

  const NAV_ITEMS: { key: Section; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'articles',     label: 'Articles',      icon: FileText, count: articles.length },
    { key: 'clients',      label: 'Clients',       icon: Users,    count: clients.length },
    { key: 'testimonials', label: 'Avis',          icon: Star,     count: testimonials.length },
    { key: 'cities',       label: 'Pages locales', icon: MapPin,   count: cities.length },
    { key: 'media',        label: 'Médiathèque',   icon: Image },
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
                  section === key ? 'bg-nemo-orange text-white' : 'text-nemo-bg/60 hover:bg-white/5 hover:text-nemo-bg'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </span>
                {count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${section === key ? 'bg-white/20' : 'bg-nemo-dark-bg'}`}>
                    {count}
                  </span>
                )}
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
            <h1 className="font-syne font-bold text-xl text-white">
              {NAV_ITEMS.find(n => n.key === section)?.label}
            </h1>
          </div>

          {section === 'articles' && (
            <button onClick={() => setEditArticle('new')} className="btn-primary text-sm px-4 py-2">
              <Plus size={14} aria-hidden="true" /> Nouvel article
            </button>
          )}
          {section === 'clients' && (
            <button onClick={() => setEditClient('new')} className="btn-primary text-sm px-4 py-2">
              <Plus size={14} aria-hidden="true" /> Nouveau client
            </button>
          )}
          {section === 'testimonials' && (
            <button onClick={() => setEditTestimonial('new')} className="btn-primary text-sm px-4 py-2">
              <Plus size={14} aria-hidden="true" /> Nouvel avis
            </button>
          )}
          {section === 'cities' && (
            <button onClick={() => setEditCity('new')} className="btn-primary text-sm px-4 py-2">
              <Plus size={14} aria-hidden="true" /> Nouvelle ville
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-nemo-dark-surface animate-pulse" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <div className="bg-nemo-dark-surface rounded-2xl border border-nemo-dark-border overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ── ARTICLES ── */}
              {section === 'articles' && (
                <motion.div key="articles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {articles.length === 0 ? (
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucun article pour le moment.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls}>Titre</th>
                          <th className={thCls}>Tag</th>
                          <th className={thCls}>Statut</th>
                          <th className={thCls}>Date</th>
                          <th className={thCls}>Actions</th>
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
                                <span className={`w-1.5 h-1.5 rounded-full ${a.published ? 'bg-green-400' : 'bg-nemo-bg/30'}`} />
                                {a.published ? 'Publié' : 'Brouillon'}
                              </span>
                            </td>
                            <td className={tdCls + ' text-nemo-bg/50 text-xs'}>{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditArticle(a)} title="Modifier" className="w-8 h-8 rounded-lg bg-nemo-blue/10 text-nemo-blue hover:bg-nemo-blue hover:text-white flex items-center justify-center transition-all">
                                  <Pencil size={13} />
                                </button>
                                <button onClick={() => togglePublish('articles', a._id, a.published)} title={a.published ? 'Dépublier' : 'Publier'} className="w-8 h-8 rounded-lg bg-nemo-bg/5 text-nemo-bg/60 hover:bg-nemo-orange/10 hover:text-nemo-orange flex items-center justify-center transition-all">
                                  {a.published ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button onClick={() => setDeleteTarget({ id: a._id, label: a.title, type: 'articles' })} title="Supprimer" className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
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
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucun client pour le moment. Cliquez sur "Nouveau client" pour commencer.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls}>Client</th>
                          <th className={thCls}>Logo</th>
                          <th className={thCls}>Liens</th>
                          <th className={thCls}>Affiché</th>
                          <th className={thCls}>Ordre</th>
                          <th className={thCls}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map(c => (
                          <tr key={c._id} className="border-b border-nemo-dark-border/50 hover:bg-white/2 transition-colors">
                            <td className={tdCls + ' font-semibold text-white'}>{c.name}</td>
                            <td className={tdCls}>
                              {c.logo ? <img src={c.logo} alt={c.logoAlt ?? `Logo ${c.name}`} className="h-8 w-auto object-contain" /> : <span className="text-nemo-bg/30 text-xs">Aucun</span>}
                            </td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-1">
                                {(c.links ?? []).map((l, i) => {
                                  const Icon = LINK_ICONS[l.type];
                                  return <Icon key={i} size={13} className="text-nemo-bg/50" title={l.url} />;
                                })}
                                {(!c.links || c.links.length === 0) && <span className="text-xs text-nemo-bg/30">—</span>}
                              </div>
                            </td>
                            <td className={tdCls}>
                              <span className={`text-xs font-semibold ${c.featured ? 'text-green-400' : 'text-nemo-bg/40'}`}>
                                {c.featured ? 'Oui' : 'Non'}
                              </span>
                            </td>
                            <td className={tdCls + ' text-nemo-bg/60'}>{c.order}</td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditClient(c)} title="Modifier" className="w-8 h-8 rounded-lg bg-nemo-blue/10 text-nemo-blue hover:bg-nemo-blue hover:text-white flex items-center justify-center transition-all">
                                  <Pencil size={13} />
                                </button>
                                <button onClick={() => setDeleteTarget({ id: c._id, label: c.name, type: 'clients' })} title="Supprimer" className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
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

              {/* ── TESTIMONIALS ── */}
              {section === 'testimonials' && (
                <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {testimonials.length === 0 ? (
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucun avis pour le moment. Cliquez sur "Nouvel avis" pour commencer.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls}>Auteur</th>
                          <th className={thCls}>Entreprise / Rôle</th>
                          <th className={thCls}>Note</th>
                          <th className={thCls}>Statut</th>
                          <th className={thCls}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map(t => (
                          <tr key={t._id} className="border-b border-nemo-dark-border/50 hover:bg-white/2 transition-colors">
                            <td className={tdCls + ' font-semibold text-white'}>{t.author}</td>
                            <td className={tdCls + ' text-nemo-bg/60'}>
                              {t.role && <span className="block text-xs">{t.role}</span>}
                              {t.company ?? '—'}
                            </td>
                            <td className={tdCls}>
                              <span className="flex items-center gap-1 text-nemo-orange text-xs font-bold">★ {t.rating}/5</span>
                            </td>
                            <td className={tdCls}>
                              <span className={`flex items-center gap-1.5 text-xs font-semibold ${t.published ? 'text-green-400' : 'text-nemo-bg/40'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${t.published ? 'bg-green-400' : 'bg-nemo-bg/30'}`} />
                                {t.published ? 'Publié' : 'Masqué'}
                              </span>
                            </td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditTestimonial(t)} title="Modifier" className="w-8 h-8 rounded-lg bg-nemo-blue/10 text-nemo-blue hover:bg-nemo-blue hover:text-white flex items-center justify-center transition-all">
                                  <Pencil size={13} />
                                </button>
                                <button onClick={() => togglePublish('testimonials', t._id, t.published)} title={t.published ? 'Masquer' : 'Publier'} className="w-8 h-8 rounded-lg bg-nemo-bg/5 text-nemo-bg/60 hover:bg-nemo-orange/10 hover:text-nemo-orange flex items-center justify-center transition-all">
                                  {t.published ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button onClick={() => setDeleteTarget({ id: t._id, label: `Avis de ${t.author}`, type: 'testimonials' })} title="Supprimer" className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
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
              {/* ── CITIES ── */}
              {section === 'cities' && (
                <motion.div key="cities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {cities.length === 0 ? (
                    <p className="text-center py-12 font-jakarta text-nemo-bg/50">Aucune ville. Cliquez sur "Nouvelle ville" pour commencer.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="border-b border-nemo-dark-border">
                        <tr>
                          <th className={thCls}>Ville</th>
                          <th className={thCls}>Département</th>
                          <th className={thCls}>Contexte géographique</th>
                          <th className={thCls}>Ordre</th>
                          <th className={thCls}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cities.map(city => (
                          <tr key={city._id} className="border-b border-nemo-dark-border/50 hover:bg-white/2 transition-colors">
                            <td className={tdCls}>
                              <span className="font-semibold text-white">{city.name}</span>
                              <span className="block text-xs text-nemo-bg/40 font-mono mt-0.5">/pages-locales/…/{city.slug}</span>
                            </td>
                            <td className={tdCls + ' text-nemo-bg/70'}>{city.dept}</td>
                            <td className={tdCls + ' text-nemo-bg/60 text-xs max-w-xs truncate'}>{city.context}</td>
                            <td className={tdCls + ' text-nemo-bg/60'}>{city.order}</td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditCity(city)} title="Modifier" className="w-8 h-8 rounded-lg bg-nemo-blue/10 text-nemo-blue hover:bg-nemo-blue hover:text-white flex items-center justify-center transition-all">
                                  <Pencil size={13} />
                                </button>
                                <button onClick={() => setDeleteTarget({ id: city._id, label: city.name, type: 'cities' })} title="Supprimer" className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
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

              {/* ── MEDIA ── */}
              {section === 'media' && (
                <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MediaLibrary token={token} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {deleteTarget && (
        <DeleteModal
          label={deleteTarget.label}
          confirmPhrase={CONFIRM_PHRASES[deleteTarget.type]}
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
      {editClient && (
        <ClientForm
          client={editClient === 'new' ? undefined : editClient}
          token={token}
          onSave={() => { setEditClient(null); load(); }}
          onCancel={() => setEditClient(null)}
        />
      )}
      {editTestimonial && (
        <TestimonialForm
          testimonial={editTestimonial === 'new' ? undefined : editTestimonial}
          token={token}
          onSave={() => { setEditTestimonial(null); load(); }}
          onCancel={() => setEditTestimonial(null)}
        />
      )}
      {editCity && (
        <CityForm
          city={editCity === 'new' ? undefined : editCity}
          token={token}
          onSave={() => { setEditCity(null); load(); }}
          onCancel={() => setEditCity(null)}
        />
      )}
    </div>
  );
}
