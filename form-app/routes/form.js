const express = require('express');
const Form = require('../models/FormModel');
const FormField = require('../models/FormFieldModel');
const Response = require('../models/ResponseModel');
const authMiddleware = require('../middlewares/authMiddlware');
const router = express.Router();

// Create a new form
router.post('/', authMiddleware, async (req, res) => {
  try {
    const form = new Form({
      ...req.body,
      owner: req.user._id
    });
    console.log(form);
    await form.save();
    res.status(201).send(form);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all forms
router.get('/', authMiddleware, async (req, res) => {
  // get all forms of a user so based on the owner id we can get the forms
  try {
    const forms = await Form.find({ owner: req.user._id });
    res.send(forms);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get a form responses
router.get('/forms/:id/responses?type', authMiddleware, async (req, res) => {
  // there are two types of form response :
  //  1. response based on each question
  //  2. response based on each user
  //  so based on the type we can get the response
  //  if type is question then we will get the response based on each question
  //  if type is user then we will get the response based on each user
  //  if type is not provided then we will get the response based on each question

  const { type } = req.query;
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).send();
    }

    let responses;
    if (type === 'individual') {
      // Fetch responses based on each individual user
      responses = await getResponsesByUser(form._id);
    } else {
      // Default to fetching responses based on each question
      responses = await getResponsesByQuestion(form._id);
    }

    res.send(responses);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get a form
router.get('/forms/:id', authMiddleware, async (req, res) => {
  // get a form based on the id
});

// Get a form but no need to be authenticated (a form where the user can respond without being authenticated)
// this is used when it is not needed to be authenticated to respond to a form
router.get('/forms/:id', async (req, res) => {
  // get a form based on the id
});
// Update a form
router.patch('/forms/:id', authMiddleware, async (req, res) => { });

// Delete a form
router.delete('/forms/:id', authMiddleware, async (req, res) => { });

// Add a response to a form
// this is used when it is not needed to be authenticated to respond to a form
router.post('/forms/:id/add-response', async (req, res) => { });


module.exports = router;



// Functions to fetch responses
async function getResponsesByUser(formId) {
  // for each user we will get the response
  // so we will return a list of each user and their responses

  // get all responses for the form
  const responses = await Response.find({ formId });

  // group responses by user
  const responsesByUser = {};
  responses.forEach((response) => {
    if (!responsesByUser[response._id]) {
      responsesByUser[response._id] = [];
    }
    responsesByUser[response._id].push(response);
  });

  return responsesByUser;
}

// Function to fetch responses based on each question
async function getResponsesByQuestion(formId) {
  // for each question we will get the response
  // so we will return a list of each question and their responses

  // get all responses for the form
  const responses = await Response.find({ formId });

  // group responses by question
  const responsesByQuestion = {};
  responses.forEach((response) => {
    if (!responsesByQuestion[response.fieldId]) {
      responsesByQuestion[response.fieldId] = [];
    }
    responsesByQuestion[response.fieldId].push(response);
  });

  return responsesByQuestion;
}
