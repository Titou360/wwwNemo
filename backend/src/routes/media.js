const router = require('express').Router();
const auth = require('../middleware/auth');
const Media = require('../models/Media');

// GET /api/media/file/:filename — sert l'image (public, utilisé dans les <img>)
router.get('/file/:filename', async (req, res) => {
  try {
    const media = await Media.findOne({ filename: req.params.filename }).lean();
    if (!media) return res.status(404).json({ message: 'Fichier introuvable' });
    const match = /^data:(.+?);base64,(.*)$/s.exec(media.dataUri);
    if (!match) return res.status(500).json({ message: 'Donnée image invalide' });
    res.set('Content-Type', match[1]);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(match[2], 'base64'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/media — liste les médias (auth)
router.get('/', auth, async (req, res) => {
  try {
    const medias = await Media.find().sort({ createdAt: -1 }).lean();
    res.json(medias.map(m => ({
      filename: m.filename,
      url: `/api/media/file/${m.filename}`,
      size: m.size,
      createdAt: m.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/media/:filename — supprime un média (auth)
router.delete('/:filename', auth, async (req, res) => {
  try {
    const result = await Media.deleteOne({ filename: req.params.filename });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Fichier introuvable' });
    }
    res.json({ message: 'Fichier supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
