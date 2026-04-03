const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Token tidak valid.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah expired.' });
  }
};

// Admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang bisa mengakses.' });
  }
  next();
};

// Petugas & Admin
const staffOnly = (req, res, next) => {
  if (!['petugas', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak. Hanya petugas dan admin.' });
  }
  next();
};

module.exports = { protect, adminOnly, staffOnly };
