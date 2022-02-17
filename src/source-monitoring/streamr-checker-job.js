const StreamrClient = require('streamr-client');

const SourceCheckerJob = require("./source-checker-job.js")


// Example configuration below
// {
//    "type": "streamr-storage",
//    "streamrEndpointPrefix": "0x3a7d971de367fe15d164cdd952f64205f2d9f10c/redstone-oracle",
//    "schedule": "*/10 * * * * *",
//    "verifySignature": true,
//    "label": "avalanche-timestamp-delay-lite-1-all",
//    "timestampDelayMillisecondsError": 120000,
//    "timestampDelayMillisecondsWarning": 20000
// }
module.exports = class SourceCheckerJobStreamr extends SourceCheckerJob {

    constructor() {
        super();

        this.client = new StreamrClient({
            auth: {
                privateKey: StreamrClient.generateEthereumAccount().privateKey,
            }
        })
    }

    async request(configuration, responseInfo) {
        let url = configuration.streamrEndpointPrefix + '/package';

        return new Promise((resolve, reject) => {
            this.client.resend({
                stream: url,
                resend: {
                    last: 1,
                },
            }, (response) => {
                responseInfo.url = url;
                responseInfo.data = response;
                responseInfo.timestamp = response.pricePackage.timestamp;

                resolve(responseInfo);
            });
        });
    }
}
