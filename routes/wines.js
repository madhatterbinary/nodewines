var mongo = require('mongodb');
//console.log (':::::::::::::::::::::::::::uuuuuuuuuuuuuu::::::::::::::::::::::::::::Succeeded connected to: ');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winecellerdb', server);

var http = require ('http');             // For serving a basic web page.
var mongoose = require ("mongoose"); // The reason for this demo.
var port = process.env.PORT || 27017;

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/HelloMongoose';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database   ////
// operations and release them when the connection is complete.
//console.log (':::::::::::::::::::::::::::66666666::::::::::::::::::::::::::::Succeeded connected to: ');

mongoose.connect("mongodb://madhatterbinary:lupen333@ds043497.mongolab.com:43497/heroku_app15083406", function (err, res) {

   // console.log (':::::::::::::::::::::::::::000::::::::::::::::::::::::::::Succeeded connected to: ' + err,res);
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
     console.log ('::::::::::::::::::::::::::::ressssssssssssssss:::::::::::::::::::::::::::Succeeded res to: ' + res);
   db.collection('wines', function(err, collection) {
        console.log ('::::::::::::::::::::::::::::99999999999:::::::::::::::::::::::::::Succeeded collection to: ' + collection);
        console.log(JSON.stringify(collection));

    });
  }
});


///////////////////////////////////////////////////////
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
};

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};