var db = require('mongodb');
var url = require('url');
var log = console.log;

var winecollection;
var MONGOHQ_URL="mongodb://madhatterbinary:lupen333@alex.mongohq.com:10047/app15083406";
 
var connectionUri = url.parse(MONGOHQ_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

db.Db.connect(MONGOHQ_URL, function(error, client) {
  if (error) throw error;

  client.collectionNames(function(error, names){
    if(error) throw error;

    var lastCollection = null;
        names.forEach(function(colData){
          var colName = colData.name.replace(dbName + ".", '')
           
          lastCollection = colName;
          if (lastCollection == "wines") {
            var collection = new db.Collection(client, lastCollection);

                log("\nDocuments in " + lastCollection);
                var documents = collection.find({}, {limit:24});
                winecollection = new db.Collection(client, lastCollection);

                winecollection.find().toArray(function(err, items) {
                   
                   log("::::::::::::::::::::::::::::WINE collection::::00111 JSON:::::::::::::::::::::::::: " + JSON.stringify(items));
  
                });
          };
        }); 
    });           
});

///////////////////////////////////////////////////////
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
        winecollection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
};

exports.findAll = function(req, res) {


        winecollection.find().toArray(function(err, items) {
            console.log('Retrieving wine: ' + items);
            res.send(JSON.stringify(items));
        });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
        winecollection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(JSON.stringify(result[0]));
            }
        });
};

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
        winecollection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
};

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
        winecollection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
};