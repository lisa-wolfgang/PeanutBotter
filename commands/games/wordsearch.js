const home = require("home");
const config = require(home.resolve() + "/config.json");
module.exports = {
	name: 'wordsearch',
  aliases: ['wordwearch', 'crossword'],
	description: 'Starts a game of competitive word search!\n\n**HOW TO PLAY**\nWhen the puzzle appears, look for the hidden 6-letter word. Words can be hidden horizontally, vertically, and in reverse. Once you find it, simply type it in and send it.\nThe first person to answer correctly wins!',
	execute(serverIndex, message, args, games, gamePosted, pick, pick2, pickType, skip, devMode, client) {    
    const fs = require('fs');
    var puzzle = '\`'
    var puzzleSolved = '\`'
    var solution = pick;
    var solutionMsg;
    var solutionGive = false;

    if (!devMode && !args.includes('skip')) {
      var timer = 5;

      message.channel.send(`Hope you've topped up on your carrots! ${message.author} has started a game of word search! The puzzle will appear in 20 seconds.\n\n**HOW TO PLAY**\nWhen the puzzle appears, look for the hidden 6-letter word. Words can be hidden horizontally, vertically, and in reverse. Once you find it, simply type it in and send it.\nThe first person to answer correctly wins!\n\nTIP: In the future, type \`${config.prefix} wordsearch skip\` to start the game right away.`);
      if (args.includes('hard')) {
        message.channel.send(`Hard mode has been enabled! The puzzle will be much larger than usual! (May not show up correctly on mobile)`);
      }
      setTimeout(() => {warning(timer);}, 15000);

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
    } else {
      question();
    }

    function question() {
      var gridX;
      var gridY;
      if (args.includes('hard')) {
        gridX = 20
        gridY = 20
      } else {
        gridX = 10
        gridY = 10
      }
      var puzzlePlaceX = Math.floor(Math.random() * (gridX + 1))
      var puzzlePlaceY = Math.floor(Math.random() * (gridY + 1))
      var puzzlePos;
      var pickLetter = 0;
      if (Math.floor(Math.random() * 2) == 1) {
        puzzlePos = 'horizontal'
      } else {
        puzzlePos = 'vertical'
      }

      if (puzzlePos == 'horizontal' && puzzlePlaceX > (gridX - 5)) {
        puzzlePlaceX += ((gridX - 5) - (puzzlePlaceX)) - Math.floor(Math.random() * (gridX - 4));
      } else if (puzzlePos == 'vertical' && puzzlePlaceY > (gridY - 5)) {
        puzzlePlaceY += ((gridY - 5) - (puzzlePlaceY)) - Math.floor(Math.random() * (gridY - 4));
      }

      if (Math.floor(Math.random() * 2) == 1) {
        pick = pick.split('').reverse().join('')
      }

      pick = pick.toUpperCase();
      for (i = 0; i < (gridY + 1); i++) {
        for (j = 0; j < (gridX + 1); j++) {
          if (pickLetter < 6 && ((puzzlePos == 'horizontal' && j == puzzlePlaceX + pickLetter && i == puzzlePlaceY) || (puzzlePos == 'vertical' && i == puzzlePlaceY + pickLetter && j == puzzlePlaceX))) {
            puzzle += pick.charAt(pickLetter) + '  '
            puzzleSolved += pick.charAt(pickLetter).toLowerCase() + '  '
            pickLetter += 1
          } else {
            puzzle += ((Math.floor(Math.random() * 26) + 11).toString(36).replace('10', 'a').toUpperCase()) + '  '
            puzzleSolved += ((Math.floor(Math.random() * 26) + 11).toString(36).replace('10', 'a').toUpperCase()) + '  '
          }
        }
        if (i < gridY) {
          puzzle = puzzle + '\`\n\`'
          puzzleSolved = puzzleSolved + '\`\n\`'
        }
      }
      gamePosted = fs.readFileSync(home.resolve() + "/gamePosted.csv", "utf-8").split(",");
      fs.writeFileSync(home.resolve() + "/gamePosted.csv", gamePosted);
      if (devMode) {
        console.log(`${pick} can be located in ${puzzlePos} orientation at \(${puzzlePlaceX}, ${puzzlePlaceY}\)`);
      }
    }
	
    client.on('message', message => {
      if (message.content == solution || (message.content.includes('The solution will be posted above shortly.') && message.author.id == process.env.PEANUTBOTTER)) {
        if (solutionMsg == null) return;
        solutionMsg.edit(puzzleSolved);
      }

    });

  },
};