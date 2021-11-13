const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check if I\'m online'),
	async execute(interaction) {
		await interaction.reply({ content: `yo`, ephemeral: true });
	},
};