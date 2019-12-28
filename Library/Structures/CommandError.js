class CommandError extends Error {

    constructor(message, publicmsg) {

        super(message);
        this.publicmsg = publicmsg;

    }

    getPub() {
        return this.publicmsg;
    }

}

module.exports = CommandError;