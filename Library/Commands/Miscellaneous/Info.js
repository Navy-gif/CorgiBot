const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const index = require('../../../index');

class Info extends Command {

    constructor() {

        super({
            name: 'info',
            aliases: [ 'stats' ]
        });

    }

    async call() {

        let animals = [];
        for(let animal of Object.keys(index.animals)) animals.push(`${animal[0].toUpperCase() + animal.substring(1)}s: ${index.animals[animal].length}`);

        let contributors = [];
        for(let contributor of index.contributors) contributors.push(await index.bot.client.fetchUser(contributor).then(user => { return user.tag }));

        return new EmbeddedResponse('CorgiBot is a simple bot made purely for the purpose of displaying images of corgis (and a few other breeds or animals).')
        .addAuthor('CorgiBot', index.bot.client.user.avatarURL)
        .addField('**Stats**', `Uptime: ${index.bot.timeAgo(~~(Date.now()/1000) - index.started)}\nMemory usage: ${~~(process.memoryUsage().heapUsed / 1024 / 1024)}MB\nGuilds: ${index.bot.client.guilds.size}`, true)
        .addField('**Animal counts**', `${animals.join('\n')}`, true)
        .addField('**Image contributors**', `${contributors.join('\n')}`)
        .addFooter(`Developer: ${await index.bot.client.fetchUser(index.devs[0]).then(user => { return user.tag })}`)

    }

}

module.exports = new Info();