const Command = require('../Command');

class Corgi extends Command {

    constructor() {

        super({
            name: 'corgi'
        });

    }

}

module.exports = new Corgi();