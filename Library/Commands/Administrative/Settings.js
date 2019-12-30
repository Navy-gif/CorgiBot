const Command = require('../Command');
const CommandError = require('../../Structures/CommandError');
const logger = require('../../Utilities/Logger');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');

class Settings extends Command {

    constructor() {

        super({
            name: 'settings',
            aliases: [ 'set' ],
            perms: ['admin', 'settings'],
            permRequired: true
        });

    }

    async call({ args, guilddata, bot }) {

        if(args.length === 0) {
            return new EmbeddedResponse(`Configure how the bot behaves in your server.\n\n**Available settings:**\n${Object.keys(bot.settings).join(', ')}`).setTitle('**CorgiBot settings**');
        }

        let setting = args.shift().toLowerCase();
        if(bot.settings[setting]) {

            let response = await bot.settings[setting].update({
                guilddata: guilddata,
                args: args,
                bot: bot
            });

            if(response instanceof EmbeddedResponse) return response;
            if(!response) {
                logger.error(`Missing response for ${setting} setting!`);
                return new EmbeddedResponse('**Whoops!**\nLooks like the setting didn\'t return a response. This has been logged.\n\nSetting success unknown.').setTitle('Null response.');
            }

        } else {
            return new EmbeddedResponse(`**${setting}** isn't a setting!`).setTitle('Error');
        }

    }

}

module.exports = new Settings();