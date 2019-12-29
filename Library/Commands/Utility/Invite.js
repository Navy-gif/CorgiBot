const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const index = require('../../../index');

class Invite extends Command {

    constructor() {
        super({
            name: 'invite',
            aliases: ['inv']
        });
    }

    async call() {
        return new EmbeddedResponse(`[📨 Click here to invite me!](https://discordapp.com/oauth2/authorize?client_id=${index.bot.client.user.id}&scope=bot&permissions=18432)`).setTitle('**CorgiBot invite**');
    }

}

module.exports = new Invite();