const express = require('express');
const Form = require('../models/FormModel');
const authMiddleware = require('../middlewares/authMiddlware');
const router = express.Router();

// Create a new form
router.post('/add', authMiddleware, async (req, res) => {
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


module.exports = router;
