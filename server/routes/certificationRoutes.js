const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certificationController');

const router = express.Router();
router.use(protect);

const certValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('issuer').trim().notEmpty().withMessage('Issuer is required'),
  body('issueDate').notEmpty().withMessage('Issue date is required').isISO8601().toDate(),
];

router
  .route('/')
  .get(getCertifications)
  .post(upload.single('file'), certValidation, validate, createCertification);

router
  .route('/:id')
  .put(upload.single('file'), certValidation, validate, updateCertification)
  .delete(deleteCertification);

module.exports = router;
