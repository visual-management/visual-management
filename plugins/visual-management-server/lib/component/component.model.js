const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Component = new Schema({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  plugin: String,
  component: String,
  config: Object
});

module.exports = mongoose.model('components', Component);
