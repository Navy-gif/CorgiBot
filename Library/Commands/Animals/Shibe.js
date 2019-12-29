const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const shibes = require('../../../index').animals.shibe;

class Shibe extends Command {

    constructor() {

        super({
            name: 'shibe',
            aliases: []
        });

    }

    async call({ author }) {

        return new EmbeddedResponse().setTitle('Shibe').addImage(shibes[~~(Math.random()*shibes.length)]).addFooter({ text: `Requested by ${author.tag}`, icon_url: author.avatarURL });

    }

}

module.exports = new Shibe();