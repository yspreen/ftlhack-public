var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WhitelistEntry = new Schema({
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
});
module.exports = mongoose.model('WhitelistEntry', WhitelistEntry);