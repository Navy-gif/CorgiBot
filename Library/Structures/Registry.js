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
                    this.groups.get(dir.name).set(cmd, command);
                    this.commands.set(cmd, command);

                });

            }

        }

        logger.print('Commands loaded.');

    }

}

module.exports = Registry;