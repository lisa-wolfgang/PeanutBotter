const Discord = require("discord.js");
const home = require("home");
const config = require(home.resolve() + "/config.json");
const dateCreated = new Date(2020, 7, 16);
let today = new Date();
const greenCatBot = process.env.GREENCATBOT;
let ageString;
let ageDays;
let ageWeeks;
let ageMonths;
let ageYears;
module.exports = {
  name: "about",
  aliases: ["", "info", "invite", "privacy", "data", "Are you collecting my data?", "what do you know about me", "server", "manual", "add", "join", "vote", "report", "bug", "bugs", "facts", "issues", "filter", "age", "source", "suggest"],
  description: "Sends general info about me, such as purpose, source code, and version.",
  execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode) {
    today = new Date();
    ageDays = Math.floor((today - dateCreated) / 86400000);
    ageString = "";
    if (ageDays >= 7) {
      if (ageDays / 7 >= 4) {
        if (ageDays / 28 >= 12) {
          ageYears = Math.floor(ageDays / 365.25);
          if (ageYears == 1) {
            ageString += `1 year, `;
          } else {
            ageString += `${ageYears} years, `;
          }
        }
        ageMonths = Math.floor(ageDays / 28) % 12;
        if (ageMonths == 1) {
          ageString += `1 month, `;
        } else {
          ageString += `${ageMonths} months, `;
        }
      }
      ageWeeks = Math.floor(ageDays / 7) % 4;
      if (ageWeeks == 1) {
        ageString += `1 week, `;
      } else {
        ageString += `${ageWeeks} weeks, `;
      }
    }
    if (ageDays % 7 == 1) {
      ageString += `1 day old`;
    } else {
      ageString += `${ageDays % 7} days old`;
    }

    const helpEmbed = new Discord.MessageEmbed()
      .setColor("#fca821")
      .setTitle("About me")
      .attachFiles(["icon.png"])
      .setThumbnail("attachment://icon.png")
      .setDescription(
        `
      Hi there! I'm PeanutBotter, and I host short, competitive free-for-all games.
      Type \`${config.prefix} help\` to see a list of commands I can execute.\n

      Want to play games with other people, suggest new features, or report issues? Join the PeanutBotter Official Server!
      https://discord.gg/k9E7BkSTbk

      You can invite me to another server with this link: https://discord.com/api/oauth2/authorize?client_id=744621537960788038&permissions=392256&scope=bot

      Want to keep the play space civil? PeanutModder, my alter-ego, can help with that by censoring foul language! Invite it to your server with this link: https://discord.com/oauth2/authorize?client_id=788144510826840124&permissions=44038&scope=bot

      View the full manual and privacy policy here, and don't forget to vote for me! :)
      https://top.gg/bot/744621537960788038

      **Some fun facts about me:**
      - I'm ${ageString}
      - My creator is @lisa_wolfgang
      - I'm hosted on repl.it
      - My code is open-source: https://repl.it/@lisawolfgang/PeanutBotter
      - I use the Brave browser
      - I eat puzzles for breakfast (actually though)
      - I'm the best at everything (except being spicy, that's PeanutModder's job)
      - <@${greenCatBot}> is annoying \(well, that's not really a fact about me, but it is true\)
      `
      )
      .setFooter("---   PeanutBotter v.3.7.0   -------------------------------");

    message.channel.send(helpEmbed);
  }
};
