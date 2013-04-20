var Db = require('../lib/mongodb').Db
  , Connection = require('../lib/mongodb').Connection
  , Server = require('../lib/mongodb').Server
  , format = require('util').format;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;


console.log("Connecting to " + host + ":" + port);