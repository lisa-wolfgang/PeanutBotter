module.exports = {
  name: "puzzle",
  aliases: ["puzzled"],
  description: "The person you @mention after the command will be declared puzzled.\nDeletes the command message that you sent for extra effectiveness.",
  execute(serverIndex, message, args, games, gameInProgress, pick, pick2, pickType, skip, devMode) {
    const taggedUser = message.mentions.users.first();
    if (!message.mentions.users.size) {
      return message.channel.send("Oops! You didn't specify someone to puzzle!");
    }
    message.delete();
    message.channel.send(`${taggedUser} has been puzzled!`);
  }
};
