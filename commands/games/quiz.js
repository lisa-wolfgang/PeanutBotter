const home = require("home");
const config = require(home.resolve() + "/config.json");
module.exports = {
  name: "quiz",
  aliases: ["quizz", "trivia"],
  description: "Starts a quiz game! Includes traditional random facts as well as some wacky tasks to complete.\n\n**HOW TO PLAY**\nWhen the question appears, simply type in your answer and send it.\nIf the question asks for a number, always enter it in numeric form (1234567890) with no place separators (1000: NOT 1,000) and no units.\n\nThe first person to answer correctly wins!",
  execute(serverIndex, message, args, games, gamePosted, pick, pick2, pickType, skip, devMode) {
    const fs = require("fs");
    if (!devMode && !args.includes("skip")) {
      let timer = 5;

      message.channel.send(`Oo, how exciting! ${message.author} has started a quiz game! The question will appear in 20 seconds.\n\n**HOW TO PLAY**\nWhen the question appears, simply type in your answer and send it.\nIf the question asks for a number, always enter it in numeric form (1234567890) with no place separators (1000: NOT 1,000) and no units.\n\nThe first person to answer correctly wins!\n\nTIP: In the future, type \`${config.prefix} quiz skip\` to start the game right away.`);
      setTimeout(() => {
        warning(timer);
      }, 15000);

      function warning(number) {
        message.channel.send(`${number}!`);
        timer -= 1;
        if (timer == 0) {
          setTimeout(() => {
            question();
          }, 1000);
          return null;
        } else {
          setTimeout(() => {
            warning(timer);
          }, 1000);
        }
      }
    } else {
      question();
    }

    function question() {
      message.channel.send(games.questions[pick]);
      gamePosted = fs.readFileSync(home.resolve() + "/gamePosted.csv", "utf-8").split(",");
      gamePosted[serverIndex] = true;
      fs.writeFileSync(home.resolve() + "/gamePosted.csv", gamePosted.join(","));
      //console.log(games.questions[pick])
      //console.log(games.answers[pick])
    }
  }
};
