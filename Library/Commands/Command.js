class Command {

    constructor(data) {

        this.name = data.name;
        this.aliases = data.aliases || [];
        this.group;
        this.devOnly = data.devOnly || false;
        this.perms = data.perms || false;

    }

    call() {

        return new Promise((resolve, reject) => {
            resolve(`This command (${this.name}) has yet to be defined.`);
        });

    }

}

module.exports = Command;