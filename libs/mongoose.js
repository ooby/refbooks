const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbConnect = config => {
    mongoose.connect(config.uri, config.options, e => {
        if (e) { console.log(e); }
        else { console.log('DB connected to', config.uri); }
    });
    return mongoose;
};
module.exports = dbConnect;