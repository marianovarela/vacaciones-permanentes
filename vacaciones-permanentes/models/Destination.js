var mongoose = require('mongoose');

var DestinationSchema = new mongoose.Schema({
  name: String,
  icon: String,
  locationA: Number,
  locationF: Number,
  zaA:Number,
  zaJ:Number,
  qaA:Number,
  qaJ:Number,
  lodging: { type: mongoose.Schema.Types.ObjectId, ref: 'Lodging' },
  arrival: Date,
  departure: Date, 
  pois: [{ type: mongoose.Schema.Types.ObjectId, ref: 'POI' }],
});

mongoose.model('Destination', DestinationSchema);

