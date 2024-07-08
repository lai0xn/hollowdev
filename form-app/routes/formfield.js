const express = require('express');
const FormField = require('../models/FormFieldModel');
const Form = require('../models/FormModel');
const authMiddleware = require('../middlewares/authMiddlware');
const logger = require('../utils/logger');
const router = express.Router();

router.post('/:formId', authMiddleware, async (req, res) => {
  try {
    logger.info('Creating new form field');
    logger.info('Checking for missing fields');
    if (!req.params.formId) {
      logger.error('Form ID is required');
      return res.status(400).send({ error: 'Form ID is required' });
    }
    logger.info('Form ID provided');

    logger.info('Finding form');
    const form = await Form.findById(req.params.formId);
    if (!form) {
      logger.error('Form not found');
      return res.status(404).send({ error: 'Form not found' });
    }
    logger.info('Form found');

    logger.info('Checking if user is the owner of the form');
    if (form.owner.toString() !== req.user._id.toString()) {
      logger.error('Unauthorized');
      return res.status(401).send({ error: 'Unauthorized' });
    }
    logger.info('User is the owner of the form');

    logger.info('Creating new form field');
    const formField = new FormField({
      ...req.body,
      formId: form._id
    });

    logger.info('Saving form field');
    await formField.save();

    // Add the field to the form fields 
    logger.info('Adding field to form');
    form.fields.push(formField._id);
    logger.info('Saving form');
    await form.save();

    logger.info('Form field created successfully');
    res.status(201).send(formField);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
