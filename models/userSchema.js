const mongoose = require("mongoose");
const { notificationSchema } = require("./notificationSchema");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  branchDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  notifications: [notificationSchema],
});

module.exports = mongoose.model("BranchUser", userSchema);
