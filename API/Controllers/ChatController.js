'use strict';
var mongoose = require('mongoose');
var WhitelistEntry = mongoose.model('WhitelistEntry');

exports.processRequest = function (req, res) {
    if (req.body.queryResult.action == "check.url") {
        getTeamInfo(req, res)
    }
};

function checkUrl(url) {
    if (url.includes("google")) {
        return "Google is neutral! 🏳";
    }
    else if (url.includes("breitbart")) {
        return "That's very likely to be a fake! 😱";
    }
    return "I don't know about that one 🤷🏽‍♀️"
}

function getTeamInfo(req, res) {
    let teamToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.team ? req.body.queryResult.parameters.team : 'Unknown';
    console.info(teamToSearch);
    WhitelistEntry.findOne({
        name: teamToSearch
    }, function (err, teamExists) {

    });

    if (req.body.queryResult.parameters.URL) {
        return res.json({
            fulfillmentText: checkUrl(req.body.queryResult.parameters.URL),
            source: 'backend check'
        });
    }

    return res.json({
        fulfillmentText: "That does not look like a website to me 🤔\nPlease send me a message like \"Check google.com\"!",
        source: 'backend check'
    });
}
