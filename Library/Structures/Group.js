const { Collection } = require('discord.js');

class Group {

    constructor(name) {
        this.name = name;
        this.commands = new Collection();
    }

    get(key) {
        return this.commands.get(key);
    }

}