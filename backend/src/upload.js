const multer = require('multer');
const crypto = require('crypto');
const Media = require('./models/Media');

// Upload en mémoire (pas de disque — compatible serverless).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seules les images sont acceptées'));
  },
});

// Enregistre un fichier uploadé comme document Media (base64 dans MongoDB)
// et renvoie l'URL à stocker dans l'entité (article.image / client.logo).
async function saveMedia(file, category) {
  const ext = (file.originalname.split('.').pop() || 'png').toLowerCase();
  const filename = `${category}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  await Media.create({ filename, dataUri, mimetype: file.mimetype, size: file.size, category });
  return `/api/media/file/${filename}`;
}

// Supprime le document Media référencé par une URL /api/media/file/<filename>.
async function deleteMediaByUrl(url) {
  if (!url) return;
  const match = /\/api\/media\/file\/([^/?#]+)$/.exec(url);
  if (!match) return; // URL externe (ex. ancienne image Cloudinary) : on ne touche pas
  await Media.deleteOne({ filename: decodeURIComponent(match[1]) }).catch(() => {});
}

module.exports = { upload, saveMedia, deleteMediaByUrl };
