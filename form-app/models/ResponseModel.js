const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4
const Schema = mongoose.Schema;
const logger = require("../utils/logger");
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
  answers: [{
    fieldId: {
      type: String,
      required: true,
      ref: "FormField",
    },
    answer: [String]
  }],
});
// Ensure answer is required if the field is required
ResponseSchema.pre("save", async function (next) {
  console.log("Checking if answer is required");
  try {
    for (let answer of this.answers) {
      const field = await mongoose.model("FormField").findById(answer.fieldId);
      if (!field) {
        throw new Error(`Field with ID ${answer.fieldId} not found`);
      }

      if (field.isRequired && (!answer.answer || answer.answer.length === 0 || !answer.answer[0])) {
        throw new Error(`Answer is required for field: ${field.label}`);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Validate answer based on field type
ResponseSchema.pre("save", async function (next) {
  try {
    for (let answer of this.answers) {
      const field = await mongoose.model("FormField").findById(answer.fieldId);
      if (!field) {
        throw new Error(`Field with ID ${answer.fieldId} not found`);
      }

      if (field.type === "radio" || field.type === "select") {
        if (answer.answer.length !== 1 || !field.options.includes(answer.answer[0])) {
          throw new Error(`Answer should be one of the options for field: ${field.label}`);
        }
      } else if (field.type === "checkbox") {
        const options = field.options;
        for (let a of answer.answer) {
          if (!options.includes(a)) {
            throw new Error(`Answer should be one of the options for field: ${field.label}`);
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Response = mongoose.model("Response", ResponseSchema);
module.exports = Response;

