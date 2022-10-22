const home = require("home");
const config = require(home.resolve() + "/config.json");
module.exports = {
	name: 'math',
  aliases: ['mathh', 'maths', 'facts', 'algebra', 'calculate', 'calculator'],
	description: 'Fast-paced calculation action lets you crown the biggest math nerd in your server!\n\n**HOW TO PLAY**\nThe goal of this game is to earn 5 points.\nWhen a question appears, simply type in your answer and send it.\nThe first person to answer the question correctly gets a point!',
	execute(serverIndex, message, args, games, gamePosted, pick, pick2, pickType, skip, devMode) {
    const fs = require('fs');
    if (skip || devMode || args.includes('skip')) {
      question();
    } else {
      var timer = 3;

      message.channel.send(`Get ready to crunch some numbers! ${message.author} has started a math race! The race will start in 20 seconds.\n\n**HOW TO PLAY**\nThe goal of this game is to earn 5 points.\nWhen a question appears, simply type in your answer and send it.\nThe first person to answer the question correctly gets a point!\n\nTIP: In the future, type \`${config.prefix} math skip\` to start the game right away.`);
      if (args.includes('hard')) {
        message.channel.send(`Hard mode has been enabled! The numbers will be bigger and crunchier than usual, and there will be more types of operations!`);
      }
      setTimeout(() => {warning(timer);}, 17000);

      function warning(number) {
        message.channel.send(`${number}!`);
        timer -= 1;
        if (timer == 0) {
          setTimeout(() => {question();}, 1000);
          return null;
        } else {
          setTimeout(() => {warning(timer);}, 1000);
        }
      }
    }

    function question() {
      message.channel.send(`What is ${pick} ${pickType} ${pick2}?`);
      gamePosted = fs.readFileSync(home.resolve() + "/gamePosted.csv", "utf-8").split(",");
      gamePosted[serverIndex] = true
      fs.writeFileSync(home.resolve() + "/gamePosted.csv", gamePosted);
    }
    
  },
};