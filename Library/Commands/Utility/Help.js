const Command = require('../Command');

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