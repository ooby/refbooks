const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    reflist: { type: Schema.Types.ObjectId, ref: 'Refbook', required: true },
    code: String,
    high: String,
    name: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', recordSchema);