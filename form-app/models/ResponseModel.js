const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4
const FormField = require("./FormFieldModel");
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
    ref: "User",
  },
  formId: {
    type: String,
    required: true,
    ref: "Form",
  },
  fieldId: {
    type: String,
    required: true,
    ref: "FormField", // Changed the ref to "FormField"
  },
  answer: {
    type: String,
    // Removed the required logic here
  },
});

const Response = mongoose.model("Response", ResponseSchema);

// Ensure answer is required if the field is required
ResponseSchema.pre("save", async function(next) {
  const field = await FormField.findOne({ _id: this.fieldId });
  if (field.isRequired && !this.answer) {
    const err = new Error("Answer is required for this field");
    next(err);
  } else {
    next();
  }
});

module.exports = Response;

