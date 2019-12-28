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

    call() {

        return new Promise((resolve, reject) => {
            reject(new CommandError('Command not defined.','Command is yet to be defined.'));
        });

    }

}

module.exports = new Settings();