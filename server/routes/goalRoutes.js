const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

const router = express.Router();
router.use(protect);

const goalValidation = [body('title').trim().notEmpty().withMessage('Goal title is required')];

router.route('/').get(getGoals).post(goalValidation, validate, createGoal);
router.route('/:id').put(goalValidation, validate, updateGoal).delete(deleteGoal);

module.exports = router;
