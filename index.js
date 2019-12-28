process.on('warning', (warning) => {
	console.log(warning.name);
	console.log(warning.message);
	console.log(warning.stack);
});

module.exports = {
	bot: null,
	started: ~~(Date.now()/1000),
	devs: [],
	util: {}
}

require('./Library/Utilities/Startup').init();