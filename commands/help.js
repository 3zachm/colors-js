const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List all commands'),
	async execute(interaction) {
        const client = interaction.client;
        const embed = new EmbedBuilder()
            .setTitle('Base Commands')
            .setColor('#a277ad')
            .setDescription('Use autocomplete for more information, or see [here](https://github.com/3zachm/colors-js)\nYou can contact me as shown in the contact section of our [ToS](https://3zachm.dev/asayake/legal) \nfor data inquiries or support');
        client.commands.forEach(command => {
            embed.addFields({ name: `/${command.data.name}`, value: `${command.data.description}`, inline: false });
        });
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};