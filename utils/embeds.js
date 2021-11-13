const { MessageEmbed } = require('discord.js');

module.exports = {
    missingPermsAdmin: new MessageEmbed()
        .setTitle('Missing Permissions!')
        .setColor('#cc0000')
        .setDescription('You do not have the "Manage Server" permission'),
    missingPermsUser: new MessageEmbed()
        .setTitle('Missing Permissions!')
        .setColor('#cc0000')
        .setDescription('You do not have the role for using colors'),
    missingPermsBot: new MessageEmbed()
        .setTitle('Command failed!')
        .setColor('#cc0000')
        .setDescription('I do not have the ability to edit or create your role.\nMake sure I have role permissions and that there are no user roles above me!'),
};