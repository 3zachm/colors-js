const { SlashCommandBuilder } = require('@discordjs/builders');
// const { Permissions } = require('discord.js');
const { guildGetRole } = require('../utils/database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('View or edit your current color')
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('View your current color'),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('Set your color!')
				.addStringOption(option =>
					option.setName('color')
						.setDescription('Color you want (#000000 hex format)')
						.setRequired(true)),
			)
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Remove your color role'),
        ),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === "set") {
			let message = 'You don\'t have permission to run this command';
			const color = interaction.options.getString('color');
			guildGetRole(interaction.guild.id, async result => {
				if (interaction.member.roles.cache.has(result) || result === "0") {
					const roleName = "USER-" + interaction.member.id;
					const userRole = interaction.guild.roles.cache.find(role => role.name === roleName);

					if (userRole == undefined) {
						const highest = interaction.guild.me.roles.highest.position;
						message = `Color created!`;
						const colorRole = await interaction.guild.roles.create({
							name: roleName,
							color: color, // change
							reason: 'Color role update by slash command',
							position: highest - 1,
							permissions: [],
						})
							.catch(console.error); // UPDATE ERROR HANDLING
						interaction.member.roles.add(colorRole);
					}
					else {
						if (!interaction.member.roles.cache.has(userRole)) {
							interaction.member.roles.add(userRole);
						}
						message = `Role Updated`;
						interaction.guild.roles.edit(userRole, { color: color });
					}
					await interaction.reply({ content: message, ephemeral: false });
				}
				else {
					await interaction.reply({ content: message, ephemeral: false });
				}
			});
		}
		else if (interaction.options.getSubcommand() === "view") {
			let message = 'Command failed';
			const roleName = "USER-" + interaction.member.id;
			const userRole = interaction.guild.roles.cache.find(role => role.name === roleName);

			if (userRole == undefined) {
				message = `You have no color set`;
			}
			else {
				message = userRole.hexColor;
			}
			await interaction.reply({ content: message, ephemeral: false });
		}
		else if (interaction.options.getSubcommand() === "reset") {
			let message = 'You don\'t have permission to run this command';
			guildGetRole(interaction.guild.id, async result => {
				if (interaction.member.roles.cache.has(result) || result === "0") {
					const roleName = "USER-" + interaction.member.id;
					const userRole = interaction.guild.roles.cache.find(role => role.name === roleName);

					if (userRole == undefined) {
						message = `You already have no color`;
					}
					else {

						message = `Role deleted`;
						userRole.delete();
					}
					await interaction.reply({ content: message, ephemeral: false });
				}
				else {
					await interaction.reply({ content: message, ephemeral: false });
				}
			});
		}
	},
};