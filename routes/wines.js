// var mongo = require('mongoskin');
// //console.log (':::::::::::::::::::::::::::uuuuuuuuuuuuuu::::::::::::::::::::::::::::Succeeded connected to: ');
// var Server = mongo.Server,
//     Db = mongo.Db,
//     BSON = mongo.BSONPure;

// var server = new Server('localhost', 27017, {auto_reconnect: true});
// db = new Db('winecellerdb', server, {safe:true});

// //new Db(new Server('localhost', 27017), {safe:false}) 

// var http = require ('http');             // For serving a basic web page.
// var mongoose = require ("mongoose"); // The reason for this demo.
// // var port = process.env.PORT || 27017;

// // Here we find an appropriate database to connect to, defaulting to
// // localhost if we don't find one.  
// var uristring = 
// process.env.MONGOLAB_URI || 
// process.env.MONGOHQ_URL || 
// 'mongodb://localhost/HelloMongoose';

// // The http server will listen to an appropriate port, or default to
// // port 5000.
// var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database   ////
// operations and release them when the connection is complete.
//console.log (':::::::::::::::::::::::::::66666666::::::::::::::::::::::::::::Succeeded connected to: ');

// mongoose.connect("mongodb://madhatterbinary:lupen333@ds043497.mongolab.com:43497/heroku_app15083406", function (err, res) {

//    // console.log (':::::::::::::::::::::::::::000::::::::::::::::::::::::::::Succeeded connected to: ' + err,res);
//   if (err) { 
//   console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//   } else {
//      console.log ('::::::::::::::::::::::::::::ressssssssssssssss:::::::::::::::::::::::::::Succeeded res to: ' + res);
//    db.collection('wines', function(err, collection) {
//         console.log ('::::::::::::::::::::::::::::99999999999:::::::::::::::::::::::::::Succeeded collection to: ' + collection);

//         /////////////////////////////

//     });
//   }
// });
// var express = require('express');
// var mongo = require('mongoskin');

// var app = express();
// var db = mongo.db('mongodb://madhatterbinary:lupen333@ds043497.mongolab.com:43497/heroku_app15083406');

// app.get('/', function(request, response) {
    
//     db.collection('wines').find().toArray(function(err, items) {
//         if (err) throw err;
//         console.log ('::::::::::::::::::::::::::::99999999999:::::::::::::::::::::::::::Succeeded collection to: ' + JSON.stringify(items));
//         //response.send(JSON.stringify(items));
//     });  
// });

// var port = process.env.PORT || 27017;
// app.listen(port, function() {
//   console.log('Listening on ' + port);
// });

 // var db = mongo.db('mongodb://madhatterbinary:lupen333@ds043497.mongolab.com:43497/heroku_app15083406', function (err, res) {
 //          db.collection('wines').find().toArray(function(err, items) {
 //        if (err) throw err;
 //         console.log ('::::::::::::::::::::::::::::99999999999:::::::::::::::::::::::::::Succeeded collection to: ' + JSON.stringify(items));
 //         res.send(items);
        
 //    }); 
 // });
////////////////////////////////////////////////////////
// npm install mongodb

var db = require('mongodb');
var url = require('url');
var log = console.log;
var MONGOHQ_URL="mongodb://madhatterbinary:lupen333@alex.mongohq.com:10047/app15083406";
 
var connectionUri = url.parse(MONGOHQ_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

console.log ('::::::::::::::::::::::::::::MONGOHQ_URL:::::::::::::::::::::::::::: ' +MONGOHQ_URL);
console.log ('::::::::::::::::::::::::::::connectionUri:::::::::::::::::::::::::::: ' +connectionUri);
console.log ('::::::::::::::::::::::::::::dbName:::::::::::::::::::::::::::: ' +dbName);
 
db.Db.connect(MONGOHQ_URL, function(error, client) {
  if (error) throw error;

  client.collectionNames(function(error, names){
    if(error) throw error;
 
    // output all collection names
    log("collectionNamessssss!!!!!!!!!!" + names);

    log("===========");
    var lastCollection = null;
        names.forEach(function(colData){
          var colName = colData.name.replace(dbName + ".", '')
           
          lastCollection = colName;
          log("::::::::::::::::::::::::::::ALL Collection:::::::::::::::::::::::::::::: " + lastCollection);
          if (lastCollection == "wines") {
            var collection = new db.Collection(client, lastCollection);

                log("\nDocuments in " + lastCollection);
                var documents = collection.find({}, {limit:24});
    
              log("::::::::::::::::::::::::::::documents::::1:::::::::::::::::::::::::: " + documents);
             
                // output a count of all documents found
                documents.count(function(error, count){
                  log("  " + count + " documents(s) found");
                  log("====================");
             
                  // output the first 5 documents
                  documents.toArray(function(error, docs) {
                    if(error) throw error;
             
                    docs.forEach(function(doc){

                        log("::::::::::::::::::::::::::::docccccccccc:::::::::::::::::::::::::::::: " + doc);

                    });
                    // close the connection
                    client.close();
                  });
                });

          };
        }); 
    });           
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