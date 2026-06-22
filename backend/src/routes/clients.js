const router = require('express').Router();
const { upload, saveMedia, deleteMediaByUrl } = require('../upload');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

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
    if (req.file) data.logo = await saveMedia(req.file, 'clients');
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
    if (req.file) data.logo = await saveMedia(req.file, 'clients');
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
    const client = await Client.findByIdAndDelete(req.params.id);
    await deleteMediaByUrl(client?.logo);
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
