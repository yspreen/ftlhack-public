'use strict';
var mongoose = require('mongoose');
var WhitelistEntry = mongoose.model('WhitelistEntry');
var BlacklistEntry = mongoose.model('BlacklistEntry');

let GOOD_RESPONSE = [
    "That one seems to be good!",
];

let BAD_RESPONSE = [
    "My fake detection is about to explode! 😱🌋",
    "That's fake! 😠",
];

let NEUTRAL_RESPONSE = [
    "I don't know about that one 🤷🏽‍♀️\nYou can tell me about this site to teach me! 👩🏽‍🏫",
    "I get mixed feelings here 🧐\nYou can tell me about this site to teach me! 👩🏽‍🏫",
]

exports.processRequest = async function (req, res) {
    if (req.body.queryResult.action == "check.url") {
        getTeamInfo(req, res);
    } else if (req.body.queryResult.action == "set.bad") {
        addBlack(req, res);
    } else {
        console.warn(req.body.queryResult);
    }
};

function r_to_s(reg) {
    return reg.source;
}

function s_to_r(str) {
    return new RegExp(str);
}

/*(new BlacklistEntry({
    name: 'Wikipedia',
    regex: r_to_s(/^(https?:\/\/)?(www\.)?breitbart.\w{2,3}/),
})).save();*/

function domainFromURL(url) {
    if (url.startsWith("http://")) {
        url = url.substr(7);
    }
    if (url.startsWith("https://")) {
        url = url.substr(8);
    }
    if (url.startsWith("www.")) {
        url = url.substr(4);
    }
    if (url.startsWith("m.")) {
        url = url.substr(2);
    }
    if (url.startsWith("mobile.")) {
        url = url.substr(7);
    }

    return url.split(".")[0];
}

async function addBlack(req, res) {
    let url = req.body.queryResult.outputContexts[0].parameters.URL;

    (new BlacklistEntry({
        name: 'generated',
        regex: "^(https?:\\/\\/)?(www\\.)?" + domainFromURL(url) + ".\\w{2,3}",
    })).save()

    return res.json({
        fulfillmentText: "Thank's for telling me!",
        source: 'backend check'
    });
}

async function checkUrl(url, callback) {
    let stop = false;
    let result = 0;
    const whitelist = WhitelistEntry.find({}).cursor();
    const blacklist = BlacklistEntry.find({}).cursor();

    function next(cursor, promise, iterFunc, endFunc) {
        promise.then(doc => {
            if (doc) {
                iterFunc(doc);
                next(cursor, cursor.next(), iterFunc, endFunc);
            } else {
                endFunc();
            }
        })
    }
    next(blacklist, blacklist.next(), (entry) => {
        if (url.match(s_to_r(entry.regex))) {
            result = -1
        }
    }, () => {
        next(whitelist, whitelist.next(), (entry) => {
            if (url.match(s_to_r(entry.regex))) {
                result = +1
            }
        }, () => {
            if (url.match(/^(https?:\/\/)?(www\.)?google.\w{2,3}/)) {
                return callback("Google is neutral! 🏳");
            } else if (result === -1) {
                return callback(BAD_RESPONSE);
            } else if (result === +1) {
                return callback(GOOD_RESPONSE);
            }
            return callback(NEUTRAL_RESPONSE);
        });
    });
}

async function getTeamInfo(req, res) {
    if (req.body.queryResult.parameters.URL) {
        return checkUrl(req.body.queryResult.parameters.URL, (r) => {
            return res.json({
                fulfillmentText: Array.isArray(r) ? r[Math.floor(Math.random() * r.length)] : r,
                source: 'backend check'
            });
        });
    }

    return res.json({
        fulfillmentText: "That does not look like a website to me 🤔\nPlease send me a message like \"Check google.com\"!",
        source: 'backend check'
    });
}