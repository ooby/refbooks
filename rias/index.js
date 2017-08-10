module.exports = c => {
    return {
        getRefbookList: () => new Promise((resolve, reject) => {
            c.getRefBookList({}, (e, r) => {
                if (e) { reject(e); }
                else { resolve(r); }
            });
        }),
        getRefbookParts: d => new Promise((resolve, reject) => {
            c.getRefBookParts(d, (e, r) => {
                if (e) { reject(e); }
                else { resolve(r); }
            });
        }),
        getRefbookPartial: d => new Promise((resolve, reject) => {
            c.getRefBookPartial(d, (e, r) => {
                if (e) { reject(e); }
                else { resolve(r); }
            });
        })
    };
};