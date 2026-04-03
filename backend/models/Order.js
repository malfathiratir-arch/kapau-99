const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  note: { type: String, default: '' },
  image: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: [true, 'Nama pelanggan wajib diisi'],
  },
  address: {
    type: String,
    required: [true, 'Alamat wajib diisi'],
  },
  phone: {
    type: String,
    required: [true, 'Nomor HP wajib diisi'],
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'transfer', 'ewallet'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'diproses', 'selesai', 'dibatalkan'],
    default: 'pending',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
