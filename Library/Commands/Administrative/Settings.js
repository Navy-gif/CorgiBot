const Command = require('../Command');
const CommandError = require('../../Structures/CommandError');
const logger = require('../../Utilities/Logger');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');

class Settings extends Command {

    constructor() {

        super({
            name: 'settings',
            aliases: [],
            perms: ['admin', 'settings'],
            permRequired: true
        });

    }

    async call() {

        return `Soon:tm:`

    }

}

module.exports = new Settings();