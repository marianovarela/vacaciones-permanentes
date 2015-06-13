var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
  name: String,	
  start: Date,
  end: Date,
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Trip', TripSchema);

