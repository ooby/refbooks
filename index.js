const { sync, getRefbookList, getRefbook } = require('./refbook');
module.exports = config => {
    return {
        sync: () => sync(config.mongoose),
        getRefbookList: () => getRefbookList(config.mongoose),
        getRefbook: data => getRefbook(data, config.mongoose)
    };
};