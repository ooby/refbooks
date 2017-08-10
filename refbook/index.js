const { createClient } = require('../libs/soap');
const Refbook = require('../models/refbook');
const riasUri = 'http://rias.mzsakha.ru/NSIService/services/NsiServiceManagerImpl?wsdl';
const composeLib = async (lib) => {
    try {
        let client = await createClient(riasUri);
        return lib(client);
    } catch (e) { return e; }
};
exports.getRefbookList = async config => {
    try {
        const mongoose = require('../libs/mongoose')(config);
        let rias = await composeLib(require('../rias'));
        let rl = await rias.getRefbookList();
        rl = rl.getRefBookListReturn.map(i => i.map.item.map(j => {
            return Object.assign({}, j.value);
        }));
        rl = rl.map(i => i.map(j => Object.assign({}, { value: j.$value })));
        mongoose.connection.close();
        return rl;
    } catch (e) { return e; }
};
exports.getRefbook = async (data, config) => {
    try {
        const mongoose = require('../libs/mongoose')(config);
        let rias = await composeLib(require('../rias'));
        let rl = await rias.getRefbookPartial(data);
        rl = rl.getRefBookPartialReturn.map(i => i.map.item.map(j => {
            return Object.assign({}, j.value);
        }));
        rl = rl.map(i => i.map(j => Object.assign({}, { value: j.$value })));
        mongoose.connection.close();
        return rl;
    } catch (e) { return e; }
};
exports.sync = async config => {
    try {
        const mongoose = require('../libs/mongoose')(config);
        let rias = await composeLib(require('../rias'));
        let rl = await rias.getRefbookList();
        rl = rl.getRefBookListReturn.map(i => i.map.item.map(j => {
            return Object.assign({}, j.value);
        }));
        rl = rl.map(i => i.map(j => Object.assign({}, { value: j.$value })));
        await rl.reduce((p, i) => p.then(async () => {
            try {
                let d = await Refbook.findOne({ code: i[0].value });
                if (!d) {
                    let rf = new Refbook({
                        code: i[0].value,
                        name: i[1].value,
                        oid: i[2].value,
                        version: i[3].value
                    });
                    let res = await rf.save();
                }
            } catch (e) { console.error(e); }
            return i;
        }), Promise.resolve());
        rl = await Refbook.find();
        /*let result = [];
        await rl.reduce((p, i) => p.then(async () => {
            let parts = await rias.getRefbookParts({
                code: i.code,
                version: i.version
            });
            result.push(parts.getRefBookPartsReturn);
            return i;
        }), Promise.resolve());
        return result;*/
        mongoose.connection.close();
        return rl;
    } catch (e) { return e; }
};