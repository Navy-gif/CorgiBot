const index = require('../../index');
const logger = require('../Utilities/Logger');

class GuildData {

    constructor(data) {

        this.id;
        this.settings;

        for(let prop in data) {
            if(prop === '_id') continue;
            this[prop] = data[prop];
        }

    }

    async update() {

        logger.debug(`Updating data for: ${this.id}`);
        let result = await index.database.updateOne('discord_guilds', { id: this.id }, this, true);
        logger.debug(JSON.stringify(result));

    }

}

module.exports = GuildData;