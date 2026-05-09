const expertService = require('../services/expertService');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('http-status-codes');

const getExperts = asyncHandler(async (req, res) => {
  const result = await expertService.getExperts(req.query);
  res.status(httpStatus.OK).json({
    success: true,
    data: result.experts,
    pagination: result.pagination
  });
});

const getExpertById = asyncHandler(async (req, res) => {
  const expert = await expertService.getExpertById(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    data: expert
  });
});

const createExpert = asyncHandler(async (req, res) => {
  const expert = await expertService.createExpert(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    data: expert
  });
});

module.exports = {
  getExperts,
  getExpertById,
  createExpert
};
