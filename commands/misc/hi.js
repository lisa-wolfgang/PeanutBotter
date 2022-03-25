module.exports = {
	name: 'hi',
  aliases: ['hello', 'howdy', 'hey', 'sup', 'wassup', 'hiya'],
	description: 'Say hi to me, and I\'ll say hi back! Aren\'t I so nice?',
	execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode) {
		if (Math.floor(Math.random() * 2) == 0) {
        message.channel.send(`Hi, ${message.author}!`);
      } else {
        message.channel.send(`Hey there, ${message.author}!`);
      }
	},
};