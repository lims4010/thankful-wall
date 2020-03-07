const mongoose = require('mongoose');
const LimitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true
  }
});

module.exports = Limit = mongoose.model('limit', LimitSchema);
