'use strict';
var mongoose = require('mongoose');
var WhitelistEntry = mongoose.model('WhitelistEntry');

exports.processRequest = function (req, res) {
    console.log(req.body);
    if (req.body.queryResult.action == "schedule") {
        //getTeamSchedule(req, res)
    } else if (req.body.queryResult.action == "tell.about") {
        getTeamInfo(req, res)
    }
};


function getTeamInfo(req, res) {
    let teamToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.team ? req.body.queryResult.parameters.team : 'Unknown';
    console.info(teamToSearch);
    WhitelistEntry.findOne({
        name: teamToSearch
    }, function (err, teamExists) {

    });

    return res.json({
        fulfillmentText: req.body.queryResult.parameters.URL || "none",
        source: 'team info'
    });
}