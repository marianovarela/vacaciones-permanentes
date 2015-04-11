var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
  name: String,	
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }]
});

mongoose.model('Trip', TripSchema);

