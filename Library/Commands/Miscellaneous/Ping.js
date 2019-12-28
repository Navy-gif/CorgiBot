const Command = require('../Command');

class Ping extends Command {

    constructor() {

        super({
            name: 'ping'
        });

    }

    async call() {



    }

}

module.exports = new Ping();