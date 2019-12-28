const Command = require('../Command');

class Corgi extends Command {

    constructor() {

        super({
            name: 'corgi',
            aliases: []
        });

    }

}

module.exports = new Corgi();