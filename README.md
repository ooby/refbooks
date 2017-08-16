## Выгрузка справочников из сервиса [rias.mzsakha.ru](http://rias.mzsakha.ru/NSIService/services/NsiServiceManagerImpl?wsdl) и сохранение ее в свою `mongodb` базу

### По причине не полности справочников в `rias.mzsakha.ru` полноценно работают только два справочника - `С33001` и `MDP365`

### Как использовать:

1. `npm install refbooks`
2. Создать конфигурацию:
```javascript
const config = {
    mongoose: {
        host: '127.0.0.1', // IP-адрес mongoDb
        port: 27017, // порт mongoDb
        username: 'user',
        password: 'password',
        db: 'refbook', // имя базы данных для сохранения
        options: {
            'useMongoClient': true,
            'socketTimeoutMS': 10000,
            'keepAlive': true,
            'reconnectTries': 30
        }
    }
};
```
3. Подключить модуль и установить конфигурацию:
```javascript
const rb = require('refbooks')(config);
```
4. Вызвать необходимый метод:
```javascript
rb.sync()
    .then(r => {
        // r - объект с результатами и объектом mongoose
        console.log(r.data.length);
    })
    .catch(e => {
        console.error(e);
    });
```