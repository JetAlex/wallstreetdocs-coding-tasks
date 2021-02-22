const { Router } = require('express');
const router = new Router();
const job = require('./job');

module.exports = function factory(data) {


    router.route('/').get((req, res) => {
        res.render('home', {
            data: job.serviceReportData
        });
    });

    return router
};