const { createClient } = require('../libs/soap');
const Refbook = require('../models/refbook');
const Record = require('../models/record');
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
                if (!d && (i[0].value === 'MDP365' || i[0].value === 'C33001')) {
                    let rf = new Refbook({
                        code: i[0].value,
                        name: i[1].value,
                        oid: i[2].value,
                        version: i[3].value
                    });
                    await rf.save();
                }
            } catch (e) { console.error(e); }
            return i;
        }), Promise.resolve());
        rl = await Refbook.find();
        let result = [];
        await rl.reduce((p, i) => p.then(async () => {
            try {
                let parts = await rias.getRefbookParts({
                    code: i.code,
                    version: i.version
                });
                let record = await rias.getRefbookPartial({
                    code: i.code,
                    version: i.version,
                    part: parts.getRefBookPartsReturn
                });
                record = record.getRefBookPartialReturn.map(i => i.map.item.map(j => {
                    return Object.assign({}, j.value);
                }));
                record = record.map(i => i.map(j => Object.assign({}, { value: j.$value })));
                record.reduce((p, j) => p.then(async () => {
                    try {
                        let d = await Record.findOne({ code: j[0].value });
                        if (!d) {
                            let rc = new Record({
                                _refbook: i._id,
                                code: j[0].value,
                                high: j[1].value,
                                name: j[3].value
                            });
                            await rc.save();
                            result.push(rc);
                        }
                    } catch (e) { console.error(e); }
                    return j;
                }), Promise.resolve());
            } catch (e) { console.error(e); }
            return i;
        }), Promise.resolve());
        mongoose.connection.close();
        return result.length;
    } catch (e) { return e; }
};
