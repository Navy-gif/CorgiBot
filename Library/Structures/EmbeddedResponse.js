const Response = require('./Response');

class EmbeddedResponse extends Response {

    constructor(text = '') {

        super(text);
        this.color = 2087002;
        this.fields = [];

    }

    /**
     * Set the main body of the embed.
     *
     * @param {String} text
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    setDescription(text) {
        super.description = text;
        return this;
    }

    /**
     * Change the title of the embed.
     *
     * @param {String} text The text the title should be changed to.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    setTitle(text) {
        this.title = text;
        return this;
    }

    /**
     * Change the color of the embed.
     *
     * @param {Integer} color The desired color in integer format.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    changeColor(color) {
        this.color = parseInt(color);
        return this;
    }

    /**
     * Add the timestamp field to the embed.
     *
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addTimestamp(date) {
        this.timestamp = date || new Date();
        return this;
    }

    /**
     * Add a URL to the embed title.
     *
     * @param {String} url The URL to be set.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addURL(url) {
        this.url = url;
        return this;
    }

    /**
     * Add a footer to the embed.
     *
     * @param {Object} obj Footer object, see Discord API documentation for further instructions.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addFooter(text, icon) {
        if(!text) return this;
        this.footer = { text: text, icon: icon };
        return this;
    }

    /**
     * Add an image to the embed.
     *
     * @param {String} url Link to the image to be displayed.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addImage(url) {
        this.image = { url: url };
        return this;
    }

    /**
     * Add an author property to the embed
     *
     * @param {String} name The name of the author.
     * @param {String} [icon=false] Link to the author's icon.
     * @param {String} [url=false] Link to be added to the author.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addAuthor(name, icon = false, url = false) {
        this.author = { name: name };
        if(icon) this.author.icon_url = icon;
        if(url) this.author.url = url;
        return this;
    }

    /**
     * Add a custom field to the embed.
     *
     * @param {Object} field Field object, see Discord API documentation for further instructions.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addFieldObject({ name, value, inline = false }) {
        if(this.fields.length >= 25) {
            logger.error('Embed cannot have more than 25 fields! The exceeding fields are ignored.')
            return this;
        }
        this.fields.push({ name: name, value: value, inline: inline });
        return this;
    }

    /**
     * Add a custom field to the embed.
     *
     * @param {String} name The name of the field.
     * @param {String} value The text the field should display.
     * @param {boolean} [inline=false] Whether or not the field is displayed inline.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addField(name, value, inline = false) {
        if(this.fields.length >= 25) {
            logger.error('Embed cannot have more than 25 fields! The exceeding fields are ignored.')
            return this;
        }
        this.fields.push({ name: name, value: value, inline: inline });
        return this;
    }

}

module.exports = EmbeddedResponse;