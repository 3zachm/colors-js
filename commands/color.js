const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const { Constants } = require('discord.js');
const { colorCanvas } = require('../utils/colorCanvas');
const { guildGetRole } = require('../utils/database');
const { missingPermsUser, missingPermsBot } = require('../utils/embeds');

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
						.setDescription('Valid hex color (#000000), hashtag can be omitted')
						.setRequired(true)),
			)
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Remove your color role'),
        ),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === "set") {
			let embed = missingPermsUser;
			const colorHash = "#" + interaction.options.getString('color').replaceAll('#', '');
			let color = colorHash;

			if (!(colorHash.length < 8 && /^#[0-9A-F]{6}$/i.test(colorHash))) {
				console.log(">:(")
				embed.setTitle('Invalid color');
				embed.setDescription('Please use a valid hex color (`#000000`)\nHashtag can be omitted');
				await interaction.reply({ embeds: [embed], ephemeral: true });
				return;
			}

			if (colorHash === "#000000") { color = "BLACK"; }

			guildGetRole(interaction.guild.id, async result => {
				if (interaction.member.roles.cache.has(result) || result === "0") {
					const roleName = "USER-" + interaction.member.id;
					const userRole = interaction.guild.roles.cache.find(role => role.name === roleName);

					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId('color_yes')
								// .setEmoji('✅')
								.setLabel('Yes')
								.setStyle('Success'),
						)
						.addComponents(
							new ButtonBuilder()
								.setCustomId('color_no')
								// .setEmoji('❌')
								.setLabel('No')
								.setStyle('Danger'),
						);
					const file = new AttachmentBuilder(colorCanvas(colorHash), { name: 'color.png' });
					embed = new EmbedBuilder()
						.setColor(colorHash)
						.setTitle('Do you want this color?')
						.setImage('attachment://color.png');
					await interaction.reply({ embeds: [embed], files:[file], components: [row], ephemeral: false });

					const filter = (buttonInt) => {
						return interaction.user.id === buttonInt.user.id;
					};

					const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000 });

					collector.on('collect', async (buttonInt) => {
						if (buttonInt.customId === 'color_yes') {
							if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
								embed = missingPermsBot;
								embed.setImage('attachment://color.png');
								await interaction.editReply({ embeds: [embed], components: [], files:[file], ephemeral: false });
								return;
							}
							if (userRole == undefined) {
								const highest = interaction.guild.members.me.roles.highest.position;
								const colorRole = await interaction.guild.roles.create({
									name: roleName,
									color: color, // change
									reason: 'Color role update by slash command',
									position: highest,
									permissions: [],
								});
								interaction.member.roles.add(colorRole);
							}
							else {
								if (!interaction.member.roles.cache.has(userRole)) {
									if (!(interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles) && interaction.guild.members.me.roles.highest.position > userRole.position)) {
										embed = missingPermsBot;
										embed.setImage('attachment://color.png');
										await interaction.editReply({ embeds: [embed], components: [], files:[file], ephemeral: false });
										return;
									}
									else {
										interaction.member.roles.add(userRole);
									}
								}
								if (interaction.guild.members.me.roles.highest.position < userRole.position) {
									embed = missingPermsBot;
									embed.setImage('attachment://color.png');
									await interaction.editReply({ embeds: [embed], components: [], files:[file], ephemeral: false });
									return;
								}
								interaction.guild.roles.edit(userRole, { color: color });
							}
							embed.setDescription("Color updated").setTitle(" ");
							await interaction.editReply({ embeds: [embed], files:[file], components: [], ephemeral: false });
						}
						else if (buttonInt.customId === 'color_no') {
							embed.setDescription("Color not changed").setTitle(" ");
							await interaction.editReply({ embeds: [embed], files:[file], components: [], ephemeral: false });
						}
					});

					collector.on('end', async (collected, reason) => {
						if (reason === 'time') {
							embed.setDescription("Color not changed").setTitle(" ");
							await interaction.editReply({ embeds: [embed], files:[file], components: [], ephemeral: false }).catch(error => {
								if (error.code === Constants.APIErrors.UNKNOWN_MESSAGE) {
									return; // message was deleted
								}
								console.error(error);
							});
						}
					});
				}
				else {
					await interaction.reply({ embeds: [embed], ephemeral: false });
				}
			});
		}
		else if (interaction.options.getSubcommand() === "view") {
			let embed = new EmbedBuilder()
				.setDescription("Failed");
			const roleName = "USER-" + interaction.member.id;
			const userRole = interaction.guild.roles.cache.find(role => role.name === roleName);

			if (userRole == undefined) {
				embed = new EmbedBuilder()
					.setDescription("No color set");
				await interaction.reply({ embeds: [embed], ephemeral: false });
			}
			else {
				const file = new AttachmentBuilder(colorCanvas(userRole.hexColor), { name: 'color.png' });
				embed = new EmbedBuilder()
					.setColor(userRole.hexColor)
					.setImage('attachment://color.png')
					.setDescription("Your current color");
				await interaction.reply({ embeds: [embed], files:[file], ephemeral: false });
			}
		}
		else if (interaction.options.getSubcommand() === "reset") {
			let embed = missingPermsUser;
			guildGetRole(interaction.guild.id, async result => {
				if (interaction.member.roles.cache.has(result) || result === "0") {
					const roleName = "USER-" + interaction.member.id;
					const userRole = interaction.guild.roles.cache.find(role => role.name === roleName);

					if (userRole == undefined) {
						embed = new EmbedBuilder()
							.setDescription(`You already have no color`);
					}
					else {
						if (!(interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles) && interaction.guild.members.me.roles.highest.position > userRole.position)) {
							await interaction.reply({ embeds: [missingPermsBot], components: [], files:[], ephemeral: true });
							return;
						}
						embed = new EmbedBuilder()
							.setDescription(`Your color role has been reset`);
						userRole.delete();
					}
					await interaction.reply({ embeds: [embed], ephemeral: false });
				}
				else {
					await interaction.reply({ embeds: [embed], ephemeral: false });
				}
			});
		}
	},
};