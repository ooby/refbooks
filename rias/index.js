module.exports = c => {
    return {
        getRefbookList: () => c.getRefBookListAsync({}),
        getRefbookParts: d => c.getRefBookPartsAsync(d),
        getRefbookPartial: d => c.getRefBookPartialAsync(d)
    };
};
