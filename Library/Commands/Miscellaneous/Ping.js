const Command = require('../Command');
const CommandError = require('../../Structures/CommandError');

class Ping extends Command {

    constructor() {

        super({
            name: 'ping',
            aliases: []
        });

    }

    async call() {

        throw new CommandError('Test', 'Test');
        //return 'PING'

    }

}

module.exports = new Ping();