require('dotenv').config();
const fs = require('fs');
const {
	Client,
	Collection,
	Intents
} = require("discord.js");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['Message', 'Channel', 'Reaction', 'GUILDE_MEMBER']
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const messageFiles = fs.readdirSync('./messages').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

for (const file of messageFiles) {
	const message = require(`./messages/${file}`);
	client.on(message.name, (...args) => message.execute(...args, message, client));
}

client.login(process.env.BOT_TOKEN);