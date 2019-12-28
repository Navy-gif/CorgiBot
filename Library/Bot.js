const djs = require('discord.js');
const index = require('../index');
const logger = require('./Utilities/Logger');
const Registry = require('./Structures/Registry');
const GuildData = require('./Structures/GuildData');
const EmbeddedResponse = require('./Structures/EmbeddedResponse');
const Response = require('./Structures/Response');

class Bot {

    constructor() {

        this.registry;
        this.directory;
        this.client;
        this.prefixes = [];
        this.DataStore = new djs.Collection();

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

        //Load guild data
        logger.print('Loading guild settings:');
        for(let guild of this.client.guilds.array()) {

            logger.print(`  Loading settings for: ${guild.name}`);
            let gd, data = await index.database.findOne('discord_guilds', { id: guild.id });
            if(!data) {
                gd = new GuildData({ id: guild.id });
                gd.update();
            }
            else gd = new GuildData(data);
            this.DataStore.set(gd.id, gd);

        }

        logger.print('DONE.');
        return this;

    }

    createListeners() {

        logger.print('Setting up listeners.');

        this.client.on('ready', () => logger.print('Bot is ready, awaiting instructions.'))

        this.client.on('message', async message => await this.handleMessage(message));

    }

    async handleMessage(message) {

        if(message.author.bot) {
            //logger.debug('Author is bot, ignoring.');
            return;
        }

        logger.debug('Incoming message: ' + message.content);

        let command, original = message.content;
        message.content = message.content.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, "\"");

        //Parse prefix
        let prefixFound = false;
        for(let prefix of this.prefixes) {
            
            if(message.content.startsWith(prefix)) {
                logger.debug('Found prefix!');
                message.content = message.content.replace(prefix, '').trim();
                prefixFound = true;
                break;
            }

        }
        if(!prefixFound) return;

        //Find command
        command = message.content.split(' ')[0];
        logger.debug('Potential command: ' + command);
        message.content = message.content.replace(command, '').trim();
        command = this.registry.find(command.toLowerCase());
        
        if(!command) {
            logger.debug('Command not found.');
            return;
        }
        logger.debug('Command found.');

        //See if the user has necessary perms
        let gd = this.getData(message.guild.id);
        let punishments = ['DEATH BY HANGING', 'DEATH BY FIRING SQUAD', 'DEATH BY DROWNING', 'DEATH BY BEHEADING', 'DEATH BY ASPHYXIATION', 'INDEFINITE INVOLUNTARY SERVITUDE','NONE','PERMANENT BAN'];
        if(command.devOnly && !index.devs.includes(message.author.id)) {
            if(gd.settings.ignore && gd.settings.ignore.includes(message.channel.id)) return;
            else {
                await message.channel.send(`Insufficient permissions.\nPunishment: \`[${punishments[~~(Math.random()*punishments.length)]}]\``).catch(err => logger.error(err));
                return;
            }
        }

        //Parse args here
        let argReg = /("[^"']*"|[^"'\s]+)(\s+|$)/img;
        let args = message.content.match(argReg) || [];
        for(let arg of args) arg = arg.replace(/['"\n]/g, '').trim().toLowerCase();

        //Await for command response
        let response = await command.call({
            message: message,
            content: message.content,
            raw: original,
            channel: message.channel,
            guild: message.guild,
            author: message.author,
            args: args
        }).catch(err => {
            logger.error(err);
            return `Command errored with message: \`${err.getPub()}\``
        });

        logger.debug('Args: [ ' + args.join(', ') + ' ]');
        logger.debug('Command response: ' + response);

        if(!response) return;

        if(response instanceof EmbeddedResponse) await message.channel.send({embed: response});
        else await message.channel.send(response.toString());

    }

    getData(id) {

        return this.DataStore.get(id);

    }

    hasPerms(member) {



    }

}

module.exports = new Bot();