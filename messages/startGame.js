const players = [];

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Store UserID for each reaction

    if (message.content === '!newGame') {
      try {
        // Send message and wait for it to be sent
        const sentMessage = await message.channel.send('Round is about to start. Please give a \ :thumbsup: \ to this message when you are ready');

        // Filter to only collection reactions with 👍
        const filter = (reaction, user) => {
          return reaction.emoji.name === '👍' && user.id === message.author.id;
        }
        
        const collector = sentMessage.createReactionCollector({
          filter,
          time: 5000
        })

        collector.on('collect', (reaction, user) => {
          players.push(user);
          console.log(players);
          message.channel.send(`${user.tag} is playing!`)
        });

        collector.on('end', collected => {
          console.log(`Size of collection: ${collected.size}`);
        });
      } catch (error) {
        console.error(error);
      }
    } else if (message.content === '!sendRoles') {
      message.channel.send('Everyone is ready. I will now give assignments. All assignments will be done through PMs');

      // DM each player their role
      players.forEach(player => {
        message.client.users.fetch(player.id).then(user => {
          user.send('Your role is this! Testing!');
        })
      });
    }
  }
}