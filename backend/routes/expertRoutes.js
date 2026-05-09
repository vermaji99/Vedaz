const express = require('express');
const router = express.Router();
const { getExperts, getExpertById, createExpert } = require('../controllers/expertController');

router.get('/', getExperts);
router.post('/', createExpert);
router.get('/:id', getExpertById);

module.exports = router;
