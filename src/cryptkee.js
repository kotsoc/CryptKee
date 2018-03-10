/* eslint linebreak-style: "off" */
const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('../config.json');

//  Supported cryptocurrencies
const supported = new Set(['bitcoin', 'ethereum', 'ripple', 'bitcoin-cash',
 'litecoin', 'neo', 'cardano', 'stellar', 'monero', 'eos']);

const shortNames = new Map([['btc', 'bitcoin'], ['eth', 'ethereum'],
 ['xrp', 'ripple'], ['bch', 'bitcoin-cash'], ['ltc', 'litecoin'],
  ['neo', 'neo'], ['ada', 'cardano'], ['xlm', 'stellar'], ['xmr', 'monero'],
   ['eos', 'eos']] );

bot.on('ready', () => {
  console.log('I am ready!');
});


bot.on('message', (message) => {
  // Ignore messsages that dont contain the prefix or come from other bots
  if (message.author.bot) return;

  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  let author = message.author;

  if (command === 'psit') {
    if (author.username === 'kotsoc - Gamaw') {
    message.channel.send(`All hail Kotsoc the great Mastah! `);
    } else {
      message.channel.send(`Spread the Word
        ${author}, Star Wars >>> Summoners War Sux!`);
    }
  } else if (command.lastIndexOf('help', 0) === 0) {
      message.channel.send('Help does not come for free!');
  } else if (command.includes('gam')) {
      message.channel.send(`Watch it ${author}!`);
  } else if (supported.has(command) || shortNames.has(command)) {
      const https = require('https');
      let url;

      if (command.length > 4) {
        url = `https://api.coinmarketcap.com/v1/ticker/${command}/?convert=EUR`;
      } else {
        url = `https://api.coinmarketcap.com/v1/ticker/${shortNames
          .get(command)}/?convert=EUR`;
      }
      https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        const reply = JSON.parse(data);
        console.log(reply);
        message.channel.send(`Name: ${reply[0].name}\nPrice: ${reply[0].price_eur}\nMarket Cap: ${reply[0].market_cap_eur}`);
      });
      });
  } else {
      message.channel.send(`I am not sure about that
        ${author}, but i know this, Summoners War Sux!`);
  }
});

/*  Create a function for consuming api
function getApi (url) {

}
*/

bot.login(config.token);
