const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  avatar: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  text: { type: String, required: true },
  source: {
    type: String,
    enum: ['', 'google', 'linkedin', 'facebook', 'instagram', 'malt', 'fiverr'],
    default: '',
  },
  reviewDate: { type: String, default: '' }, // format "YYYY-MM"
  published: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
