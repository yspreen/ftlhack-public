'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    config = require('./config'),
    server = express(),
    mongoose = require('mongoose'),
    WhitelistEntry = require('./API/Models/WhitelistEntry'),
    BlacklistEntry = require('./API/Models/BlacklistEntry');
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
var routes = require('./API/Routes/Routes'); //importing route
routes(server); //register the route
let port = process.env.PORT || 8000
server.listen(port, function () {
    console.log("Server is up and listening on port " + port);
});