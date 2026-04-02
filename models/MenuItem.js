const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      get: v => Math.round(v * 100) / 100,
    },
    weight_value: {
      type: Number,
      required: false,
      min: 0,
    },
    weight_unit: {
      type: String,
      required: false,
      enum: ['г', 'мл', 'л', 'шт'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    group: {
      type: String,
      required: true,
      enum: ['food', 'drinks'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('menu_items', menuItemSchema);