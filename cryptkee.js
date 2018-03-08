const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {
  console.log("I am ready!");
});

const prefix = "<<"

bot.on("message", (message) => {
  // Ignore messsages that dont contain the prefix or come from other bots
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ").slice(1);
  let author = message.author;

  if (command == 'psit') {
    if (author.username === 'kotsoc - Gamaw') {
    message.channel.send(`All hail Kotsoc the great Mastah! `);
  } else  {
      message.channel.send(`Spread the Word
     ${author}, Star Wars >>> Summoners War Sux!`);
    }
  } else {
    message.channel.send(`I am not sure about that
   ${author}, but i know this, Summoners War Sux!`);
  }
});

bot.login("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
