var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BlacklistEntry = new Schema({
    name: {
        type: String,
        required: true
    },
    regex: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('BlacklistEntry', BlacklistEntry);