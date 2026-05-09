const bookingService = require('../services/bookingService');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('http-status-codes');

const createBooking = asyncHandler(async (req, res) => {
  const io = req.app.get('socketio');
  const booking = await bookingService.createBooking(req.body, io);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
});

const getBookingsByEmail = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getBookingsByEmail(req.query.email);
  res.status(httpStatus.OK).json({
    success: true,
    data: bookings
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
  res.status(httpStatus.OK).json({
    success: true,
    message: `Booking status updated to ${req.body.status}`,
    data: booking
  });
});

const getBookedSlots = asyncHandler(async (req, res) => {
  const slots = await bookingService.getBookedSlots(req.params.expertId, req.query.date);
  res.status(httpStatus.OK).json({
    success: true,
    data: slots
  });
});

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
  getBookedSlots
};
