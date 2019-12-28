const djs = require('discord.js');
const index = require('../index');
const logger = require('./Utilities/Logger');
const Registry = require('./Structures/Registry');

class Bot {

    constructor() {

        this.registry;
        this.directory;
        this.client;
        this.prefixes = [];
        this.settings;

    }

    async init(directory, config) {

        //Start the bot
        logger.print('Starting bot.');
        this.directory = directory;
        this.client = new djs.Client({ disableEveryone: true });

        //Set up listener(s)
        this.createListeners();

        //Load commands
        this.registry = new Registry(`${this.directory}\\Library\\Commands`);
        this.registry.init();

        //Log in
        logger.print('Logging in to Discord.');
        await this.client.login(config.token);
        logger.print(`Logged in as ${this.client.user.tag}!`);

        //Set up prefixes
        this.prefixes.push(config.prefix);
        this.prefixes.push(`<@${this.client.user.id}>`, `<@!${this.client.user.id}>`, `<@${this.client.user.id}> `, `<@!${this.client.user.id}> `);
        logger.debug('Prefixes: ' + this.prefixes.join(', '));



    }

    createListeners() {

        logger.print('Setting up listeners.');

        this.client.on('ready', () => logger.print('Bot is ready, awaiting instructions.'))

        this.client.on('message', async message => {

            logger.debug('Incoming message: ' + message.content);
            if(message.author.bot) {
                //logger.debug('Author is bot, ignoring.');
                return;
            }

            let command, original = message.content;

            for(let prefix of this.prefixes) {
                
                if(message.content.startsWith(prefix)) {
                    logger.debug('Found prefix!');
                    message.content = message.content.replace(prefix, '').trim();
                    break;
                }

            }

            command = message.content.split(' ')[0];
            logger.debug('Potential command: ' + command);
            message.content.replace(command, '').trim();
            command = this.registry.find(command.toLowerCase());
            if(!command) {
                logger.debug('Command not found.');
                return;
            }
            logger.debug('Command found.');

            //Parse args here
            let args = [];

            //Await for command response
            let response = await command.call({
                message: message,
                content: message.content,
                raw: original,
                channel: message.channel,
                guild: message.guild,
                user: message.author,
                args: args
            });

            logger.debug('Command response: ' + response);

            if(typeof response === 'string') {
                await message.channel.send(response);
            }

        });

    }

}

module.exports = new Bot();