const Command = require('../Command');

class Info extends Command {

    constructor() {

        super({
            name: 'info',
            aliases: [ 'stats' ]
        });

    }

}

module.exports = new Info();