const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  timestamp: Date,
  message: String,
  details: { name: String, pincode: Number, email: String, mobile: String },
});

module.exports = {
  notificationSchema,
  Notification: mongoose.model("Notification", notificationSchema),
};
