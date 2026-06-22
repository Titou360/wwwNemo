require('dotenv').config();

const app = require('./app');
const connectDB = require('./db');
const seed = require('./seed');

// Entrée pour le développement local (non utilisée en serverless sur Vercel).
async function start() {
  try {
    await connectDB();
    console.log('✅ MongoDB connecté');

    await seed();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Erreur démarrage :', err.message);
    process.exit(1);
  }
}

start();
