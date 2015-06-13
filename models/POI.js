var mongoose = require('mongoose');

var POISchema = new mongoose.Schema({
  address: String,
  icon: String,
  name: String,
  locationA: Number,
  locationF: Number,
});

mongoose.model('POI', POISchema);

