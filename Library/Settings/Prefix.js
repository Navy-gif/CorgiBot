const EmbeddedResponse = require('../Structures/EmbeddedResponse');

class Prefix {

    constructor() {
        this.name = 'prefix'
    }

    async update({ args, guilddata }) {

        if(args.length < 1) {
            return new EmbeddedResponse(`Too few arguments!`).setTitle(`**${this.name}**`);
        }

        let method = args.shift(),
        response;

        if(method === 'reset') {

            guilddata.settings.prefix = undefined;
            response = new EmbeddedResponse('Successfully reset the prefix.').setTitle('Success');

        } else if(method.length <= 10) {

            guilddata.settings.prefix = method;
            response = new EmbeddedResponse(`Successfully changed the prefix to: \`${method}\``).setTitle('Success');

        }

        await guilddata.update();
        return response;

    }

}

module.exports = new Prefix();