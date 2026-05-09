const Booking = require('../models/Booking');

class BookingRepository {
  async create(data, session = null) {
    const booking = new Booking(data);
    return await booking.save({ session });
  }

  async findOne(query) {
    return await Booking.findOne(query);
  }

  async findByEmail(email) {
    return await Booking.find({ userEmail: email.toLowerCase() })
      .populate('expert', 'name category profileImage')
      .sort({ createdAt: -1 });
  }

  async findBookedSlots(expertId, date) {
    return await Booking.find({ 
      expert: expertId, 
      date, 
      status: { $ne: 'Cancelled' } 
    }).select('timeSlot');
  }

  async updateStatus(id, status) {
    return await Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }

  async findById(id) {
    return await Booking.findById(id).populate('expert');
  }
}

module.exports = new BookingRepository();
