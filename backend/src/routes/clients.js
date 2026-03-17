const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'client-' + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// GET /api/clients - public
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find({ featured: true }).sort({ order: 1 }).lean();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/clients/admin - all
router.get('/admin', auth, async (req, res) => {
  try {
    const clients = await Client.find().sort({ order: 1 }).lean();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('logo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo = '/uploads/' + req.file.filename;
    if (typeof data.links === 'string') data.links = JSON.parse(data.links);
    const client = new Client(data);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('logo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo = '/uploads/' + req.file.filename;
    if (typeof data.links === 'string') data.links = JSON.parse(data.links);
    const client = await Client.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!client) return res.status(404).json({ message: 'Client introuvable' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
