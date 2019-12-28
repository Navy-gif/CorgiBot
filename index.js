process.on('warning', (warning) => {
	console.log(warning.name);
	console.log(warning.message);
	console.log(warning.stack);
});

module.exports = {
	bot: null,
	started: ~~(Date.now()/1000),
	devs: ['132777808362471424'],
	util: {},
	debug: true,
	db: null,
	database: null
}

require('./Library/Utilities/Startup').init();