const express = require('express');
const exphbs  = require('express-handlebars');
const routes = require('./src/server/router');
const PORT = process.env.PORT || 3000;
const Auth = require('./src/server/auth');
const Job = require('./src/server/job');
const path = require('path');

const helpers = require('./src/helpers/helpers');

class start {
    constructor() {
        this.runServer();
        this.getFeed();
    }

    async runServer() {
        try {
            const app = express();

            app.engine(
                'hbs',
                exphbs.create({
                    layoutsDir: 'src/views',
                    defaultLayout: 'home',
                    extname: 'hbs',
                    partialsDir  : [
                        path.join(__dirname, 'src', 'views', 'modules'),
                    ],
                    helpers: {
                        ...helpers
                    }
                }).engine
            );

            app.set('view engine', 'hbs');
            app.set('views', path.join(__dirname, 'src/views'));
            app.use(express.static(__dirname + '/src/views' ));
            app.use(routes());

            app.listen(PORT, () => {
                console.log(`Server has been started on port: ${PORT}`)
            });
        } catch (e) {
            console.log(e)
        }
    }

    async getFeed() {
        Job.retriveServiceReportData();

        const token = await Auth.checkAvailableToken();
        const job_res = await Job.checkAvailableJobID();
        const feed = await Job.getStatusReport();
    }
}

process.on('uncaughtException', function (err) {
    console.log(err);
});

new start();