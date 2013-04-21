//  var mongo = require('mongodb');
// // //console.log (':::::::::::::::::::::::::::uuuuuuuuuuuuuu::::::::::::::::::::::::::::Succeeded connected to: ');
//  var Server = mongo.Server,
//        Db = mongo.Db,
//        BSON = mongo.BSONPure;

// var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = require('mongodb');
var url = require('url');
var log = console.log;

// db = new Db('winecellerdb', server, {safe:true});


var winecollection;
var MONGOHQ_URL="mongodb://madhatterbinary:lupen333@alex.mongohq.com:10047/app15083406";
 
var connectionUri = url.parse(MONGOHQ_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

console.log ('::::::::::123::::::::::::::::::MONGOHQ_URL:::::::::::::::::::::::::::: ' +MONGOHQ_URL);
console.log ('::::::::::123::::::::::::::::::connectionUri:::::::::::::::::::::::::::: ' +connectionUri);
console.log ('::::::::::123::::::::::::::::::dbName:::::::::::::::::::::::::::: ' +dbName);
 
db.Db.connect(MONGOHQ_URL, function(error, client) {
  if (error) throw error;

  client.collectionNames(function(error, names){
    if(error) throw error;
 
    // output all collection names
    log("collectionNamessssss!!!!!6666666666!!!!!" + names);

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
                winecollection = new db.Collection(client, lastCollection);
    
              log("::::::::::::::::::::::::::::documents::::end:::::::::::::::::::::::::: " + documents);
                 winecollection.find().toArray(function(err, items) {
                   
                   log("::::::::::::::::::::::::::::WINE collection::::00111 JSON:::::::::::::::::::::::::: " + JSON.stringify(items));

                
                 });
                // output a count of all documents found
                documents.count(function(error, count){
                  log("  " + count + " documents(s) found");
                  log("====================");
             
                  // output the first 5 documents
                  documents.toArray(function(error, docs) {
                    if(error) throw error;
             
                    docs.forEach(function(doc){

                        //log("::::::::::::::::::::::::::::docccccccccc:::::::::::::::::::::::::::::: " + doc);

                    });
                    // close the connection
                   // client.close();
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
                res.send(result[0]);
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