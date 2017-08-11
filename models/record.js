const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    _refbook: { type: String, ref: 'Refbook' },
    code: String,
    high: String,
    name: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', recordSchema);
