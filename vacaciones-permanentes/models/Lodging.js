var mongoose = require('mongoose');

var LodgingSchema = new mongoose.Schema({
  name: String, //Si es Hotel, Hostel, etc
  coordinates: String, // Las coordenadas
  check_in: Date, 
  check_out: Date, 
});

mongoose.model('Lodging', LodgingSchema);

