const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  type: { type: String, enum: ['website', 'facebook', 'instagram', 'linkedin', 'twitter', 'other'], default: 'website' },
  url: { type: String, required: true },
}, { _id: false });

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String }, // image path/url
  logoAlt: { type: String, default: '' },
  links: [linkSchema],
  description: { type: String, default: '' }, // HTML depuis TipTap
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
