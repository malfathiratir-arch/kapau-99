const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama menu wajib diisi'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Harga wajib diisi'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Kategori wajib diisi'],
    enum: ['makanan', 'minuman', 'nasi'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
