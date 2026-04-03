const express = require('express');
const router = express.Router();
const { getMenus, getMenuById, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { protect, staffOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getMenus);
router.get('/:id', getMenuById);
router.post('/', protect, staffOnly, upload.single('image'), createMenu);
router.put('/:id', protect, staffOnly, upload.single('image'), updateMenu);
router.delete('/:id', protect, staffOnly, deleteMenu);

module.exports = router;
