const { sync, getRefbookList, getRefbook, getRefbookByCode } = require('./refbook');
module.exports = config => {
    return {
        sync: () => sync(config.mongoose),
        getRefbookList: () => getRefbookList(),
        getRefbook: data => getRefbook(data),
        getRefbookByCode: code => getRefbookByCode(code)
    };
};
