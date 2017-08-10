const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refbookSchema = new Schema({
    code: String,
    name: String,
    oid: String,
    version: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refbook', refbookSchema);