require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://www-nemo.vercel.app', 'https://nemosolutions.fr', 'https://www.nemosolutions.fr'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/media', require('./routes/media'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/contact', require('./routes/contact'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));

// ── Error handler ──────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne' });
});

// ── MongoDB + Start ──────────────────────────────────────────────────────────
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');

    // ── Seed villes si aucune en base ───────────────────────────────────────────
    const City = require('./models/City');
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      const defaultCities = [
        { name: 'Belin-Béliet',      slug: 'belin-beliet',      dept: 'Gironde',     context: "au cœur du Val de l'Eyre, en Gironde",     order: 1 },
        { name: 'Salles',            slug: 'salles',             dept: 'Gironde',     context: 'dans les Landes de Gascogne, en Gironde',    order: 2 },
        { name: 'Le Barp',           slug: 'le-barp',            dept: 'Gironde',     context: 'entre Bordeaux et Arcachon, en Gironde',     order: 3 },
        { name: 'Mios',              slug: 'mios',               dept: 'Gironde',     context: 'dans les Landes de Gascogne, en Gironde',    order: 4 },
        { name: 'Hostens',           slug: 'hostens',            dept: 'Gironde',     context: 'dans les Landes de Gascogne, en Gironde',    order: 5 },
        { name: 'Cestas',            slug: 'cestas',             dept: 'Gironde',     context: 'entre Bordeaux et Arcachon, en Gironde',     order: 6 },
        { name: 'Arcachon',          slug: 'arcachon',           dept: 'Gironde',     context: "sur le Bassin d'Arcachon, en Gironde",       order: 7 },
        { name: 'Saugnacq-et-Muret', slug: 'saugnacq-et-muret', dept: 'Les Landes',  context: 'au Nord des Landes',                         order: 8 },
      ];
      await City.insertMany(defaultCities);
      console.log('✅ Villes par défaut créées :', defaultCities.length);
    }

    // ── Admin ────────────────────────────────────────────────────────────────────
    const Admin = require('./models/Admin');
    const count = await Admin.countDocuments();
    console.log('📊 Admins en base:', count);

    if (count === 0) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Clément FELICES',
      });
      await admin.save();
      console.log('✅ Admin créé :', process.env.ADMIN_EMAIL);
    } else {
      console.log('ℹ️ Admin déjà existant');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Erreur démarrage :', err.message);
    process.exit(1);
  }
}

start();