const mongoose = require('mongoose');
const bookingRepository = require('../repositories/bookingRepository');
const expertRepository = require('../repositories/expertRepository');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');

class BookingService {
  async createBooking(bookingData, io) {
    const { expert, date, timeSlot } = bookingData;

    // Verify expert exists
    const expertExists = await expertRepository.findById(expert);
    if (!expertExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }

    // Start a session for transaction (Optional, but compound index is usually enough)
    // For local MongoDB without replica set, we use atomic operations or unique index.
    // The unique index in Booking.js handles the race condition.
    
    try {
      const booking = await bookingRepository.create(bookingData);
      
      // Emit real-time update
      if (io) {
        io.to(`expert_${expert}`).emit('slot_booked', {
          expertId: expert,
          date,
          timeSlot
        });
      }

      return booking;
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(httpStatus.CONFLICT, 'This slot has already been booked by another user');
      }
      throw error;
    }
  }

  async getBookingsByEmail(email) {
    if (!email) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');
    }
    return await bookingRepository.findByEmail(email);
  }

  async getBookedSlots(expertId, date) {
    if (!date) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Date is required');
    }
    const slots = await bookingRepository.findBookedSlots(expertId, date);
    return slots.map(s => s.timeSlot);
  }

  async updateBookingStatus(id, status) {
    const booking = await bookingRepository.updateStatus(id, status);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
  }
}

module.exports = new BookingService();
