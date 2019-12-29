const index = require('../../index');
const logger = require('./Logger');
const Bot = require('../Bot');
const Database = require('./Database');

class Startup {

    constructor() {

        console.log('Initiating startup sequence.');

    }

    async init() {

        //Start logger
        index.util.logger = await logger.init();
        index.util.logger.print('Log test.');
        index.util.logger.debug('Debug test');
        index.util.logger.error('Error test.');

        //Connect to database
        index.database = new Database(require('../../../Config/mongodb.json'));
        await index.database.init();

        //Fetch image links to memory
        index.animals.corgi = await index.database.findOne('animals', { type: 'corgi' }).then(data => { return data.images });
        index.animals.shibe = await index.database.findOne('animals', { type: 'shibe' }).then(data => { return data.images });

        //Bot
        index.bot = await Bot.init(process.cwd(), require('../../../Config/BotConfig.json'));

    }

}

module.exports = new Startup();