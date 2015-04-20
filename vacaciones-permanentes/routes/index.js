var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


//MONGODB Initialization
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Trip = mongoose.model('Trip');
var Destination = mongoose.model('Destination');

router.get('/trips', auth, function(req, res, next) {
  Trip.find({user: req.payload}).exec(function(err, trips){
    if(err){ return next(err); }
    res.json(trips);
  });
});

router.post('/trips', auth, function(req, res, next) {
  var trip = new Trip(req.body);
  //Le pongo el user
  trip.user = req.payload;
  trip.save(function(err, post){
    if(err){ return next(err); }

    res.json(trip);
  });
});

router.param('trip', function(req, res, next, id) {
  var query = Trip.findById(id);

  query.exec(function (err, trip){
    if (err) { return next(err); }
    if (!trip) { return next(new Error('can\'t find trip')); }

    req.trip = trip;
    return next();
  });
});

router.get('/trips/:trip', function(req, res, next) {
  req.trip.populate('destinations', function(err, trip) {
    if (err) { return next(err); }
    res.json(trip);
  });
});

router.post('/trips/delete/:id', function(req, res){
     Trip.findById( req.params.id, function ( err, trip ){
         trip.remove( function ( err, trip ){
         });
     });
    res.send('/ DELETE OK');
});

//DESTINATIONS
router.post('/trips/:trip/destination', function(req, res, next){
  var destination = new Destination(req.body);
  destination.trip = req.trip;


  destination.save(function(err, destination){
    if(err){ return next(err); }

    req.trip.destinations.push(destination);
    req.trip.save(function(err, trip) {
      if(err){ return next(err); }

      res.json(destination);
    });
  });
});

router.post('/destinations/delete/:id', function(req, res){
     Destination.findById( req.params.id, function ( err, destination ){
         destination.remove( function ( err, destination ){
         });
     });
    res.send('/ DELETE OK');
});


router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});
// module.exports = router;

