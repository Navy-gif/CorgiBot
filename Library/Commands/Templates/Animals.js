const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const animals = require('../../../index').animals;

class AnimalsTemplate extends Command {

    constructor(name, aliases = []) {

        super({
            name: name,
            aliases: aliases
        });

    }

    async call({ author }) {

        return new EmbeddedResponse().setTitle(this.name[0].toUpperCase() + this.name.substring(1)).addImage(animals[this.name][~~(Math.random()*animals[this.name].length)]).addFooter(`Requested by ${author.tag}`, author.avatarURL);

    }

}

module.exports = AnimalsTemplate;