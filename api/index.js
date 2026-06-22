// Point d'entrée serverless Vercel : réexpose l'app Express complète.
// Toutes les requêtes /api/* sont gérées par cette fonction unique.
module.exports = require('../backend/src/app');
