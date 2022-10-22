const home = require("home");
const config = require(home.resolve() + "/config.json");
module.exports = {
  name: "battleship",
  aliases: ["battleships"],
  description: "The classic game of tactics, adapted as a free-for-all game!\n\n**HOW TO PLAY**\nWhen the board appears, try to guess where the ships are hidden. There are FOUR SHIPS: the S.S. Dankme (2 units long), the Green Cat (3 units long), the Battleship (4 units long), and the Sam Rya (5 units long). Ships can be hidden either horizontally and vertically, and they may overlap each other.\n\nTo submit a coordinate, look at the grid and submit the letter of the column and the number of the row: for example, C5 or e7. You will be told if you got a hit or if you missed, but you will not be told if you've sunken a ship.\n\nThe first person to get 5 hits is the winner!",
  execute(serverIndex, message, args, games, gamePosted, pick, pick2, rotated, nothing, devMode, client, db, nothing2, initAnswer, points, players, correctAnswer) {
    const fs = require("fs");
    var puzzle;
    var solutionMsg;
    var solutionGive = false;
    var guesses = [];
    var launch = false;

    if (!devMode && !args.includes("skip")) {
      var timer = 5;

      message.channel.send(`Get your psychic powers fired up! ${message.author} has started a game of battleship! The game will start in 30 seconds.\n\n**HOW TO PLAY**\nWhen the board appears, try to guess where the ships are hidden. There are FOUR SHIPS: the S.S. Dankme (2 units long), the Green Cat (3 units long), the Battleship (4 units long), and the Sam Rya (5 units long). Ships can be hidden either horizontally and vertically, and they may overlap each other.\n\nTo submit a coordinate, look at the grid and submit the letter of the column and the number of the row: for example, C5 or e7. You will be told if you got a hit or if you missed, but you will not be told if you've sunken a ship.\n\nThe first person to get 5 hits is the winner!\n\nTIP: In the future, type \`${config.prefix} battleship skip\` to start the game right away.`);
      setTimeout(() => {
        warning(timer);
      }, 25000);

      function warning(number) {
        message.channel.send(`${number}!`);
        timer -= 1;
        if (timer == 0) {
          setTimeout(() => {
            question(-1);
          }, 1000);
          return null;
        } else {
          setTimeout(() => {
            warning(timer);
          }, 1000);
        }
      }
    } else {
      question(-1);
    }

    function question(hit) {
      const gridX = 9;
      const gridY = 9;
      puzzle = "`   A  B  C  D  E  F  G  H  I  J  `\n`0  ";
      for (i = 0; i < gridY + 1; i++) {
        for (j = 0; j < gridX + 1; j++) {
          if ((hit == 2 && initAnswer.includes(((j + 10).toString(36).replace("10", "a") + i).toLowerCase())) || guesses.includes(((j + 10).toString(36).replace("10", "a") + i).toLowerCase())) {
            if (initAnswer.includes(((j + 10).toString(36).replace("10", "a") + i).toLowerCase())) {
              if (hit == 2 && !guesses.includes(((j + 10).toString(36).replace("10", "a") + i).toLowerCase())) {
                puzzle += "o  ";
              } else {
                puzzle += "x  ";
              }
            } else {
              puzzle += "*  ";
            }
          } else {
            puzzle += "~  ";
          }
        }
        if (i < gridY) {
          puzzle = puzzle + "`\n`" + `${i + 1}  `;
        }
      }
      puzzle += "`";
      launch = true;
      if (hit == -1) {
        message.channel.send(puzzle).then((message) => {
          solutionMsg = message;
        });
        gamePosted = fs.readFileSync(home.resolve() + "/gamePosted.csv", "utf-8").split(",");
        gamePosted[serverIndex] = true;
        fs.writeFileSync(home.resolve() + "/gamePosted.csv", gamePosted);
        if (devMode) {
          console.log(initAnswer);
        }
      } else {
        solutionMsg.edit(puzzle);
      }
    }

    client.on("message", (guessSubmission) => {
      if (launch && guessSubmission.content.length == 2) {
        guesses.push(guessSubmission.content.charAt(0).toLowerCase() + guessSubmission.content.charAt(1));
        if (initAnswer.includes(guessSubmission.content.toLowerCase)) {
          question(1);
        } else {
          question(0);
        }
      }

      if (points[players.indexOf(guessSubmission.author.id)] == 5 || (guessSubmission.content.includes(config.prefix) && guessSubmission.content.includes(`giveup`) && fs.readFileSync(home.resolve() + "/gamePosted.csv", "utf-8").split(",")[serverIndex] == true)) {
        //console.log('Answer key posted.')
        question(2);
      }
    });
  }
};
