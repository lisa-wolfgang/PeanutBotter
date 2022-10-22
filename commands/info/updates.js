const Discord = require("discord.js");
const home = require("home");
const config = require(home.resolve() + "/config.json");
module.exports = {
  name: "updates",
  aliases: ["version", "changelog", "update", "log"],
  description: "Sends a changelog, letting you know what's new!",
  execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode) {
    var helpEmbed;
    if (args[0] != "old") {
      helpEmbed = new Discord.MessageEmbed()
        .setColor("#fca821")
        .setTitle("Update Log")
        .addFields(
          {
            name: "3/23/21 - v.3.7",
            value: `
          - Commands now have **aliases**, which allow you to type multiple command names to activate the command. For example, \`pb about\` can also be used with \`pb info\` or \`pb invite\`.
          - \`pb updates\` now only shows the 3 most recent updates. To see the rest of them, type \`pb updates old\`.
          `
          },
          {
            name: "2/22/21 - v.3.6",
            value: `
          - PeanutBotter is now **isolated by channel**. This means that you can play multiple games simultaneously in the same server.
          - \`pb battleship\` now declares a winner after all of the ships are sunk.
          - Usage activity is now recorded. It is completely anonymous and only consists of a timestamp. This will be used to determine a good time to push updates and patches.
          `
          },
          {
            name: "2/21/21 - v.3.5",
            value: `
          - Added **hard mode** to \`pb math\` and \`pb wordsearch\`. To enable, type \`hard\` directly after the game command.
          - \`pb trivia\` has been renamed to **\`pb quiz\`**, and the questions are now skill-based rather than knowledge-based.
          - Fixed a bug where hints could be sent after the game is complete
          `
          },
          { name: "---", value: `To see older versions, type \`${config.prefix} updates old\`.` }
        );
    } else {
      helpEmbed = new Discord.MessageEmbed()
        .setColor("#fca821")
        .setTitle("Update Log (older versions)")
        .addFields(
          { name: `To see newer versions, type \`${config.prefix} updates\`.`, value: "---" },
          {
            name: "12/14/20 - v.3.4",
            value: `
          - PeanutBotter's alter-ego (the language filter) has been removed! It's now in a separate Discord bot, PeanutModder: https://discord.com/oauth2/authorize?client_id=788144510826840124&permissions=44038&scope=bot
          `
          },
          {
            name: "12/5/20 - v.3.3",
            value: `
          - The prefix (\`pb\`) is no longer case-sensitive
          - Fixed a minor issue with the language filter
          `
          },
          {
            name: "11/30/20 - v.3.2",
            value: `
          - There's now a way to skip the game wait time: type \`skip\` directly after the game command. Example: \`pb battleship skip\`
          - Fixed a bug where \`pb trivia\` would not accept correct answers that contained capital letters.
          `
          },
          {
            name: "11/29/20 - v.3.1",
            value: `
          - \`pb messages\` and \`pb hi\` have been removed from the commands list due to irrelevancy. \`pb messages\` has been depreciated, but \`pb hi\` still works.
          - Added a privacy policy to the top.gg page (link in \`pb about\`)
          - Fixed some language filter workarounds
          - Fixed a bug where doing \`pb giveup\` while playing \`pb battleship\` would not post the results
          `
          },
          {
            name: "11/1/20 - v.3.0",
            value: `
          This is PeanutBotter's first public release! Check out everything you can do with \`pb about\`.
          `
          }
        );
    }

    message.channel.send(helpEmbed);
  }
};
