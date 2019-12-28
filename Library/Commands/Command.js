class Command {

    constructor(data) {

        this.name = data.name;
        this.aliases = data.aliases || [];
        this.group;

    }

    async call() {

        return `This command (${this.name}) has yet to be defined.`;

    }

}

module.exports = Command;