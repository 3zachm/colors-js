const { guildDelete } = require("../utils/database");

module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild) {
		guildDelete(guild.id);
	},
};