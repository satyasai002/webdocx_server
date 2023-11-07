const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  shift:{
    type: String,
  },
  date: {
    type: Date,
  },
  patient: {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
  },
  symptoms: {
    type: String,
  },
});

module.exports = Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);
