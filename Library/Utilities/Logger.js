//const logfolder = require('../../Logs');
const fs = require('fs');
const index = require('../../index');

class Logger {

    constructor() {

        this.logbook;

    }

    async init() {

        this.print('Starting logger.');
        if(!fs.existsSync('../CorgiBot-Logs')) {
            this.print('Log directory not found, creating new.')
            await fs.mkdirSync('../CorgiBot-Logs');
        }
        this.logbook = fs.createWriteStream(`../CorgiBot-Logs/CorgiBot-${~~(Date.now()/1000)}.log`);
        this.logbook.write(`====== CorgiBot Logbook - ${new Date().toUTCString()} ======\n\n`);
        return this;

    }

    log(text) {

        if(!this.logbook) return;
        this.logbook.write(`${text}\n`);

    }

    print(text) {

        this.log(text);
        console.log(text);

    }

    error(text) {

        this.log(`!! ${text} !!`);
        console.error(`!! ${text} !!`);

    }

    debug(text) {

        if(!index.debug) return;
        this.log(`[DEBUG] ${text}`); //[${this.debug.caller}]
        console.log(`[DEBUG] ${text}`)

    }

}

module.exports = new Logger();