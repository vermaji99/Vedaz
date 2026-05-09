const Expert = require('../models/Expert');

class ExpertRepository {
  async findAll({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } }) {
    const experts = await Expert.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Expert.countDocuments(filter);
    return { experts, total };
  }

  async findById(id) {
    return await Expert.findById(id);
  }

  async create(data) {
    return await Expert.create(data);
  }

  async update(id, data) {
    return await Expert.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Expert.findByIdAndDelete(id);
  }
}

module.exports = new ExpertRepository();
