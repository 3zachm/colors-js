const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Get an invite link for the bot'),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor('#a277ad')
            .setTitle("Invite Link")
			.setDescription("You can invite me quickly through [here](https://discord.com/api/oauth2/authorize?client_id=907538185976946720&permissions=268438528&scope=applications.commands%20bot) or through my [website](https://3zachm.dev/Asayake/)");
		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};