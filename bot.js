module.exports = function bot() {
  // Constants - any value that won't change
  const Database = require("@replit/database");
  const db = new Database();
  const fs = require("fs");
  const Discord = require("discord.js");
  const keep_alive = require("./keep_alive.js");
  const config = require("./config.json");
  const games = require("./games.json");
  var client = new Discord.Client();
  client.commands = new Discord.Collection();
  const commandFolders = fs.readdirSync("./commands");
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.name, command);
    }
  }
  const token = process.env.DISCORD_BOT_SECRET;
  const peanutbotter = process.env.PEANUTBOTTER;
  const greenCatBot = process.env.GREENCATBOT;
  const fyre = process.env.FYRE;

  // Variables - any value that might change and placeholders for value storage
  var args;
  var command;

  var servers = [];
  var gameInProgress = [];
  var gamePostedPush = [];
  fs.writeFileSync("././gamePosted.csv", "[]");
  var gameType = [];
  var hardMode = [];
  var pick = [];
  var pick2 = [];
  var pickType = [];
  var correctAnswer = [];
  var initAnswer = [];
  var skip = [];
  var players = [];
  var points = [];
  var hintGiven = [];
  var hintID = [];
  var gameID = [];
  var botMode = [];
  var shieldOn = [];
  var shieldRemind = [];
  var shieldAuthor = [];

  function addServer(serverID) {
    servers.push(serverID);
    gameInProgress.push(false);
    gamePostedPush = fs.readFileSync("./gamePosted.csv", "utf-8").split(",");
    gamePostedPush.push(false);
    fs.writeFileSync("././gamePosted.csv", gamePostedPush);
    gameType.push("");
    hardMode.push(false);
    pick.push("");
    pick2.push("");
    pickType.push("");
    correctAnswer.push("");
    initAnswer.push("");
    skip.push(false);
    players.push([]);
    points.push([]);
    hintGiven.push(false);
    hintID.push("");
    gameID.push("");
    botMode.push(false);
    shieldOn.push(false);
    shieldRemind.push(false);
    shieldAuthor.push("");
  }

  // Developer dashboard

  // Keep shut off - set to true to prevent the repl from automatically running on its own
  var shutOff = config.shutOff;
  if (shutOff) {
    throw new Error("The bot has been manually shut off. Toggle this in index.js to re-enable it.");
  }

  // Toggle devMode - this allows whoever is set as the bot owner to test potentially unstable features without the risk of others breaking something
  var devMode = config.devMode;
  if (devMode) {
    console.log("Devmode has been enabled. If this isn't intended, be sure to disable it and restart the bot.");
  }

  if (games.questions.length != games.answers.length) {
    throw new Error("Uh-oh, you forgot to give one of the questions an answer!");
  }

  // Purge the database! Only for use in the most dire of circumstances.
  if (config.purgeDatabase) {
    db.list().then((keys) => {
      for (i = 0; i < keys.length; i++) {
        db.delete(keys[i]).then(() => {});
      }
    });
  }

  // When bot is booted up
  client.on("ready", () => {
    console.log("PEANUTBOTTER used PEANUTS! They're super delicious!");
    setStatus();
    //Message subscription restoration is temporarily disabled for maintenance.
    //client.commands.get("messages").execute(0, 0, 0, 0, 0, 0, 0, 0, 0, devMode, client, db, 0);
    /* if (!devMode) {
      client.channels.cache.get('724035344634478682').send(`I was forced to reboot by the sinister repl.it! If you had a subscription to pb messages, you'll need to re-enable it.`)
    } */
  });

  // When message is sent
  client.on("message", (message) => {
    let serverIndex;

    if (!servers.includes(message.channel.id)) {
      addServer(message.channel.id);
    }
    serverIndex = servers.indexOf(message.channel.id);
    /*if (message.channel.type == 'dm') {
      if (!servers.includes(message.channel.id)) {
        addServer(message.channel.id)
      }
      serverIndex = servers.indexOf(message.channel.id)
    } else {
      if (!servers.includes(message.guild.id)) {
        addServer(message.guild.id)
      }
      serverIndex = servers.indexOf(message.guild.id)
    }*/

    args = message.content.slice(config.prefix.length).trim().split(/ +/);
    command = args.shift().toLowerCase();

    // Ignore all messages that are not from the bot owner in devMode
    if (!devMode || message.author.username == "lisa_wolfgang" || message.author.bot) {
      // Instant checks - these are pertinent to features that scan messages without the bot's prefix
      if (message.mentions.has(peanutbotter, { ignoreDirect: false, ignoreRoles: true, ignoreEveryone: true })) {
        // You used to need to ping PeanutBotter to check its status. Now there's a command for it, pb test.
        //message.channel.send(`I'm currently online! To check again, just type @PeanutBotter.`)
      }

      /*if (shieldOn[serverIndex] && message.author.id == greenCatBot) {
        shieldAuthor[serverIndex] = message.author;
        message.delete();
        if (shieldRemind[serverIndex]) {
          message.channel.send(`Silly ${shieldAuthor[serverIndex]}! You can't break through the shield!\nTo disable the shield, type \`pb shield off\`.`);
          shieldRemind[serverIndex] = false;
        }
      }*/

      // Games framework - while instant checks can still allow pb commands and bot usage, the games framework completely controls what happens during a game
      if ((!message.content.toLowerCase().startsWith(config.prefix) || message.author.bot) && !gameInProgress[serverIndex]) return;

      console.log(`Usage activity detected on ${new Date()}`);

      if (gameInProgress[serverIndex] && (!message.author.bot || message.author.id == peanutbotter || botMode[serverIndex])) {
        // Correct answer framework - this code will run when someone enters a correct answer during a game
        if (message.content.toLowerCase() === `${correctAnswer[serverIndex].toString().toLowerCase()}` || (gameType[serverIndex] == "battleship" && correctAnswer[serverIndex].includes(message.content.toLowerCase()))) {
          // When the winning answer is submitted
          if (gameType[serverIndex] == "quiz" || gameType[serverIndex] == "wordsearch" || points[serverIndex][players[serverIndex].indexOf(message.author.id)] == 4) {
            if (gameType[serverIndex] == "quiz" || gameType[serverIndex] == "wordsearch") {
              message.channel.send(`${message.author} answered correctly! Congratulations! The correct answer was **${correctAnswer[serverIndex]}**.`);
              endGame(serverIndex);
            } else if (gameType[serverIndex] == "battleship") {
              message.channel.send(`${message.author} has 5 hits! Congratulations, you won!`);
              endGame(serverIndex);
            } else {
              message.channel.send(`${message.author} has 5 points! Congratulations, you won!`);
              endGame(serverIndex);
            }
            // When an answer is submitted during a game with a points system
          } else if (points[serverIndex].indexOf(5) == -1) {
            var scoreIndex = players[serverIndex].indexOf(message.author.id);
            if (scoreIndex == -1) {
              players[serverIndex][players[serverIndex].length] = message.author.id;
              scoreIndex = players[serverIndex].indexOf(message.author.id);
              points[serverIndex][scoreIndex] = 1;
            } else {
              points[serverIndex][scoreIndex] += 1;
            }
            if (gameType[serverIndex] == "battleship") {
              message.channel.send(`${message.author} scored a hit at ${message.content.toUpperCase()}! They've increased their score to ${points[serverIndex][scoreIndex]}.`);
              correctAnswer[serverIndex].splice(correctAnswer[serverIndex].indexOf(message.content.toLowerCase()), 1);
              message.delete();
              if (correctAnswer[serverIndex].length == 0) {
                message.channel.send(`All of the ships were sunk! ${players[serverIndex][points[serverIndex].indexOf(Math.max.apply(null, points[serverIndex]))]} has the most points, so they win!`);
                endGame(serverIndex);
              }
            } else if (gameType[serverIndex] == "math") {
              message.channel.send(`${message.author} has increased their score to ${points[serverIndex][scoreIndex]}!`);
              newMath(serverIndex);
              skip[serverIndex] = true;
              client.commands.get("math").execute(serverIndex, message, args, games, fs.readFileSync("./gamePosted.csv", "utf-8").split(","), pick[serverIndex], pick2[serverIndex], pickType[serverIndex], skip[serverIndex]);
            }
          }
          // While a game in progress, all pb commands (except pb giveup) are blocked to enhance the game experience
        } else if (message.content.toLowerCase().startsWith(config.prefix) && command == "giveup") {
          if (fs.readFileSync("./gamePosted.csv", "utf-8").split(",")[serverIndex] == "true") {
            if (gameType[serverIndex] == "battleship" || gameType[serverIndex] == "wordsearch") {
              message.channel.send(`${message.author} gave up and ended the game. The solution will be posted above shortly.`);
            } else if (gameType[serverIndex] == "math") {
              message.channel.send(`${message.author} ended the game.`);
            } else {
              message.channel.send(`${message.author} gave up and ended the game. The correct answer was **${correctAnswer[serverIndex]}**.`);
            }
            endGame(serverIndex);
          } else {
            message.channel.send(`You can't give up before the game starts! Silly ${message.author}.`);
            //console.log('Hmm, it looks like pb giveup was registered, but it is currently disabled. Value reads: ' + fs.readFileSync('./gamePosted.csv', 'utf-8').split(",")[serverIndex])
          }
        } else if (message.content.toLowerCase().startsWith(config.prefix)) {
          message.channel.send(`To submit an answer, just type it without the \`${config.prefix}\` prefix.\nTo stop this game and give up, type \`${config.prefix} giveup\`.`);

          // Incorrect answer framework
        } else {
          // console.log(`${message.content}`);
          if (gameType[serverIndex] == "battleship" && message.author.id != peanutbotter && message.content.length == 2) {
            message.delete();
          }
          if (gameType[serverIndex] == "wordsearch" && correctAnswer[serverIndex] != "" && !hintGiven[serverIndex]) {
            hintID[serverIndex] = gameID[serverIndex];
            setTimeout(() => {
              hint(serverIndex, message);
            }, 50000);
            hintGiven[serverIndex] = true;
          }
          return;
        }

        // Command framework - all code that runs when a pb command is sent if a game is not active
      } else if (!message.author.bot || message.author.id == peanutbotter) {
        if (client.commands.has(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))) {
          if (!client.commands.has(command)) {
            command = client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command)).name; /* Command alias code */
          }
          try {
            // Special command calculations - mostly used when values need to be accessible in both index.js and the command's JS file

            // Games
            if ((command == "quiz" || command == "wordsearch" || command == "math" || command == "battleship") && !gameInProgress[serverIndex]) {
              if (args.includes("hard")) {
                hardMode[serverIndex] = true;
              } else {
                hardMode[serverIndex] = false;
              }
              gameID[serverIndex] = new Date();
              players[serverIndex] = [];
              points[serverIndex] = [];
              gameInProgress[serverIndex] = true;
              if (command == "quiz") {
                gameType[serverIndex] = "quiz";
                pick[serverIndex] = Math.floor(Math.random() * games.questions.length);
                correctAnswer[serverIndex] = games.answers[pick[serverIndex]];
              } else if (command == "math") {
                gameType[serverIndex] = "math";
                newMath(serverIndex);
              } else if (command == "wordsearch") {
                gameType[serverIndex] = "wordsearch";
                pick[serverIndex] = games.sixLetterWords[Math.floor(Math.random() * games.sixLetterWords.length)];
                correctAnswer[serverIndex] = pick[serverIndex];
              } else if (command == "battleship") {
                gameType[serverIndex] = "battleship";
                // Horizontal (0) or vertical (1)
                pickType[serverIndex] = [];
                for (i = 0; i < 4; i++) {
                  pickType[serverIndex].push(Math.floor(Math.random() * 2));
                }
                // Horizontal coordinates
                pick[serverIndex] = [];
                for (i = 0; i < 4; i++) {
                  pick[serverIndex].push(Math.floor(Math.random() * (10 - (i + 2) * ((pickType[serverIndex][i] + 1) % 2))));
                }
                // Vertical coordinates
                pick2[serverIndex] = [];
                for (i = 0; i < 4; i++) {
                  pick2[serverIndex].push(Math.floor(Math.random() * (10 - (i + 2) * pickType[serverIndex][i])));
                }
                // Now put them all together
                correctAnswer[serverIndex] = [];
                initAnswer[serverIndex] = [];
                for (i = 0; i < 4; i++) {
                  for (j = 0; j < i + 2; j++) {
                    if (pickType[serverIndex][i] == 0) {
                      correctAnswer[serverIndex].push((pick[serverIndex][i] + 10 + j).toString(36).replace("10", "a") + pick2[serverIndex][i]);
                      initAnswer[serverIndex].push((pick[serverIndex][i] + 10 + j).toString(36).replace("10", "a") + pick2[serverIndex][i]);
                    } else {
                      correctAnswer[serverIndex].push((pick[serverIndex][i] + 10).toString(36).replace("10", "a") + (pick2[i] + j));
                      initAnswer[serverIndex].push((pick[serverIndex][i] + 10).toString(36).replace("10", "a") + (pick2[serverIndex][i] + j));
                    }
                  }
                }
              }
              if (args[0] == "bot") {
                //botMode[serverIndex] = true;
                //message.channel.send('Bots will be able to play this round!');
              } else {
                //shieldOn[serverIndex] = true;
              }

              // Help
            } else if (command == "help") {
              client.commands.get(command).execute(serverIndex, message, args, client.commands, fs.readFileSync("./gamePosted.csv", "utf-8").split(","), [serverIndex], pick2[serverIndex], pickType[serverIndex], skip[serverIndex], devMode);
              return;
            } else if (command == "messages" && !devMode) {
              return message.channel.send("`" + config.prefix + ` messages\` has been depreciated.`);
            }

            // Normal commands
            client.commands.get(command).execute(serverIndex, message, args, games, fs.readFileSync("./gamePosted.csv", "utf-8").split(","), pick[serverIndex], pick2[serverIndex], pickType[serverIndex], skip[serverIndex], devMode, client, db, 2, initAnswer[serverIndex], points[serverIndex], players[serverIndex], correctAnswer[serverIndex]);

            // Runs when an error occurs during command execution
          } catch (error) {
            console.error(error);
            message.channel.send("Oh no! Something went wrong.");
          }

          // Commands without their own JS file
        } else {
          // Shield
          if (command == "shield") {
            message.channel.send("This feature is depreciated. However, it may return in a future update...");
            /*if (shieldOn[serverIndex]) {
              if (message.author.bot) {
                message.channel.send(`I don't think so, ${message.author}! Tsk tsk...`)
              } else {
                if (args[0] == 'off') {
                  shieldOn[serverIndex] = false;
                  shieldRemind[serverIndex] = true;
                  message.channel.send(`Weapons system deactivated. Bots are once again allowed to wreck havoc on this server.`)
                }
              }
            } else {
              shieldOn[serverIndex] = true;
              shieldRemind[serverIndex] = true;
              message.channel.send(`Weapons system engaged! Target: <@${greenCatBot}>`)
            }*/

            // Devmode
          } else if (command == "enis") {
            if (message.author.id == fyre) {
              message.channel.send("Enis is a given name. Notable people with the name include:\n-Enis Alushi, German footballer\n-Enis Bešlagić, Bosnia and Herzegovina actor\n-Enis Batur, Turkish poet\n-Enis Esmer, Canadian actor\n-Enis Hajri, Tunisian footballer");
            } else {
              const quips = [`Enis is a given name. Notable people with the name include:\n-Enis Alushi, German footballer\n-Enis Bešlagić, Bosnia and Herzegovina actor\n-Enis Batur, Turkish poet\n-Enis Esmer, Canadian actor\n-Enis Hajri, Tunisian footballer`, `Oh, so you think you're funny, huh? How distasteful.`, `Enis is sine backwards.`, `Smh my head`, `I bet this is the best \`enis\` command on Discord.`, `The meme is real`];
              message.channel.send(quips[Math.floor(Math.random() * quips.length)]);
            }
          } else if (command == "dev") {
            if (message.author.username == "lisa_wolfgang") {
              if (devMode) {
                devMode = false;
                setStatus();
              } else {
                devMode = true;
                setStatus();
              }
            } else {
              message.channel.send(`Sorry, ${message.author}, only @lisa_wolfgang can toggle devmode.`);
            }

            // Unrecognized command
          } else {
            message.channel.send(`Sorry, I didn\'t recognize that command. Check for typos!\nType \`${config.prefix} help\` to discover all of the commands you can use. \nIf you\'re playing a game, you don\'t need the ${config.prefix} prefix to submit your answer.`);
            console.log("Unrecognized command: " + command);
          }
        }
      }

      // When devMode is on, if someone other than those specified in the corresponding if statement tries to use PeanutBotter, this message will be sent instead.
    } else {
      if (devMode && message.content.toLowerCase().startsWith(config.prefix)) {
        message.channel.send(`I\'m in devmode right now, which means that I\'m unstable and can\'t be accessed until what @lisa_wolfgang is working on is finished. Try again later!`);
      } else {
        //console.log('Hmm, something weird is going on.')
      }
    }
  });

  // When bot is booted up, access Discord
  client.login(token);

  // Sets the bot's playing/watching status
  function setStatus(status) {
    if (devMode) {
      client.user.setActivity("devmode", { type: "PLAYING" });
    } else {
      if (status == null) {
        client.user.setActivity(`for a ${config.prefix} command`, { type: "WATCHING" });
      } else {
        client.user.setActivity(`${status}`, { type: "PLAYING" });
      }
    }
  }

  // Randomly creates a math problem for the math game
  function newMath(serverIndex) {
    var mathPicker;
    if (hardMode[serverIndex]) {
      mathPicker = Math.floor(Math.random() * 4);
    } else {
      mathPicker = Math.floor(Math.random() * 2);
    }
    if (mathPicker == 0) {
      if (hardMode[serverIndex]) {
        pick[serverIndex] = Math.floor(Math.random() * 10001) - 5000;
        pick2[serverIndex] = Math.floor(Math.random() * 10001) - 5000;
      } else {
        pick[serverIndex] = Math.floor(Math.random() * 101) - 50;
        pick2[serverIndex] = Math.floor(Math.random() * 101) - 50;
      }
      pickType[serverIndex] = "+";
      correctAnswer[serverIndex] = pick[serverIndex] + pick2[serverIndex];
    } else if (mathPicker == 1) {
      if (hardMode[serverIndex]) {
        pick[serverIndex] = Math.floor(Math.random() * 49) - 24;
        pick2[serverIndex] = Math.floor(Math.random() * 49) - 24;
      } else {
        pick[serverIndex] = Math.floor(Math.random() * 25) - 12;
        pick2[serverIndex] = Math.floor(Math.random() * 25) - 12;
      }
      pickType[serverIndex] = "*";
      correctAnswer[serverIndex] = pick[serverIndex] * pick2[serverIndex];
    } else if (mathPicker == 2) {
      pick[serverIndex] = Math.floor(Math.random() * 10) + 2;
      pick2[serverIndex] = Math.floor(Math.random() * 4) + 2;
      pickType[serverIndex] = "^";
      correctAnswer[serverIndex] = Math.pow(pick[serverIndex], pick2[serverIndex]);
    } else {
      pick[serverIndex] = Math.floor(Math.random() * 200) + 1;
      pick2[serverIndex] = Math.floor(Math.random() * 15) + 1;
      pickType[serverIndex] = "mod";
      correctAnswer[serverIndex] = pick[serverIndex] % pick2[serverIndex];
    }
  }

  // 60 seconds after a wordsearch puzzle is sent, a hint will be provided if no one has answered yet
  function hint(serverIndex, hintChannel) {
    if (hintID[serverIndex] == gameID[serverIndex] && correctAnswer[serverIndex] != "") {
      hintChannel.channel.send(`Need a hint? The hidden word starts with the letter **${correctAnswer[serverIndex].charAt(0).toUpperCase()}**.`);
    }
  }

  // Internally ends game
  function endGame(serverIndex) {
    gameInProgress[serverIndex] = false;
    gamePostedPush = fs.readFileSync("./gamePosted.csv", "utf-8").split(",");
    gamePostedPush[serverIndex] = false;
    fs.writeFileSync("./gamePosted.csv", gamePostedPush);
    skip[serverIndex] = false;
    botMode[serverIndex] = false;
    shieldOn[serverIndex] = false;
    correctAnswer[serverIndex] = "";
    hintGiven[serverIndex] = false;
    if (players[serverIndex].length > 0) {
      points[serverIndex][0] = 5;
    }
    //console.log('Game ended.')
  }

  // repl.it shuts down its repl.co servers when they go for an hour without any activity. To prevent this, a third-party service called Uptime Robot has been configured to ping this bot once every 15 minutes. When the bot receives a ping, it will post in the internal log, which counts as "active" to repl.it.
  keep_alive();
};
