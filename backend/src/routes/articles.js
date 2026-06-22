const router = require('express').Router();
const { upload, saveMedia, deleteMediaByUrl } = require('../upload');
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// GET /api/articles - public (published only)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ publishedAt: -1 })
      .lean();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/articles/admin - all (auth required)
router.get('/admin', auth, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).lean();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/articles/:slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true });
    if (!article) return res.status(404).json({ message: 'Article introuvable' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/articles (auth)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await saveMedia(req.file, 'articles');
    const article = new Article(data);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/articles/:id (auth)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await saveMedia(req.file, 'articles');
    const article = await Article.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'Article introuvable' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/articles/:id (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article introuvable' });
    await deleteMediaByUrl(article.image);
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
