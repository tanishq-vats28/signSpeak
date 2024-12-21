const mongoose = require("mongoose");
const meetingSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  meeting_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("Meeting", meetingSchema);
