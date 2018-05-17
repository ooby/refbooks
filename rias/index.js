module.exports = c => {
    return {
        getRefbookList: () =>
            c.getRefBookListAsync({})
                .then(([d]) => d),
        getRefbookParts: d =>
            c.getRefBookPartsAsync(d)
                .then(([d]) => d),
        getRefbookPartial: d =>
            c.getRefBookPartialAsync(d)
                .then(([d]) => d)
    };
};
