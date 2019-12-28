const Command = require('../Command');
const CommandError = require('../../Structures/CommandError');
const index = require('../../../index');
const util = require('util');
const logger = require('../../Utilities/Logger');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');

class Evaluate extends Command {

    constructor() {

        super({
            name: 'evaluate',
            aliases: [ 'eval', 'e' ],
            devOnly: true
        });

    }

    async call({ content }) {

        try {

            let result = eval(content);
            if(result instanceof Promise) result = await result;
            if(typeof result !== 'string') result = util.inspect(result);
            if(typeof result === 'string') result = result.replace(new RegExp(index.bot.client.token, 'g'), '[REDACTED]');

            if(result !== undefined) {
                if(result.length > 2000) {
                    logger.print(result);
                    return new EmbeddedResponse('```Result too long, see console.```');
                } else {
                    return new EmbeddedResponse(`\`\`\`${result}\`\`\``).addTitle('👍 Success!');
                }
            }

        } catch(err) {

            logger.error(err.stack);
            return new EmbeddedResponse(`\`\`\`${err}\`\`\``).addTitle('👎 Error!');
        }

    }

}

module.exports = new Evaluate();