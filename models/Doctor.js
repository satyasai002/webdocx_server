const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  speciality: {
    type: String,
  },
  password:{
    type:String,
    required:true,
  },
  notifications: [
    {
      message: {
        type: String,
      },
      seen: {
        type: Boolean,
        default: false,
      },
      url: {
        type: String,
      },
      type: {
        type: Number,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
