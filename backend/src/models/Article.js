const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true }, // HTML from Gutenberg-like editor
  excerpt: { type: String },
  image: { type: String }, // URL or path
  imageAlt: { type: String, default: '' },
  tag: { type: String, trim: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
}, { timestamps: true });

// Auto-generate slug from title if not provided
articleSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
