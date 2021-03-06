const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');
const { token, topGG } = require('./config.json');
// eslint-disable-next-line no-unused-vars
const db = require('./utils/database');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

if (topGG != null) {
	const ap = AutoPoster(topGG, client);
	ap.on('error', (e) => {
		console.error(e);
	});
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// ---------------------------------------------------------------------------------------- //

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.guildId == null) {
		await interaction.reply({ content: 'I don\'t work in DMs!', ephemeral: true });
		return;
	}

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
    catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("error", (e) => {
	console.error(e);
});

client.login(token);
