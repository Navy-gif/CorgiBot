class Response {

    constructor(message) {

        this.description = message;

    }

    toString() {
        return this.description;
    }

}

module.exports = Response;