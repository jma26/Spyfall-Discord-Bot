const locations = require('../locations.json');

const gameSetting = {
  players: [],
  location: '',
  totalPlayers: 1,
  time: 480,
  spies: 1
}

module.exports = {
  name: 'messageCreate',
  async execute(message) {

    if (message.member.permissions.has('administrator') && message.content === '!newGame') {
      try {
        // Send message and wait for it to be sent
        const sentMessage = await message.channel.send('Round is about to start. Please give a \ :thumbsup: \ to this message when you are ready.');

        // Filter to only collection reactions with 👍
        const filter = (reaction, user) => {
          return reaction.emoji.name === '👍' && user.id === message.author.id;
        }
        
        const collector = sentMessage.createReactionCollector({
          filter,
          time: 60000
        })

        collector.on('collect', (reaction, user) => {
          gameSetting.players.push({
            id: user.id,
            tag: user.tag
          });
          message.channel.send(`${user.tag} is playing!`)
          if (gameSetting.totalPlayers === players.length) {
            collector.stop();
          }
        });

        collector.on('end', collected => {
          console.log(`# of players playing: ${collected.size}`);
        });
      } catch (error) {
        console.error(error);
      }
    } else if (message.member.permissions.has('administrator') && message.content === '!sendRoles') {
      message.channel.send('Random location has been decided. I will now give assignments. All assignments will be sent through PMs');

      // Pick Random Location
      const location = locations.locations[Math.floor(Math.random() * locations.locations.length) + 1];
      console.log(location);
      // Assign a spy
      const spies = gameSetting.players[Math.floor(Math.random() * gameSetting.players.length)]
      spies.role = 'Spy';
      spies.location = 'Unknown';
      // Assign non-spy roles
      for (let i = 0; i < gameSetting.players.length; i++) {
        if (!gameSetting.players[i].role) {
          gameSetting.players[i].location = location.title;
          gameSetting.players[i].role = location.roles[i];
        } else if (gameSetting.players.length < 3) {
          console.log('Sorry, not enough players');
        }
      }

      // DM each player their role
      gameSetting.players.forEach(player => {
        message.client.users.fetch(player.id).then(user => {
          user.send(`Game location is ${player.location}. Your role is ${player.role}`);;
        })
      });
    } else if (message.member.permissions.has('administrator') && message.content === '!showLocations') {
      let sentMessage = `Below is the list of locations you can choose from: `;
      locations.locations.map(location => {
        sentMessage += `${location.title}, `
      })

      message.channel.send(sentMessage);
    } else if (message.member.permissions.has('administrator') && message.content === '!setTotalPlayers') {
      message.channel.send(`Okay, how many total players are participating?`);

      // Filter reply with a number
      const filter = (m) => {
        return m.author.id === message.author.id
      }

      const messageCollector = message.channel.createMessageCollector({
        filter,
        time: 60000
      });

      messageCollector.on('collect', m => {
        if (!isNaN(parseFloat(m.content))) {
          let totalPlayers = parseInt(m.content);
          gameSetting.totalPlayers = totalPlayers;
          messageCollector.stop();
        } else {
          message.channel.send('Please enter a valid number');
        }
      })

      messageCollector.on('end', m => {
        message.channel.send(`Total Player Count: ${gameSetting.totalPlayers}`);
      })
    } else if (message.member.permissions.has('administrator') && message.content === '!startTimer') {
      message.channel.send('Countdown initiating! Let the games begin!');
      
      // 8 minutes
      let time = 10;
      let countDownMessage;

      const counter = setInterval(async () => {
        let minutes = Math.floor(time/60);
        let seconds = time - (minutes * 60);
        let timer = `${minutes}:${seconds}`;
        if (time == 10) {
          await message.channel.send(`${timer}`).then(msg => { countDownMessage = msg })
          time--
        } else if (time > 0) {
          countDownMessage.edit(timer);
          time--;
        } else {
          countDownMessage.edit('Time is up!');
          clearInterval(counter);
        }
      }, 1000)
    }
  }
}