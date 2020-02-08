const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  likes: [String],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
