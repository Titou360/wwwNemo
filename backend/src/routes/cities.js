const router = require('express').Router();
const City = require('../models/City');
const auth = require('../middleware/auth');

// GET /api/cities — public
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().sort({ order: 1, name: 1 }).lean();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cities — auth
router.post('/', auth, async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/cities/:id — auth
router.put('/:id', auth, async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!city) return res.status(404).json({ message: 'Ville introuvable' });
    res.json(city);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/cities/:id — auth
router.delete('/:id', auth, async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: 'Ville introuvable' });
    res.json({ message: 'Ville supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
