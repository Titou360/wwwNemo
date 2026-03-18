import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';

const SUBJECTS = [
  'Création de site internet',
  'Référencement SEO',
  'Réseaux sociaux',
  'Dépannage informatique',
  'Conseil digital',
  'Demande de devis',
  'Autre',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // TODO: integrate EmailJS
    // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY')
    // Simulation
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contactez-nous — Nemo Solutions</title>
        <meta name="description" content="Contactez Nemo Solutions pour votre projet digital. Création de site internet, SEO, réseaux sociaux. Basé à Belin-Béliet, Val de l'Eyre. Réponse sous 24h." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="min-h-screen bg-nemo-bg dark:bg-nemo-dark-bg pt-28 pb-20">
        <div className="container-nemo">
          <Breadcrumb crumbs={[{ label: 'Contact' }]} />
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-nemo-orange/10 text-nemo-orange text-sm font-jakarta font-semibold mb-4 border border-nemo-orange/20">
              On vous répond sous 24h
            </span>
            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-nemo-dark-bg dark:text-nemo-bg mb-4">
              Contactez <span className="text-nemo-orange">Nemo Solutions</span>
            </h1>
            <p className="font-jakarta text-nemo-dark-bg/60 dark:text-nemo-bg/60 text-lg max-w-xl mx-auto">
              Une question, un projet, un devis ? Décrivez-nous votre besoin et nous vous répondons rapidement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
              aria-label="Coordonnées"
            >
              {[
                { icon: Phone, label: 'Téléphone', value: '06 21 14 58 88', href: 'tel:+33621145888', ariaLabel: 'Appeler le 06 21 14 58 88' },
                { icon: Mail, label: 'Email', value: 'clement@nemosolutions.fr', href: 'mailto:clement@nemosolutions.fr', ariaLabel: 'Envoyer un email' },
                { icon: MapPin, label: 'Adresse', value: '29 Av. des Pins\n33830 Belin-Béliet', href: undefined, ariaLabel: undefined },
                { icon: Clock, label: 'Disponibilité', value: 'Lun–Ven : 9h–19h\nUrgences sur rendez-vous', href: undefined, ariaLabel: undefined },
              ].map(({ icon: Icon, label, value, href, ariaLabel }) => (
                <div key={label} className="card-nemo p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-nemo-orange/10 flex items-center justify-center text-nemo-orange shrink-0" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-syne font-bold text-sm text-nemo-dark-bg dark:text-nemo-bg mb-1">{label}</p>
                    {href ? (
                      <a href={href} aria-label={ariaLabel} className="font-jakarta text-sm text-nemo-dark-bg/70 dark:text-nemo-bg/70 hover:text-nemo-orange transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-jakarta text-sm text-nemo-dark-bg/70 dark:text-nemo-bg/70 whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.aside>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="card-nemo p-8">
                {status === 'success' ? (
                  <div className="text-center py-10">
                    <CheckCircle size={56} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
                    <h2 className="font-syne font-bold text-2xl text-nemo-dark-bg dark:text-nemo-bg mb-2">
                      Message envoyé !
                    </h2>
                    <p className="font-jakarta text-nemo-dark-bg/70 dark:text-nemo-bg/70">
                      Merci pour votre message. Nous vous répondons sous 24h.
                    </p>
                    <button onClick={() => setStatus('idle')} className="btn-primary mt-6">
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate aria-label="Formulaire de contact">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="name" className="block font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-bg mb-1.5">
                          Nom complet <span aria-hidden="true" className="text-nemo-orange">*</span>
                          <span className="sr-only">(obligatoire)</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Jean Dupont"
                          className="w-full px-4 py-3 rounded-xl border border-nemo-dark-bg/10 dark:border-nemo-bg/10 bg-white/60 dark:bg-nemo-dark-surface/60 font-jakarta text-sm text-nemo-dark-bg dark:text-nemo-bg placeholder:text-nemo-dark-bg/30 dark:placeholder:text-nemo-bg/30 focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-bg mb-1.5">
                          Email <span aria-hidden="true" className="text-nemo-orange">*</span>
                          <span className="sr-only">(obligatoire)</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jean@exemple.fr"
                          className="w-full px-4 py-3 rounded-xl border border-nemo-dark-bg/10 dark:border-nemo-bg/10 bg-white/60 dark:bg-nemo-dark-surface/60 font-jakarta text-sm text-nemo-dark-bg dark:text-nemo-bg placeholder:text-nemo-dark-bg/30 dark:placeholder:text-nemo-bg/30 focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-bg mb-1.5">
                          Téléphone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="06 00 00 00 00"
                          className="w-full px-4 py-3 rounded-xl border border-nemo-dark-bg/10 dark:border-nemo-bg/10 bg-white/60 dark:bg-nemo-dark-surface/60 font-jakarta text-sm text-nemo-dark-bg dark:text-nemo-bg placeholder:text-nemo-dark-bg/30 dark:placeholder:text-nemo-bg/30 focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-bg mb-1.5">
                          Sujet <span aria-hidden="true" className="text-nemo-orange">*</span>
                          <span className="sr-only">(obligatoire)</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-nemo-dark-bg/10 dark:border-nemo-bg/10 bg-white/60 dark:bg-nemo-dark-surface/60 font-jakarta text-sm text-nemo-dark-bg dark:text-nemo-bg focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
                        >
                          <option value="">Choisissez un sujet</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block font-jakarta font-semibold text-sm text-nemo-dark-bg dark:text-nemo-bg mb-1.5">
                        Message <span aria-hidden="true" className="text-nemo-orange">*</span>
                        <span className="sr-only">(obligatoire)</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre projet ou votre question..."
                        className="w-full px-4 py-3 rounded-xl border border-nemo-dark-bg/10 dark:border-nemo-bg/10 bg-white/60 dark:bg-nemo-dark-surface/60 font-jakarta text-sm text-nemo-dark-bg dark:text-nemo-bg placeholder:text-nemo-dark-bg/30 dark:placeholder:text-nemo-bg/30 focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-jakarta mb-4">
                        <AlertCircle size={16} aria-hidden="true" />
                        Une erreur s'est produite. Veuillez réessayer ou nous appeler directement.
                      </div>
                    )}

                    <p className="font-jakarta text-xs text-nemo-dark-bg/40 dark:text-nemo-bg/40 mb-4">
                      En soumettant ce formulaire, vous acceptez notre{' '}
                      <a href="/politique-de-confidentialite" className="underline hover:text-nemo-orange transition-colors">
                        politique de confidentialité
                      </a>.
                    </p>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full sm:w-auto"
                      aria-label={status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send size={16} aria-hidden="true" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
