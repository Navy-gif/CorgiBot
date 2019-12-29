process.on('warning', (warning) => {
	console.log(warning.name);
	console.log(warning.message);
	console.log(warning.stack);
});

module.exports = {
	bot: null,
	started: ~~(Date.now()/1000),
	devs: ['132777808362471424'],
	contributors: ['244897255260160001', '296320072379662336'],
	util: {},
	debug: true,
	db: null,
	database: null,
	animals: {}
}

require('./Library/Utilities/Startup').init();