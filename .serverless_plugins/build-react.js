'use strict';

const { execSync } = require('child_process');
const dotenv = require('dotenv');

class BuildReactPlugin {
    constructor(serverless, options){
        this.serverless = serverless;
        this.provider = this.serverless.getProvider("aws");
        this.serviceEndpoint = serverless.service.custom.serviceEndpoint;
        this.hooks = {
            'after:export-env:write': this.afterDeploy.bind(this)
        }
    }

    afterDeploy(){
        dotenv.config({path :'./.env'});
        const val = process.env[this.serviceEndpoint];
        execSync(`REACT_APP_ENDPOINT=${val} yarn build`,{ stdio: 'inherit' })
    }
}

module.exports = BuildReactPlugin;
