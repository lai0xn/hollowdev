const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const FormField = require("./FormFieldModel");
const FormSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    fields: [{
      type: String,
      ref: "FormField",
    }],
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    canRespond: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Form = mongoose.model("Form", FormSchema);
module.exports = Form;
