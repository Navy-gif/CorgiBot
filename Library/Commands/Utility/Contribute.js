const Command = require('../Command');
const EmbeddedResponse = require('../../Structures/EmbeddedResponse');
const index = require('../../../index');
const animals = index.animals;
const db = index.database;
const logger = require('../../Utilities/Logger');

class Contribute extends Command {

    constructor() {

        super({
            name: 'contribute',
            contributor: true,
            devOnly: false,
            usage: 'TBD'
        });

    }

    async call({ message, author, args }) {

        if(args.length === 0) return this.usage;

        let method = args.shift(),
            fileFormats = ['png', 'jpg', 'jpeg', 'gif'],
            links = [],
            animal;

        if(method === 'add') {

            animal = args.shift();

            if(animal === 'category') {

                if(!index.devs.includes(author.id)) return new EmbeddedResponse('Insufficient permissions!').setTitle('**Error** ⚠️');
                if(args.length === 0) return new EmbeddedResponse('Provide a category name!').setTitle('**Error** ⚠️');

                let name = args.shift().toLowerCase();
                index.animals[name] = [];
                let error
                let result = await db.updateOne('animals', { type: name }, { type: name, images: index.animals[name] }, true).catch(err => error = err);

                if(error) {
                    logger.error(error);
                    return new EmbeddedResponse('Something went wrong with inserting to database.').setTitle('**Error** ⚠️');
                } else {
                    logger.print(`${author.tag} (${author.id}) created a new animal collection for ${name}. Result: ${JSON.stringify(result)}`);
                    return new EmbeddedResponse(`Successfully created ${name} collection!`).setTitle('Success!');
                }

            } else {

                if(!Object.keys(animals).includes(animal)) return new EmbeddedResponse('Invalid animal type or breed!').setTitle('**Error** ⚠️');

                if(!args[0] && message.attachments.size === 0) return new EmbeddedResponse('Provide a URL to an image!').setTitle('**Error** ⚠️');
    
                if(message.attachments.size > 0) {
    
                    message.attachments.forEach(att => {
                        if(att.height > 0 && att.width > 0 && !animals[animal].includes(att.url)) {
                            links.push(att.url);
                            animals[animal].push(att.url);
                        }
                    });
                    
                }
    
                for(let arg of args) for(let format of fileFormats) if(arg.toLowerCase().endsWith(format) && !animals[animal].includes(arg)) {
                    animals[animal].push(arg);
                    links.push(arg);
                }
    
                if(links.length === 0) return new EmbeddedResponse(`No recognized links nor attachments were found!\n\nMake sure your links and/or images are of the following formats:\n${fileFormats.join(', ')}`).setTitle('Error!');
    
                let error;
                let result = await db.push('animals', { type: animal }, { images: { $each: links } }).catch(err => error = err);
                
                if(error) {
                    logger.error(error);
                    return new EmbeddedResponse(`Failed to add ${links.length} image${links.length > 1 ? 's' : ''} to the ${animal} collection.`).setTitle('Error!');
                } else {
                    logger.print(`${author.tag} (${author.id}) contributed by adding the following image(s) (${links.join(', ')}) to the ${animal} collection. Result: ${JSON.stringify(result)}`);
                    return new EmbeddedResponse(`Successfully added ${links.length} images to the ${animal} collection!`).setTitle('Success!');
                }

            }
            
        }  
    }

}

module.exports = new Contribute();