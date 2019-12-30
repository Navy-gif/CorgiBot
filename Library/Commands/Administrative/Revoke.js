const Command = require('../Command');
const CommandError = require('../../Structures/CommandError');
const logger = require('../../Utilities/Logger');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');

class Revoke extends Command {

    constructor() {

        super({
            name: 'revoke',
            aliases: [],
            perms: [ 'admin', 'revoke' ]
        });

    }

    async call({ args, guilddata, bot, raw }) {

        if(args.length < 2) {
            return new EmbeddedResponse('Too few arguments provided').setTitle('**Error**');
        }

        let channel, role = guilddata.resolveRole(args.shift());
        if(!role) return new EmbeddedResponse('The role argument you provided didn\'t resolve to a role.').setTitle('**Error**');

        let channelReg = / in (#?[a-z-]{2,100}|<#[0-9]{17,22}>)/i;
        if(channelReg.test(raw)) {
            let m = raw.match(channelReg);
            channel = guilddata.resolveChannel(m[1]);
            args.splice(args.length-2, 2);
            if(args.length === 0) {
                return new EmbeddedResponse('Too few arguments provided').setTitle('**Error**');
            }
        }

        let perms = guilddata.perms
        if(!perms.granted) perms.granted = { server: {}, channels: {} };
        if(!perms.revoked) perms.revoked = { server: {}, channels: {} };

        let existingpermsG = channel ? (guilddata.perms.granted.channels[channel.id] ? guilddata.perms.granted.channels[channel.id] : {}) : guilddata.perms.granted.server;
        let existingpermsR = channel ? (guilddata.perms.revoked.channels[channel.id] ? guilddata.perms.revoked.channels[channel.id] : {}) : guilddata.perms.revoked.server;
        let validperms = [];
        let alreadyhas = [];
        let invalid = [];

        for(let perm of args) {

            if(bot.perms.includes(perm) && ((existingpermsR[perm] && !existingpermsR[perm].includes(role.id)) || !existingpermsR[perm]) && !validperms.includes(perm)) validperms.push(perm);
            else if(bot.perms.includes(perm) && existingpermsR[perm] && existingpermsR[perm].includes(role.id)) alreadyhas.push(perm);
            else if(!bot.perms.includes(perm)) invalid.push(perm);

        }

        if(channel) {

            if(!perms.granted.channels[channel.id]) perms.granted.channels[channel.id] = {};
            if(!perms.revoked.channels[channel.id]) perms.revoked.channels[channel.id] = {};

            for(let perm of validperms) {
                perms.revoked.channels[channel.id][perm] ? perms.revoked.channels[channel.id][perm].push(role.id) : perms.revoked.channels[channel.id][perm] = [ role.id ];
                perms.granted.channels[channel.id][perm] ? (perms.granted.channels[channel.id][perm].includes(role.id) ? perms.granted.channels[channel.id][perm].splice(perms.granted.channels[channel.id][perm].indexOf(role.id), 1) : undefined ) : perms.granted.channels[channel.id][perm] = [ ];
            }
        }
        else for(let perm of validperms) {
            perms.revoked.server[perm] ? perms.revoked.server[perm].push(role.id) : perms.revoked.server[perm] = [ role.id ];
            perms.granted.server[perm] ? (perms.granted.server[perm].includes(role.id) ? perms.granted.server[perm].splice(perms.granted.server[perm].indexOf(role.id), 1) : undefined ) : perms.granted.server[perm] = [ ];
        }

        let error;
        await guilddata.update().catch(err => error = err);
        if(error) return new EmbeddedResponse(`The command errored while inserting to the database.`).setTitle('Error.');

        let out;
        if(validperms.length > 0) out = `Successfully revoked from **${role.name}** the following perms${channel ? ` in **${channel.name}**` : ''}:\n${validperms.join(', ')}`;
        else out = `Failed to revoke any permissions from **${role.name}**.`;
        if(alreadyhas.length > 0) `\n\n${role.name} already didn't have these permissions:\n${alreadyhas.join(', ')}`;
        if(invalid.length > 0) `\n\nThe following permissions are invalid:\n${invalid.join(', ')}`;

        console.log(validperms, alreadyhas, invalid);
        return new EmbeddedResponse(out).setTitle(`${validperms.length > 0 ? 'Success!': 'Failure.'}`);

    }

}

module.exports = new Revoke();