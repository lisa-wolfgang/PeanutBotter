const friend = process.env.FRIEND;
module.exports = {
	name: 'dank',
  aliases: [],
	description: 'Sends a declaration of dankness. Optionally, include an @mention after the command to direct the declaration to that person.',
	execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode) {
    if (message.mentions.users.size == 0) {
      if (message.author.id == friend) {
        message.channel.send(`OMG! You are already dank beyond computational comprehension, <@${friend}>!`);
      } else {
        message.reply(`you are now dank!`);
      }
    } else {
      message.channel.send(`<@${message.mentions.users[0]}, you are now dank!`)
    }
	},
};