var mongoose = require('mongoose');

var LodgingSchema = new mongoose.Schema({
  address: String,
  icon: String,
  name: String,
  phone: String,
  locationA: Number,
  locationF: Number,
  check_in: Date, 
  check_out: Date, 
});

mongoose.model('Lodging', LodgingSchema);

