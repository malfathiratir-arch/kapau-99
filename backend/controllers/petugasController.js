const User = require('../models/User');

// @desc    Get all petugas
// @route   GET /api/petugas
// @access  Admin
const getAllPetugas = async (req, res) => {
  try {
    const petugas = await User.find({ role: 'petugas' }).select('-password').sort({ createdAt: -1 });
    res.json(petugas);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data petugas', error: err.message });
  }
};

// @desc    Delete petugas
// @route   DELETE /api/petugas/:id
// @access  Admin
const deletePetugas = async (req, res) => {
  try {
    const petugas = await User.findById(req.params.id);

    if (!petugas) {
      return res.status(404).json({ message: 'Petugas tidak ditemukan' });
    }

    if (petugas.role !== 'petugas') {
      return res.status(400).json({ message: 'User ini bukan petugas' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Petugas berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus petugas', error: err.message });
  }
};

module.exports = { getAllPetugas, deletePetugas };
