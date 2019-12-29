const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const corgis = require('../../../index').animals.corgi;

class Corgi extends Command {

    constructor() {

        super({
            name: 'corgi',
            aliases: ['potato']
        });

    }

    async call({ author, args }) {

        return new EmbeddedResponse().setTitle('Corgi').addImage(corgis[~~(Math.random()*corgis.length)]).addFooter({ text: `Requested by ${author.tag}`, icon_url: author.avatarURL });

    }

}

module.exports = new Corgi();