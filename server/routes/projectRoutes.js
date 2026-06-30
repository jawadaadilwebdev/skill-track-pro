const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();
router.use(protect);

const projectValidation = [body('title').trim().notEmpty().withMessage('Project title is required')];

router.route('/').get(getProjects).post(projectValidation, validate, createProject);
router
  .route('/:id')
  .get(getProject)
  .put(projectValidation, validate, updateProject)
  .delete(deleteProject);

module.exports = router;
