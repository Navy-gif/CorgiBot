const Response = require('./Response');

class EmbeddedResponse extends Response {

    constructor(text) {

        super(text);
        this.color = 2087002;
        this.fields = [];

    }

    /**
     * Change the title of the embed.
     *
     * @param {String} text The text the title should be changed to.
     * @returns Itself for chaining purposes.
     * @memberof EmbeddedResponse
     */
    addTitle(text) {
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
    addTimestamp() {
        this.timestamp = new Date();
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
    addFooter(obj) {
        this.footer = obj;
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
    addField(field) {
        this.fields.push(field);
        return this;
    }

}

module.exports = EmbeddedResponse;