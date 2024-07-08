const logger = require("../utils/logger");
const Form = require("../models/FormModel");
const FormField = require("../models/FormFieldModel");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("addField", async ({ formId, newField }) => {
      try {
        logger.info("Adding new field");

        logger.info("Checking for missing fields");
        if (!formId || !newField) {
          logger.error("Missing required fields");
          return socket.emit("error", "Missing required fields");
        }
        logger.info("Required fields provided");

        logger.info("Finding form");
        const form = await Form.findById(formId);
        console.log(form._id);
        if (!form) {
          logger.error("Form not found");
          return socket.emit("error", "Form not found");
        }
        logger.info("Form found");

        logger.info("Creating new form field");
        const formField = new FormField({
          ...newField,
          formId: form._id,
        });
        logger.info("Saving form field");
        await formField.save();
        form.fields.push(formField._id);
        await form.save();
        io.emit("fieldAdded", { formId: form._id, field: formField });
      } catch (error) {
        logger.error(`Error adding field: ${error.message}`);
        socket.emit("error", error.message);
      }
    });

    socket.on("updateField", async ({ formId, fieldId, updates }) => {
      try {
        const form = await Form.findById(formId);
        if (!form) {
          return socket.emit("error", "Form not found");
        }
        const formField = await FormField.findByIdAndUpdate(fieldId, updates, {
          new: true,
        });
        if (!formField) {
          return socket.emit("error", "Form field not found");
        }
        io.emit("fieldUpdated", { formId, fieldId, updates });
      } catch (error) {
        logger.error(`Error updating field: ${error.message}`);
        socket.emit("error", error.message);
      }
    });

    socket.on("deleteField", async ({ formId, fieldId }) => {
      try {
        const form = await Form.findById(formId);
        if (!form) {
          return socket.emit("error", "Form not found");
        }
        await FormField.deleteOne({ _id: fieldId });
        form.fields = form.fields.filter(
          (field) => field.toString() !== fieldId,
        );
        await form.save();
        io.emit("fieldDeleted", { formId, fieldId });
      } catch (error) {
        logger.error(`Error deleting field: ${error.message}`);
        socket.emit("error", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
