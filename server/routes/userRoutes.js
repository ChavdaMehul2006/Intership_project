const express = require('express');
const router = express.Router();
const {
  updateProfile,
  updatePassword,
  addAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist,
  getUsers,
  updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.get('/wishlist', protect, getWishlist);
router.put('/wishlist/:productId', protect, toggleWishlist);

router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
