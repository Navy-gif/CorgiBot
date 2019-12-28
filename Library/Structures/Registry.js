const { Collection } = require('discord.js');
const fs = require('fs');
const logger = require('../Utilities/Logger');

class Registry {

    /**
     *Creates an instance of Registry.
     * @param {String} path
     * @memberof Registry
     */
    constructor(path) {

        this.groups = new Collection();
        this.commands = new Collection();

        this.commandsPath = path;

    }

    init() {

        logger.print('Loading commands:');

        let commandsFolder = fs.readdirSync(this.commandsPath, { withFileTypes: true });
        
        for(let dir of commandsFolder) {

            if(dir.isDirectory()) {

                logger.print(`  Loading group: ${dir.name}`);

                fs.readdirSync(`${this.commandsPath}\\${dir.name}`).forEach(cmd => {

                    logger.print(`    Loading command: ${cmd}`);

                    let cmdPath = `${this.commandsPath}\\${dir.name}\\${cmd}`;
                    let command = require(cmdPath);

                    if(!this.groups.has(dir.name)) this.groups.set(dir.name, new Collection());
                    this.groups.get(dir.name).set(command.name, command);
                    this.commands.set(command.name, command);
                    command.group = dir.name;

                });

            }

        }

        logger.print('Commands loaded.');

    }

    /**
     * Fetch a command from the registry
     * @param {String} cmd name or alias of the command
     * @returns {Command} returns a command matching the cmd search word, false if no command found
     * @memberof Registry
     */
    find(cmd) {

        logger.debug('Attempting to find command: ' + cmd);

        let command = this.commands.get(cmd);
        if(command) return command;

        command = this.commands.find(val => {return val.aliases.includes(cmd)});
        if(command) return command;

        return false;

    }

}

module.exports = Registry;