const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getBookingsByEmail, 
  updateBookingStatus,
  getBookedSlots 
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getBookingsByEmail);
router.patch('/:id/status', updateBookingStatus);
router.get('/slots/:expertId', getBookedSlots);

module.exports = router;
