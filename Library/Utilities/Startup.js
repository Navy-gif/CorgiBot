const index = require('../../index');
const logger = require('./Logger');
const bot = require('../Bot');

class Startup {

    constructor() {

        console.log('Initiating startup sequence.');

    }

    async init() {

        //Start logger
        index.util.logger = await logger.init();
        index.util.logger.print('Log test.');
        index.util.logger.error('Error test.');

        //Bot
        index.bot = await bot.init(process.cwd(), require('../../../Config/BotConfig.json'));

        //Commands

    }

}

module.exports = new Startup();