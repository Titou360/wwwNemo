import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Identifiants incorrects');
      localStorage.setItem('nemo-admin-token', data.token);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nemo-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/NemoSolutions.png"
            alt="Nemo Solutions"
            className="h-12 mx-auto mb-4 brightness-0 invert"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="font-syne font-bold text-2xl text-white mb-1">
            Administration
          </h1>
          <p className="font-jakarta text-nemo-bg/50 text-sm">
            Accès réservé à Nemo Solutions
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-nemo-dark-surface rounded-2xl p-8 border border-nemo-dark-border"
          aria-label="Formulaire de connexion administrateur"
        >
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="admin-email" className="block font-jakarta text-sm text-nemo-bg/80 mb-1.5 font-medium">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nemo-bg/40 pointer-events-none" aria-hidden="true" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="clement@nemosolutions.fr"
                className="w-full pl-10 pr-4 py-3 bg-nemo-dark-bg border border-nemo-dark-border rounded-xl text-nemo-bg font-jakarta text-sm placeholder:text-nemo-bg/20 focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="admin-password" className="block font-jakarta text-sm text-nemo-bg/80 mb-1.5 font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nemo-bg/40 pointer-events-none" aria-hidden="true" />
              <input
                id="admin-password"
                type={showPwd ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-nemo-dark-bg border border-nemo-dark-border rounded-xl text-nemo-bg font-jakarta text-sm placeholder:text-nemo-bg/20 focus:outline-none focus:border-nemo-orange focus:ring-2 focus:ring-nemo-orange/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-nemo-bg/40 hover:text-nemo-bg transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-jakarta mb-4">
              <AlertCircle size={14} aria-hidden="true" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center"
            aria-label={loading ? 'Connexion en cours...' : 'Se connecter'}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
