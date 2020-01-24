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
        index.util.logger.print('Loading animals into memory.')
        let animals = await index.database.find('animals', {  });
        for(let animal of animals) index.animals[animal.type] = animal.images;

        //Bot
        let path = process.cwd();
        if(!path.endsWith('CorgiBot')) path += `\\CorgiBot`;
        index.bot = await Bot.init(path, require('../../../Config/BotConfig.json'));

    }

}

module.exports = new Startup();
