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

router.patch('/:formId/:fieldId', authMiddleware, async (req, res) => {
  try {
    logger.info('Updating form field');
    logger.info('Checking for missing fields');
    if (!req.params.formId || !req.params.fieldId) {
      logger.error('Form ID and Field ID are required');
      return res.status(400).send({ error: 'Form ID and Field ID are required' });
    }
    logger.info('Form ID and Field ID provided');

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

    logger.info('Finding form field');
    const formField = await FormField.findById(req.params.fieldId);
    if (!formField) {
      logger.error('Form field not found');
      return res.status(404).send({ error: 'Form field not found' });
    }
    logger.info('Form field found');

    logger.info('Updating form field');
    Object.keys(req.body).forEach((key) => {
      formField[key] = req.body[key];
    });

    logger.info('Saving form field');
    await formField.save();

    logger.info('Form field updated successfully');
    res.send(formField);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.delete('/:formId/:fieldId', authMiddleware, async (req, res) => {

  try {
    logger.info('Deleting form field');
    logger.info('Checking for missing fields');
    if (!req.params.formId || !req.params.fieldId) {
      logger.error('Form ID and Field ID are required');
      return res.status(400).send({ error: 'Form ID and Field ID are required' });
    }
    logger.info('Form ID and Field ID provided');

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

    logger.info('Finding form field');
    const formField = await FormField.findById(req.params.fieldId);
    if (!formField) {
      logger.error('Form field not found');
      return res.status(404).send({ error: 'Form field not found' });
    }
    logger.info('Form field found');

    logger.info('Deleting form field');
    await FormField.deleteOne({ _id: formField._id });

    logger.info('Removing field from form');
    form.fields = form.fields.filter((field) => field.toString() !== formField._id.toString());
    logger.info('Saving form');
    await form.save();

    logger.info('Form field deleted successfully');
    res.send(formField);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
module.exports = router;
