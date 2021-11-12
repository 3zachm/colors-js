const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { guildSetRole, guildGetRole } = require('../utils/database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('View or change the role that can use colors')
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('View the current set role'),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('Set the role that can use colors')
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('The minimum role that can change colors')
						.setRequired(true)),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('reset')
				.setDescription('Remove role requirement to use colors'),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === "set") {
			let message = 'You don\'t have permission to run this command';
			const role = interaction.options.getRole('role');
			if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
				guildSetRole(interaction.guild.id, role.id);
				message = `Role changed to <@&${role.id}> successfully.`;
			}
			await interaction.reply({ content: message, ephemeral: false });
		}
		else if (interaction.options.getSubcommand() === "view") {
			guildGetRole(interaction.guild.id, async result => {
				let message = `The current color role is <@&${result}>`;
				if (result === "0") {
					message = 'Everyone can use color roles. Set a defined role with `/role set`';
				}
				await interaction.reply({ content: message, ephemeral: false });
			});
		}
		else if (interaction.options.getSubcommand() === "reset") {
			let message = 'You don\'t have permission to run this command';
			if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
				guildSetRole(interaction.guild.id, "0");
				message = `Role requirement removed successfully!`;
			}
			await interaction.reply({ content: message, ephemeral: false });
		}
	},
};