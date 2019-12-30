const EmbeddedResponse = require('../Structures/EmbeddedResponse');

class Ignore {

    constructor() {
        this.name = 'ignore'
    }

    async update({ args, guilddata }) {

        if(args.length < 2) {
            return new EmbeddedResponse(`Too few arguments!\n\n**Available methods:**\n[WIP]`).setTitle(`**${this.name}**`);
        }

        let method = args.shift(),
        response,
        setting = guilddata.settings.ignore || [];

        if(method === 'add') {

            let added = [];
            for(let channel of args) {
                let resolved = guilddata.resolveChannel(channel);
                if(resolved && resolved.type === 'category') {
                    resolved.children.forEach(ch => {
                        if(!setting.includes(ch.id)) {
                            added.push(ch.name);
                            setting.push(ch.id);
                        }
                    });
                } else if(resolved && !setting.includes(resolved.id)) {
                    added.push(resolved.name);
                    setting.push(resolved.id);
                }
            }

            response = new EmbeddedResponse(`Successfully added the following channels to the ignore list:\n${added.join(', ')}`).setTitle('Success.')

        }

        await guilddata.update();
        return response;

    }

}

module.exports = new Ignore();