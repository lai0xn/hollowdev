const express = require("express");
const Form = require("../models/FormModel");
const FormField = require("../models/FormFieldModel");
const Response = require("../models/ResponseModel");
const authMiddleware = require("../middlewares/authMiddlware");
const router = express.Router();

// Create a new form
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fields, ...formDetails } = req.body;

    // Create a new form
    const form = new Form({
      ...formDetails,
      owner: req.user._id,
    });

    // Save the form
    await form.save();

    // Create form fields
    if (fields && fields.length > 0) {
      const formFields = fields.map((field) => {
        return new FormField({
          ...field,
          formId: form._id,
        });
      });

      // Save form fields
      await FormField.insertMany(formFields);
      form.fields = formFields.map((field) => field._id);

      // Save the form with the updated fields
      await form.save();

      res.status(201).send(form);
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all forms
router.get("/", authMiddleware, async (req, res) => {
  // get all forms of a user so based on the owner id we can get the forms
  try {
    const forms = await Form.find({ owner: req.user._id });
    res.send(forms);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get a form responses
router.get("/:id/responses", authMiddleware, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).send();
    }

    if (form.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized; not the owner of the form" });
    }
    // get all responses for the form
    const responses = await Response.find({ formId: form._id });
    res.send(responses);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get a form
router.get("/secure/:id", authMiddleware, async (req, res) => {
  // get a form based on the id
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized; not the owner of the form" });
    }

    const formFields = await FormField.find({ formId: form._id });
    form.fields = formFields;
    res.send(form);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get a form but no need to be authenticated (a form where the user can respond without being authenticated)
// this is used when it is not needed to be authenticated to respond to a form
router.get("/public/:id", async (req, res) => {
  // get a form based on the id
  // only the forms that are public can be accessed without authentication
  try {
    const form = await Form.findById(req.params.id);
    if (!form || !form.canRespond) {
      return res.status(404).json({ error: "Form not found" });
    }
    const formFields = await FormField.find({ formId: form._id });
    form.fields = formFields;
    res.send(form);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Update a form
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const formId = req.params.id;
    const updates = req.body;
    const form = await Form.findOne({ _id: formId, owner: req.user._id });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Update form details
    Object.keys(updates).forEach((key) => {
      form[key] = updates[key];
    });

    // Save updated form
    await form.save();

    res.status(200).send(form);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
// Delete a form
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    const fieldsIds = form.fields;
    await FormField.deleteMany({ _id: { $in: fieldsIds } });
    await Response.deleteMany({ formId: form._id });
    await Form.deleteOne({ _id: form._id });
    res.send(form);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add a response to a form
// this is used when it is not needed to be authenticated to respond to a form
router.post("/:id/add-response", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (!form.canRespond) {
      return res
        .status(401)
        .json({ error: "Unauthorized; form is not open for responses" });
    }
    const response = new Response({
      formId: form._id,
      ...req.body,
    });

    await response.save();
    res.status(201).send(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
