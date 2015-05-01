var mongoose = require('mongoose');

var DestinationSchema = new mongoose.Schema({
  name: String,
  icon: String,
  locationA: Number,
  locationF: Number,
  lodging: { type: mongoose.Schema.Types.ObjectId, ref: 'Lodging' },
  arrival: Date,
  departure: Date, 
});

mongoose.model('Destination', DestinationSchema);

