const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
    type: [String],
  },
  description: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  medicines: [
    {
      name: {
        type: String,
      },
      dosage: {
        type: Number,
      },
      duration: {
        type: Number,
      },
      instruction: {
        type: String,
      },
    },
  ],
  remarks: {
    type: String,
  },
  issuingDate: {
    type: Date,
    default: Date.now,
  },
  tests: {
    type: Schema.Types.ObjectId,
    ref: "Test",
  },
});

module.exports = Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema
);
