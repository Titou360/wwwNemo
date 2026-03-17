require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
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

    // Seed admin if none exists
    const Admin = require('./models/Admin');
    const count = await Admin.countDocuments();
    if (count === 0) {
const admin = new Admin({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  name: 'Clément FELICES',
});
await admin.save();
      console.log('✅ Admin créé :', process.env.ADMIN_EMAIL);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Erreur démarrage :', err.message);
    process.exit(1);
  }
}

start();
