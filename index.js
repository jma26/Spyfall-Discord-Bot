require('dotenv').config();

const { Client, Intents } = require("discord.js");

// New Client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Ready!`);
});

client.login(process.env.BOT_TOKEN);