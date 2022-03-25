const Discord = require('discord.js');
const fetch = require('node-fetch');
const config = require('/home/runner/PeanutBotter/config.json');
module.exports = {
	name: 'messages',
  aliases: [],
	description: 'NOTE: This command is depreciated.\n\nIf you have an account on scratch.mit.edu, you can have me DM you every time you get a new message. Other websites not supported yet.\nTo use, first make sure I\'m allowed to DM you, then type your Scratch username after the command.',
	execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode, client, db, botReadDB) {
    var countNumber = '0';
    var storedCountNumber = '0';
    var messageAuthor;
    var username;
    var requestLink;
    var stopQueue;
    var i = 0;
    var tempKey;
    var keysLength;
    if (botReadDB == 0) {
      const command = require(`/home/runner/PeanutBotter/commands/messages.js`);
      db.list().then(keys => {
        if (keys.length == 0) return;
        databaseLoad(command, keys, i);
      });
    } else if (botReadDB == 1) {
      messageAuthor = client.users.cache.get(pick);
      username = pick2;
      checkMessages(messageAuthor);
    } else if (args[1] != 'stop') {
      messageAuthor = message.author
      if (!args.length) {
        message.reply('please enter your Scratch username after the command!');
      } else {
        try {
          username = args[0]
          messageAuthor.send(`OK, ${messageAuthor}, you've successfully subscribed to Scratch notifications for @${username}! To unsubscribe, just type \`${config.prefix} messages ${username} stop\`.`)
          console.log(`${messageAuthor.username} signed up for Scratch notifications from @${username}`)
          db.set(messageAuthor, username).then(() => {});
        } catch(err) {
          console.log(err)
          return message.channel.send(`Oops! ${messageAuthor}, it looks like I can't DM you!`)
        }
        checkMessages();
      }
    }

    function databaseLoad(command, keys, i) {
      tempKey = keys[i]
      keysLength = keys.length
      db.get(keys[i]).then(value => {
        command.execute(serverIndex, message, args, games, tempKey, value, pickType, skip, devMode, client, db, 1)
        i += 1
        if (i != keysLength) {
          databaseLoad(command, keys, i)
        }
      });
    }

    function checkMessages(messageAuthor) {
      if (stopQueue != username) {
        requestLink = `https://api.scratch.mit.edu/users/${username}/messages/count`
        fetch(requestLink)
        .then((resp) => resp.text())
        .then((data) => countNumber = data.replace('{"count":', '').replace('}', ''))
        .then(postMessages(messageAuthor))
        return setTimeout(() => {checkMessages(messageAuthor);}, 10000);
      } else {
        return
      }
    }

    function postMessages(messageAuthor) {
      if (stopQueue != username) {
        if (countNumber > storedCountNumber) {
          if (countNumber == 1) {
            messageAuthor.send(`You have 1 unread message! View it at https://scratch.mit.edu/messages.`)
          } else {
            messageAuthor.send(`You have ${countNumber} unread messages! View them at https://scratch.mit.edu/messages.`)
          }
        }
        storedCountNumber = countNumber
      } else {
        return
      }
    }

    client.on('message', message => {
      if (message.content == `${config.prefix} messages ${username} stop`) {
        stopQueue = username
        messageAuthor.send(`Subscription for @${username}'s messages cancelled.`)
        console.log(`${messageAuthor.username} cancelled their subscription to @${username}'s Scratch messages`)
        db.delete(messageAuthor).then(() => {});
      }
    });

	},
};