const moment = require('moment');


const helpers = {
    serialize: (context) => {
        return JSON.stringify(context);
    },
    filter: (data, arr = []) => {

        if (!Array.isArray(data)) {
            return [];
        }

        const filteredArr = [...data];
        return filteredArr.filter(item => {
            return JSON.parse(arr).every(filterPair => {
                return item[filterPair.key].toString() === filterPair.value
            });
        });
    },
    moment: (date) => {
        return moment(date).format('YYYY/MM/DD');
    }
}

module.exports = {
    ...helpers
}