const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tests: [
    {
      name: {
        type: String,
      },
      instructions: {
        type: String,
      },
    },
  ],
  issuingDate: {
    type: Date,
    default: Date.now,
  },
  receipt: {
    data: Buffer,
    contentType: String,
  },
  result: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = Test = mongoose.model(
  "Test",
  testSchema
);
