var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
  name: String,	
  start: Date,
  end: Date,
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }]
});

mongoose.model('Trip', TripSchema);

