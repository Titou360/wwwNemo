const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// GET /api/media — list all uploaded files
router.get('/', auth, (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) return res.json([]);
    const files = fs.readdirSync(UPLOADS_DIR)
      .filter(f => /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(f))
      .map(filename => {
        const stat = fs.statSync(path.join(UPLOADS_DIR, filename));
        return {
          filename,
          url: '/uploads/' + filename,
          size: stat.size,
          createdAt: stat.birthtime,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/media/:filename — delete a file
router.delete('/:filename', auth, (req, res) => {
  try {
    // Security: prevent path traversal
    const filename = path.basename(req.params.filename);
    const filepath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Fichier introuvable' });
    }
    fs.unlinkSync(filepath);
    res.json({ message: 'Fichier supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
