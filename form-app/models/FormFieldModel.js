const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");
const Response = require("./ResponseModel");

const FormFieldSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  formId: {
    type: String,
    required: true,
    ref: "Form",
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    // we need to specify the type of the field
    // 1. text
    // 2. checkbox
    // 3. radio
    // 4. select
    enum: ["text", "checkbox", "radio", "select"]
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [String],
  },
});

const FormField = mongoose.model("FormField", FormFieldSchema);
module.exports = FormField;
