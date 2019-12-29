const index = require('../../index');
const logger = require('../Utilities/Logger');

class GuildData {

    constructor(data) {

        this.id;
        this.settings;
        this.perms = {};
        this.guild;

        for(let prop in data) {
            if(prop === '_id') continue;
            this[prop] = data[prop];
        }

    }

    async update() {

        logger.debug(`Updating data for: ${this.id}`);
        let error, gd = {};
        for(let prop in this) {
            if(prop === 'guild') continue;
            gd[prop] = this[prop];
        }
        let result = await index.database.updateOne('discord_guilds', { id: this.id }, gd, true).catch(err => error = err);
        logger.debug(JSON.stringify(result));
        if(error) {
            logger.error(error.stack);
            throw error;
        }

    }

    resolveRole(input) {

        let guild = this.guild;
        input = input.toLowerCase();

        if(guild.roles.has(input)){
          return guild.roles.get(input);
        }
    
        let reg = /^\<\@\&([0-9]*)\>/i;
        if(reg.test(input)){
          let match = input.match(reg);
          let roleid = match[1];
          return guild.roles.get(roleid);
        }

        let possibilities = guild.roles.filter((r)=>{
          return r.name.toLowerCase() == input || r.name.toLowerCase().startsWith(input);
        });

        if(possibilities.array().length > 0){
          return possibilities.array()[0];
        }

        return false;

    }

    resolveChannel(val) {

        let channels = this.guild.channels;
        if(!val) return false;
        let ch1 = /^\#([a-z0-9\-\_0]*)/i;
        let ch2 = /^\<\#([a-z0-9\-\_0]*)\>/i;
        if(ch1.test(val)){
    
            // Match by string #channel name
            let m = val.match(ch1);
            let name = m[1];

            let result = channels.filter((c)=>{
                return name.toLowerCase() == c.name;
            });

            if(result.array().length>0){
                return result.array()[0];
            }

            return false;

        } else if(ch2.test(val)){
      
            let m = val.match(ch2);
            let id = m[1];
            let result = channels.filter((c)=>{
                return c.id == id;
            });

            if(result.array().length>0){
                return result.array()[0];
            }

            return false;

        } else {

            // Match by name directly.
            let result = channels.filter((c)=>{
                return val.toLowerCase() === c.name.toLowerCase().replace(/'/g,'');
            });
      
            if(result.array().length>0){
                return result.array()[0];
            }

            if(channels.get(val)){
                return channels.get(val);
            }

            return false;
        }

    }

}

module.exports = GuildData;