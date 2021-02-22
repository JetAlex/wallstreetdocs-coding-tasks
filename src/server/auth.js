const fs = require('fs');
const axios = require('axios').default;
const querystring = require('querystring');
const { saveFile, pathToFile } = require('./utils');
const config = require('../../config/config.json');


class auth {
    accessToken = null;

    getAccessToken() {
        const base64encode = Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64');
        const options = {
            url: config.AUTH_TOKEN_URL,
            method: 'POST',
            headers: {
                'grant_type': 'client_credentials',
                "Authorization": `Basic ${base64encode}`,
            },
            data: querystring.stringify({
                grant_type: config.GRANT_TYPE,
                scope: ''
            }),
        };
        try {
            console.log('starting auth with url:', config.AUTH_TOKEN_URL)
            return axios(options).then((response) => {

                const tokenExpiresAt = Math.floor(new Date() / 1000 + response.expires_in / 1000);

                this.accessToken = response.data.access_token;

                saveFile({
                    fileName: config.LAST_AUTH_FILE,
                    data: {
                        ...response.data,
                        tokenExpiresAt
                    }
                });

                return response.data;
            });

        }
        catch (e) {
            console.log(e)
        }
    }

    checkAvailableToken() {
        const promise = new Promise((resolve) => {
            const fileName = pathToFile(config.LAST_AUTH_FILE);

            if (fs.existsSync(fileName)) {
                const rawData = fs.readFileSync(fileName);
                const data = JSON.parse(rawData);
                const tokenExpiresAt = data.tokenExpiresAt;

                (new Date() / 1000) > tokenExpiresAt ? resolve() : resolve(data);
            } else {
                resolve();
            }
        });

        return promise.then(res => {
            return res || this.getAccessToken();
        })
    }
}

const Auth = new auth();

module.exports = Auth;