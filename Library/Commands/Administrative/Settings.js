const Command = require('../Command');
const CommandError = require('../../Structures/CommandError');
const logger = require('../../Utilities/Logger');

class Settings extends Command {

    constructor() {

        super({
            name: 'settings',
            aliases: [],
            perms: ['admin', 'settings']
        });

    }

    async call() {

        return `Soon:tm:`

    }

}

module.exports = new Settings();