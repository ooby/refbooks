const mongoose = require('../libs/mongoose');
const Refbook = require('../models/refbook');
const Record = require('../models/record');
const soap = require('soap');

const rias = require('../rias');

const riasUri = 'http://rias.mzsakha.ru/NSIService/services/NsiServiceManagerImpl?wsdl';

const createClient = () => soap.createClientAsync(riasUri);

exports.getRefbookList = async () => {
    try {
        let c = await createClient();
        let rl = await rias(c).getRefbookList();
        rl = rl.getRefBookListReturn.map(i => i.map.item.map(j => {
            return Object.assign({}, j.value);
        }));
        rl = rl.map(i => i.map(j => Object.assign({}, { value: j.$value })));
        return { data: rl };
    } catch (e) {
        console.error(e);
        return e;
    }
};

exports.getRefbook = async data => {
    try {
        let c = await createClient();
        let rl = await rias(c).getRefbookPartial(data);
        rl = rl.getRefBookPartialReturn.map(i => i.map.item.map(j => {
            return Object.assign({}, j.value);
        }));
        rl = rl.map(i => i.map(j => Object.assign({}, { value: j.$value })));
        return { data: rl };
    } catch (e) {
        console.error(e);
        return e;
    }
};

exports.getRefbookByCode = async code => {
    try {
        let d = await Refbook.findOne({ code: code });
        let rl = await Record.find({ _refbook: d._id });
        return { data: rl };
    } catch (e) {
        console.error(e);
        return e;
    }
};

exports.getRefbookParts = async data => {
    try {
        let c = await createClient();
        let rl = await rias(c).getRefbookParts(data);
        rl = rl ? rl.getRefBookPartsReturn : null;
        return rl;
    } catch (e) {
        console.error(e);
        return e;
    }
}

exports.sync = async config => {
    try {
        const mongoose = mongoose(config);
        let c = await createClient();
        let rl = await rias(c).getRefbookList();
        rl = rl.getRefBookListReturn.map(i => i.map.item.map(j => {
            return Object.assign({}, j.value);
        }));
        rl = rl.map(i => i.map(j => Object.assign({}, { value: j.$value })));
        for (let i of rl) {
            let d = await Refbook.findOne({ code: i[0].value });
            if (!d && (i[0].value === 'C33001' || i[0].value === 'C33002' || i[0].value === 'MDP365')) {
                let rf = new Refbook({
                    code: i[0].value,
                    name: i[1].value,
                    oid: i[2].value,
                    version: i[3].value
                });
                await rf.save();
            }
        }
        rl = await Refbook.find();
        let result = [];
        for (let i of rl) {
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
            if (i.code === 'MDP365') {
                for (let j of record) {
                    let d = await Record.findOne({ code: j[1].value });
                    if (!d) {
                        let rc = new Record({
                            _refbook: i._id,
                            code: j[1].value,
                            name: j[3].value
                        });
                        await rc.save();
                        result.push(rc);
                    }
                }
            } else {
                for (let j of record) {
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
                }
            }
        }
        return { data: result, mongoose: mongoose };
    } catch (e) {
        console.error(e);
        return e;
    }
};
