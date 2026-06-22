const connectDB = require('./db');
const City = require('./models/City');
const Admin = require('./models/Admin');

// Crée les données initiales si la base est vide (idempotent).
async function seed() {
  await connectDB();

  // ── Villes par défaut ──────────────────────────────────────────────────────
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
  } else {
    console.log('ℹ️ Villes déjà présentes :', cityCount);
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: 'Clément FELICES',
    });
    await admin.save();
    console.log('✅ Admin créé :', process.env.ADMIN_EMAIL);
  } else {
    console.log('ℹ️ Admin déjà existant :', adminCount);
  }
}

module.exports = seed;

// Exécution directe : `node src/seed.js`
if (require.main === module) {
  require('dotenv').config();
  seed()
    .then(() => { console.log('🌱 Seed terminé'); process.exit(0); })
    .catch((err) => { console.error('❌ Seed échoué :', err.message); process.exit(1); });
}
