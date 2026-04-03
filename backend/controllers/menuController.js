const Menu = require('../models/Menu');

// @desc    Get all menu
// @route   GET /api/menu
// @access  Public
const getMenus = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'semua') {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const menus = await Menu.find(filter).sort({ createdAt: -1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data menu', error: err.message });
  }
};

// @desc    Get single menu
// @route   GET /api/menu/:id
// @access  Public
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data menu', error: err.message });
  }
};

// @desc    Create menu
// @route   POST /api/menu
// @access  Petugas/Admin
const createMenu = async (req, res) => {
  try {
    console.log("BODY MENU:", req.body);
    console.log("FILE:", req.file);

    const { name, price, category, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Nama, harga, dan kategori wajib diisi' });
    }

    const imageUrl = req.file ? req.file.path : '';

    const menu = await Menu.create({
      name,
      price: Number(price),
      category,
      description: description || '',
      image: imageUrl,
    });

    res.status(201).json({ message: 'Menu berhasil ditambahkan', menu });
  } catch (err) {
    console.error("MENU ERROR:", err); // 🔥 penting banget
    res.status(500).json({ message: 'Gagal menambahkan menu', error: err.message });
  }
};

// @desc    Update menu
// @route   PUT /api/menu/:id
// @access  Petugas/Admin
const updateMenu = async (req, res) => {
  try {
    const { name, price, category, description, isAvailable } = req.body;
    const menu = await Menu.findById(req.params.id);

    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });

    menu.name = name || menu.name;
    menu.price = price ? Number(price) : menu.price;
    menu.category = category || menu.category;
    menu.description = description !== undefined ? description : menu.description;
    menu.isAvailable = isAvailable !== undefined ? isAvailable : menu.isAvailable;

    if (req.file) {
      menu.image = req.file.path;
    }

    await menu.save();
    res.json({ message: 'Menu berhasil diupdate', menu });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate menu', error: err.message });
  }
};

// @desc    Delete menu
// @route   DELETE /api/menu/:id
// @access  Petugas/Admin
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus menu', error: err.message });
  }
};

module.exports = { getMenus, getMenuById, createMenu, updateMenu, deleteMenu };
