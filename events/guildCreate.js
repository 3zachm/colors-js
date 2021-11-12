const { guildCreate } = require("../utils/database");

module.exports = {
	name: 'guildCreate',
	once: false,
	async execute(guild) {
		guildCreate(guild.id);
	},
};