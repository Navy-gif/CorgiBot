const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const bot = require('../../Bot');

class Commands extends Command {

    constructor() {
        super({
            name: 'commands',
            aliases: ['cmd']
        });
    }

    async call({ args }) {

        let response = new EmbeddedResponse().setTitle('**CorgiBot Commands**');
        if(args.length === 0) {
            let groupNames = bot.registry.groups.keyArray();
            for(let group of groupNames) {
                let obj = { name: `**${group}**`, inline: true, value: '' };
                bot.registry.groups.get(group).forEach(cmd => obj.value += `${cmd.name}\n`);
                response.addField(obj);
            }
        } else if(args[0]) {

            let gname = args[0][0].toUpperCase() + args[0].substring(1).toLowerCase();
            let group = bot.registry.groups.get(gname);

            if(!group) response.setDescription(`No command groups matching ${args[0]}`);
            else {
                let str = `**${gname}**\n`
                group.forEach(cmd => str += `${cmd.name}\n`);
                response.setDescription(str);
            }

        } else {
            response.setDescription('**???**')
        }

        return response;

    }

}

module.exports = new Commands();