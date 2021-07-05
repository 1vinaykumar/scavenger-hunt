const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: String, required: true },
  incharge: { type: String, required: true },
  pincodesCovered: [Number],
  instituteName: { type: String, required: true },
});

module.exports = mongoose.model("Branch", branchSchema);
