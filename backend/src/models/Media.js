const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  dataUri:  { type: String, required: true }, // data:image/...;base64,....
  mimetype: { type: String, default: 'image/png' },
  size:     { type: Number, default: 0 },
  category: { type: String, default: '' },     // 'articles' | 'clients' | ...
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
