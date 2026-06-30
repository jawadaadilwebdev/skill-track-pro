const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');

const router = express.Router();

router.use(protect); // all skill routes require authentication

const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('proficiency').optional().isInt({ min: 0, max: 100 }).withMessage('Proficiency must be 0-100'),
];

router.route('/').get(getSkills).post(skillValidation, validate, createSkill);
router.route('/:id').get(getSkill).put(skillValidation, validate, updateSkill).delete(deleteSkill);

module.exports = router;
