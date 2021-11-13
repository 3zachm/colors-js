const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List all commands'),
	async execute(interaction) {
        const client = interaction.client;
        const embed = new MessageEmbed()
            .setTitle('Base Commands')
            .setColor('#a277ad')
            .setDescription('Use autocomplete for more information, or see [here](https://github.com/3zachm/colors-js)');
        client.commands.forEach(command => {
            embed.addField(`/${command.data.name}`, `${command.data.description}`, false);
        });
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};