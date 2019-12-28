const Command = require('../Command');

class Ping extends Command {

    constructor() {

        super({
            name: 'ping'
        });

    }

    async call() {

        return 'PING!';

    }

}

module.exports = new Ping();