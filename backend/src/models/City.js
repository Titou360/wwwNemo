const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  slug:    { type: String, required: true, unique: true, lowercase: true },
  dept:    { type: String, required: true, trim: true },
  context: { type: String, required: true, trim: true },
  order:   { type: Number, default: 0 },
}, { timestamps: true });

// Auto-génère le slug depuis le nom si absent
citySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('City', citySchema);
