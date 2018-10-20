'use strict';
var mongoose = require('mongoose');
var WhitelistEntry = mongoose.model('WhitelistEntry');

exports.processRequest = function (req, res) {
    console.log(req.body);
    if (req.body.result.action == "schedule") {
        //getTeamSchedule(req, res)
    } else if (req.body.result.action == "tell.about") {
        getTeamInfo(req, res)
    }
};


function getTeamInfo(req, res) {
    let teamToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.team ? req.body.result.parameters.team : 'Unknown';
    console.info(teamToSearch);
    WhitelistEntry.findOne({
        name: teamToSearch
    }, function (err, teamExists) {
        if (err) {
            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'team info'
            });
        }
        if (teamExists) {
            return res.json({
                speech: teamExists.description,
                displayText: teamExists.description,
                source: 'team info'
            });
        } else {
            return res.json({
                speech: 'Currently I am not having information about this team',
                displayText: 'Currently I am not having information about this team',
                source: 'team info'
            });
        }
    });
}