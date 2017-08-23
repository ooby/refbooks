const { sync, getRefbookList, getRefbook, getRefbookByCode } = require('./refbook');
module.exports = config => {
    return {
        sync: () => sync(config.mongoose),
        getRefbookList: () => getRefbookList(config.mongoose),
        getRefbook: data => getRefbook(data, config.mongoose),
        getRefbookByCode: code => getRefbookByCode(code, config.mongoose)
    };
};
