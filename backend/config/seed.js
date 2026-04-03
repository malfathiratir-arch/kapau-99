const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Menu = require('../models/Menu');

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kapau99');
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Menu.deleteMany({});

  // Create users
  const hashedPw = await bcrypt.hash('password123', 10);

  await User.insertMany([
    { name: 'Admin Kapau', email: 'admin@kapau99.com', password: hashedPw, role: 'admin' },
    { name: 'Petugas Satu', email: 'petugas@kapau99.com', password: hashedPw, role: 'petugas' },
    { name: 'Budi Santoso', email: 'user@kapau99.com', password: hashedPw, role: 'user' },
  ]);

  // Create menu items
  await Menu.insertMany([
    {
      name: 'Rendang Daging Sapi',
      price: 35000,
      category: 'makanan',
      description: 'Rendang daging sapi empuk dengan bumbu rempah khas Minang yang kaya rasa',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',
    },
    {
      name: 'Ayam Pop',
      price: 28000,
      category: 'makanan',
      description: 'Ayam goreng khas Padang yang lembut dan gurih, disajikan dengan sambal hijau',
      image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop',
    },
    {
      name: 'Gulai Ikan Mas',
      price: 32000,
      category: 'makanan',
      description: 'Ikan mas segar dalam kuah gulai santan yang kental dan harum',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
    },
    {
      name: 'Dendeng Balado',
      price: 30000,
      category: 'makanan',
      description: 'Irisan daging tipis digoreng kering dengan bumbu balado pedas yang menggugah selera',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
    },
    {
      name: 'Sate Padang',
      price: 25000,
      category: 'makanan',
      description: '10 tusuk sate daging sapi dengan saus kacang khas Padang yang autentik',
      image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop',
    },
    {
      name: 'Sayur Cubadak',
      price: 15000,
      category: 'makanan',
      description: 'Gulai nangka muda dengan kuah santan berbumbu rempah pilihan',
      image: 'https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=400&h=300&fit=crop',
    },
    {
      name: 'Nasi Putih',
      price: 5000,
      category: 'nasi',
      description: 'Nasi putih pulen dan hangat, cocok dipadukan dengan lauk apapun',
      image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    },
    {
      name: 'Nasi Padang Komplit',
      price: 50000,
      category: 'nasi',
      description: 'Nasi putih dengan rendang, gulai, sayur, dan sambal - porsi lengkap',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    },
    {
      name: 'Es Teh Manis',
      price: 8000,
      category: 'minuman',
      description: 'Teh manis segar disajikan dengan es batu, minuman klasik yang menyegarkan',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    },
    {
      name: 'Es Jeruk',
      price: 10000,
      category: 'minuman',
      description: 'Perasan jeruk segar dengan es batu, kaya vitamin C dan menyegarkan',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
    },
    {
      name: 'Air Mineral',
      price: 5000,
      category: 'minuman',
      description: 'Air mineral botol 600ml, segar dan menyehatkan',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
    },
    {
      name: 'Jus Alpukat',
      price: 18000,
      category: 'minuman',
      description: 'Jus alpukat creamy dengan susu dan sirup cokelat, minuman favorit semua',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
    },
  ]);

  console.log('✅ Seed data berhasil dibuat!');
  console.log('📧 Admin: admin@kapau99.com / password123');
  console.log('📧 Petugas: petugas@kapau99.com / password123');
  console.log('📧 User: user@kapau99.com / password123');
  process.exit(0);
};

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});
