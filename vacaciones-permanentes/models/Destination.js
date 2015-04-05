var mongoose = require('mongoose');

var DestinationSchema = new mongoose.Schema({
  name: String,
  lodging: { type: mongoose.Schema.Types.ObjectId, ref: 'Lodging' },
  arrival: Date,
  departure: Date, 
});

mongoose.model('Destination', DestinationSchema);

