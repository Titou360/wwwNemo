const mongoose = require('mongoose');

// Connexion Mongoose mise en cache entre les invocations.
// Indispensable en serverless (Vercel) pour éviter d'ouvrir une connexion par requête.
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI manquant');

    const opts = {};
    // Contournement TLS pour le dev local derrière un antivirus/pare-feu
    // qui inspecte le HTTPS (« unable to verify the first certificate »).
    // À n'activer QUE en local via backend/.env — jamais en production.
    if (process.env.DEV_TLS_INSECURE === 'true') {
      opts.tlsAllowInvalidCertificates = true;
    }

    cached.promise = mongoose.connect(uri, opts).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
