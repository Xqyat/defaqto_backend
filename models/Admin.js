const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('admins', adminSchema);