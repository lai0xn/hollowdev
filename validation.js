const { body, validationResult } = require('express-validator');

const characterValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('level').isInt({ min: 1, max: 100 }).optional().withMessage('Level must be an integer between 1 and 100'),
    body('hp').isFloat({ min: 0, max: 1000 }).optional().withMessage('HP must be between 0 and 1000'),
    body('attributes.strength').isInt({ min: 1, max: 10 }).optional().withMessage('Strength must be an integer between 1 and 10'),
    body('attributes.agility').isInt({ min: 1, max: 10 }).optional().withMessage('Agility must be an integer between 1 and 10'),
    body('attributes.intelligence').isInt({ min: 1, max: 10 }).optional().withMessage('Intelligence must be an integer between 1 and 10'),
    body('attributes.endurance').isInt({ min: 1, max: 10 }).optional().withMessage('Endurance must be an integer between 1 and 10'),

  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  characterValidationRules,
  validate,
};
