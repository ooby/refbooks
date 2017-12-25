const {
    sync,
    getRefbookList,
    getRefbook,
    getRefbookByCode,
    getRefbookParts
} = require('./refbook');

module.exports = config => {
    return {
        sync: () => sync(config.mongoose),
        getRefbookList: () => getRefbookList(),
        getRefbook: data => getRefbook(data),
        getRefbookByCode: code => getRefbookByCode(code),
        getRefbookParts: data => getRefbookParts(data)
    };
};
