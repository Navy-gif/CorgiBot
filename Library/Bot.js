const djs = require('discord.js');
const logger = require('./Utilities/Logger')
const Registry = require('./Structures/Registry')

class Bot {

    constructor() {

        this.registry;
        this.directory;

    }

    async init(directory, config) {

        //Load commands
        this.directory = directory;
        logger.print('Starting bot.');
        console.log(directory)
        this.registry = new Registry(`${this.directory}\\Library\\Commands`);
        this.registry.init();

    }

}

module.exports = new Bot();