const expertRepository = require('../repositories/expertRepository');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');

class ExpertService {
  async getExperts(query) {
    const { page = 1, limit = 10, category, search } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const { experts, total } = await expertRepository.findAll({ 
      filter, 
      skip, 
      limit: parseInt(limit) 
    });

    return {
      experts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getExpertById(id) {
    const expert = await expertRepository.findById(id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    return expert;
  }

  async createExpert(data) {
    return await expertRepository.create(data);
  }
}

module.exports = new ExpertService();
