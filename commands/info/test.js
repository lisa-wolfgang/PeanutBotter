module.exports = {
	name: 'test',
  aliases: ['ping', 'online', 'speed'],
	description: 'If I\'m online, I\'ll send back a confirmation message. If I don\'t respond, I\'m likely taking a quick snack break.',
	execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode) {
    const quips = [`Just got back from my snack break.`, `Would you stop checking so much?`, `I can't wait for my next snack break!`, `...Well? Don't you have better things to do than read these?`, `And not hungry anymore.`, `Meow.`, `I'm ready to carry out all of your evil bidding.`, `Mmm... I'm telling you, nothing beats puzzle pieces and milk.`, `Do be warned, I'm a very impulsive eater.`, `Hey -- you think you have it bad having to stare at screens all day? I'm IN your screen! (Don't look)`]
		message.channel.send(`I'm currently online! ${quips[Math.floor(Math.random() * quips.length)]}`)
	},
};