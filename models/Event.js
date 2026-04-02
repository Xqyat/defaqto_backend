const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    entrance: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('events', eventSchema);