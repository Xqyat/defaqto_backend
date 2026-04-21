const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    entranceType: {
      type: String,
      required: true,
      enum: ['free', 'paid'],
    },
    entrancePrice: {
      type: Number,
      default: null,
      min: 0,
      required: function () {
        return this.entranceType === 'paid';
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('events', eventSchema);