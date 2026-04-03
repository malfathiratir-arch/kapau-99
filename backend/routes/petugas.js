const express = require('express');
const router = express.Router();
const { getAllPetugas, deletePetugas } = require('../controllers/petugasController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllPetugas);
router.delete('/:id', protect, adminOnly, deletePetugas);

module.exports = router;
