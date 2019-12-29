const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const index = require('../../../index');

class Help extends Command {

    constructor() {
        super({
            name: 'help',
            aliases: ['h']
        });
    }

    async call() {
        return 'Send help.'
    }

}

module.exports = new Help();