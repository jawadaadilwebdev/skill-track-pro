const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  updateProfile,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getPlatformStats,
} = require('../controllers/userController');

const router = express.Router();
router.use(protect);

router.put('/profile', upload.single('avatar'), updateProfile);
router.get('/dashboard', getDashboardStats);

// Admin-only endpoints
router.get('/', authorize('admin'), getAllUsers);
router.get('/admin/stats', authorize('admin'), getPlatformStats);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
