const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { guildSetRole, guildGetRole } = require('../utils/database');
const { missingPermsAdmin } = require('../utils/embeds');

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
			let embed = missingPermsAdmin;
			const role = interaction.options.getRole('role');
			if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				guildSetRole(interaction.guild.id, role.id);
				embed = new EmbedBuilder()
					.setTitle(`Role changed successfully!`)
					.setColor(0x00CC66)
					.setDescription(`Role changed to <@&${role.id}>`);
			}
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
		else if (interaction.options.getSubcommand() === "view") {
			guildGetRole(interaction.guild.id, async result => {
				let message = `The current color role is <@&${result}>`;
				if (result === "0") {
					message = 'Everyone can use color roles. Set a defined role with `/role set`';
				}
				const embed = new EmbedBuilder()
					.setColor(0xa277ad)
					.setDescription(message);
				await interaction.reply({ embeds: [embed], ephemeral: false });
			});
		}
		else if (interaction.options.getSubcommand() === "reset") {
			let embed = missingPermsAdmin;
			if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
				guildSetRole(interaction.guild.id, "0");
				embed = new EmbedBuilder()
					.setTitle(`Role requirement removed successfully!`)
					.setColor(0x00CC66)
					.setDescription(`Everyone can now use colors.`);
			}
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};