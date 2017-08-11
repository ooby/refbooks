const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const makeUri = cfg => 'mongodb://' + cfg.username + ':' + cfg.password + '@' +
    cfg.host + ':' + cfg.port.toString() + '/' + cfg.db;
const dbConnect = config => {
    let uri = makeUri(config);
    mongoose.connect(uri, config.options, e => {
        if (e) { console.log(e); }
        else { console.log('DB connected to', config.host); }
    });
    return mongoose;
};
module.exports = dbConnect;
