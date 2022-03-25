const Discord = require('discord.js');
const config = require('/home/runner/PeanutBotter/config.json');
module.exports = {
	name: 'help',
  aliases: ['commands', 'stop', 'exit', 'tutorial'],
	description: 'You already know what this does normally, but if you @mention someone after the command, I\'ll send them an insult. ;)',
	execute(serverIndex, message, args, commands, gameInProgress, pick, pick2, pickType, skip, devMode) {
    if (!args.length) {

      const helpEmbed = new Discord.MessageEmbed()
        .setColor('#fca821')
        .setTitle('PeanutBotter Help')
        .setDescription(`To learn more about any specific command, type \`${config.prefix} help <command>\`.`)
        .addFields(
          { name: 'Bot Info', value: '`about`, `help`, `updates`, `test`' },
          { name: `Games (type \`${config.prefix} giveup\` to quit)`, value: '`quiz`, `math`, `wordsearch`, `battleship`' },
          { name: 'Other', value: `\`puzzle\`, \`dank\`\n\n**TIP:** Type \`hard\` directly after \`${config.prefix} math\` or \`${config.prefix} wordsearch\` to activate hard mode.` },
        )

      message.channel.send(helpEmbed);

    } else if (message.mentions.users.size == 1) {
		  try {
        message.channel.send(`Too bad, you are beyond help, ${args.join(" ")}!`);
      } catch {
        console.log(`Message send error -- pb help @user`)
      }
    } else {
      
      const helpName = commands.get(args[0].toLowerCase())
      if (!helpName) {
        message.channel.send('Sorry, I can\'t provide help because that command isn\'t supported. Check for typos or try another one!');
      } else {
        const helpEmbed = new Discord.MessageEmbed()
        .setColor('#fca821')
        .setTitle(config.prefix + ' ' + helpName.name)
        .setDescription(helpName.description)

        message.channel.send(helpEmbed);
      }

    }
	}
};