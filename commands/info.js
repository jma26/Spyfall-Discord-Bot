const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information on how to play SpyFall'),
    async execute(interaction) {
      const infoEmbed = new MessageEmbed()
        .setTitle('How to Play SpyFall')
        .setDescription('Each person will be assigned a role in a given location. Non-spy players have to work together to expose the spy without revealing their location. Spies do not know the location and have to blend in.')

        await interaction.reply({ embeds: [infoEmbed] });
    }
}