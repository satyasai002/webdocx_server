const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile:{
    type: Number,
    required: true,
  },
  password:{
    type:String,
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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
