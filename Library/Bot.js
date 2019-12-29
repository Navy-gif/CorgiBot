const djs = require('discord.js');
const index = require('../index');
const logger = require('./Utilities/Logger');
const Registry = require('./Structures/Registry');
const GuildData = require('./Structures/GuildData');
const EmbeddedResponse = require('./Structures/EmbeddedResponse');
const CommandError = require('./Structures/CommandError');

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
        this.registry.loadTemplateCommands('Animals', Object.keys(index.animals));

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

        this.client.on('guildCreate', guild => { logger.print(`Bot joined ${guild.name} (${guild.id})`) });

        this.client.on('guildDelete', guild => { logger.print(`Bot left ${guild.name} (${guild.id})`) });

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
        
        if((command.devOnly && !index.devs.includes(message.author.id)) || (command.perms && command.perms.length > 0) || (command.contributor && !index.contrubors.includes(message.author.id) && !index.devs.includes(message.author.id))) {
            if(gd.settings.ignore && gd.settings.ignore.includes(message.channel.id)) return;
            else {
                await message.channel.send(`Insufficient permissions.\nPunishment: \`[${punishments[~~(Math.random()*punishments.length)]}]\``).catch(err => logger.error(err));
                return;
            }
        } /*else if(command.perms && command.perms.length > 0) {

        } else if(command.contributor && !index.contrubors.includes(message.author.id) && !index.devs.includes(message.author.id))*/

        //Parse args
        let argReg = /("[^"']*"|[^"'\s]+)(\s+|$)/img;
        let args = message.content.match(argReg) || [];
        for(let i = 0; i < args.length; i++) args[i] = args[i].replace(/['"\n]/g, '').toLowerCase().trim();
        logger.debug('Args: [ ' + args.join(', ') + ' ]');

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
            logger.error(err.stack);
            if(err instanceof CommandError) return `Command errored with message: \`${err.getPub()}\``;
            else return `An internal error occurred!`;
        });

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

    /**
     * Converts the difference in time to more human readable times
     *
     * @param {Int} diff The time difference in seconds.
     * @param {boolean} [extraMin=false] Display additional minutes after hours (ex. 1 hour 30 minutes instead of 1 hour)
     * @param {boolean} [extraHours=false] Display additional hours after days (ex. 1 day 2 hours instead of 1 day)
     * @param {boolean} [extraDays=false] Display additional days after weeks and months (ex. 1 week 3 days instead of 1 week)
     * @returns A string representation of the time difference (ex. diff=3600 would return 1 hour)
     * @memberof Bot
     */
    timeAgo(diff, extraMin = false, extraHours = false, extraDays = false) {

        diff = parseInt(diff);
        if(isNaN(diff)) return 'that ain\'t it chief (not a number)';
    
        let years = ~~(diff/60/60/24/365),
            months = ~~(diff/60/60/24/30.4),
            weeks = extraDays ? ~~(diff/60/60/24/7) : (diff/60/60/24/7).toFixed(),
            days = extraHours ? ~~(diff/60/60/24) : (diff/60/60/24).toFixed(),
            hours = extraMin ? ~~(diff/60/60) : (diff/60/60).toFixed(),
            minutes = (diff/60).toFixed();
    
        if(days > 365){
          return `${years > 0 ? years : 1} year${years > 1 ? 's' : ''} ${months%12 > 0 ? `${months%12} month${months%12 > 1 ? 's':''}` : ''}`;
        } else if(weeks > 4){
          return `${months} month${months%12 > 1 ? 's' : ''} ${days%30 > 0 ? `${days%30} day${days%30 > 1 ? 's' : ''}` : ''}`;
        } else if(days >= 7) {
          return `${weeks} week${weeks > 1 ? 's' : ''} ${extraDays && days%7 > 0 ? `${days%7} day${days%7 > 1 ? 's' : ''}` : '' }`
        } else if(hours >= 24){
          return `${days} day${days > 1 ? 's' : ''} ${extraHours && hours%24 > 0 ? `${hours%24} hour${hours%24 > 1 ? 's' : ''}` : ''}`;
        } else if(minutes >= 60) {
          return `${hours} hour${hours > 1 ? 's' : ''} ${extraMin && minutes%60 > 0 ? `${minutes%60} minute${minutes%60 > 1 ? 's' : ''}` : '' }`;
        } else if(diff >= 60) {
          return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
          return diff.toFixed() + ` second${diff.toFixed() != 1 ? 's' : ''}`;
        }
    
      }

}

module.exports = new Bot();