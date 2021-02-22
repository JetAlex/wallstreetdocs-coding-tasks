const fs = require('fs');
const axios = require('axios');
const querystring = require('querystring');
const config = require('../../config/config.json');
const Auth = require('./auth');
const { saveFile, pathToFile } = require('./utils');

const REPEAT_REQUEST_TIMEOUT = 5000;
const REPEAT_MAX_ATTEMPTS = 5;

class job {
    attemptCount = 0;

    constructor() {
        this.getServiceReportData = this.getServiceReportData.bind(this);
    }

    constructURL(job_id) {
        const jobId = job_id ? `/${job_id}` : '';
        return `${config.SERVICE_URL}${jobId}`;
    }

    async request(settings) {
        const {method} = settings;

        this.options = {
            url: this.constructURL(this.jobID),
            method: method,
            headers: {
                "Authorization": `Bearer ${Auth.accessToken}`,
                'Accept': 'application/json',
            },
            data: querystring.stringify({
                grant_type: config.GRANT_TYPE,
                scope: ''
            })
        };

        try {
            console.log('starting Job with url:', this.constructURL(this.jobID))
            return await axios(this.options).then(async (response) => {
                if (response.data === '' && this.attemptCount < REPEAT_MAX_ATTEMPTS) {
                    this.attemptCount++;
                    return await this.promiseTimeOut(() => this.request((settings)));
                }

                this.data = response.data;

                return this.data;
            })
        }
        catch (e) {
            const response = e.response;
           // console.log(e)
            console.log('Error: name: ', response.data.name);
            console.log('Error: message: ', response.data.message);
            console.log('Error: code: ', response.data.code);
        }
    }

    promiseTimeOut(cb) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(cb());
            }, REPEAT_REQUEST_TIMEOUT)
        });
    }

    retriveServiceReportData() {
        if (fs.existsSync(pathToFile(config.LAST_REPORT_FILE))) {
            const fileName = pathToFile(config.LAST_REPORT_FILE);
            fs.readFile(fileName, 'utf8', (error, rawData) => {
                this.serviceReportData = JSON.parse(rawData);
            });
        }
    }

    getServiceReportData() {
        return this.serviceReportData;
    }

    checkAvailableJobID() {
        const promise = new Promise((resolve) => {
            const fileName = pathToFile(config.LAST_JOB_FILE);

            if (fs.existsSync(fileName)) {
                const rawData = fs.readFileSync(fileName);
                const data = JSON.parse(rawData);
                resolve(data)
            } else {
                resolve();
            }
        });

        return promise.then(res => {
            return res || this.getJobID();
        })
    }

    async getJobID() {
        const job_res = await this.request({
            access_token: Auth.accessToken,
            method: 'POST'
        });

        this.jobID = job_res.job_id;

        saveFile({
            fileName: config.LAST_JOB_FILE,
            data: job_res
        });

        return job_res;
    }

    async getStatusReport() {
        const serviceReport = await this.request({
            access_token: Auth.accessToken,
            method: 'GET',
            job_id: this.jobID
        });

        if (serviceReport) {
            saveFile({
                fileName: config.LAST_REPORT_FILE,
                data: serviceReport
            });
        }

        return serviceReport
    }
}

const Job = new job();

module.exports = Job;