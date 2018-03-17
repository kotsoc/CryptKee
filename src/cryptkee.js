/* eslint linebreak-style: "off" */
/**
 * @description Cryptkee, a discord chat bot that reports on currept
 * cryptocurrency prices and other related indexes.
 * @author Konstantinos Peratinos <konstantinos.peratinos@gmail.com>
 * @version 0.1
 * @todo Adding i)Fiat currency as a parameter, ii) Adding general data
 */

const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('../config.json');

//  Supported cryptocurrencies
 const supported = new Set(); //['bitcoin', 'ethereum', 'ripple', 'bitcoin-cash',
 // 'litecoin', 'neo', 'cardano', 'stellar', 'monero', 'eos']);

// const shortNames = new Map([['btc', 'bitcoin'], ['eth', 'ethereum'],
//  ['xrp', 'ripple'], ['bch', 'bitcoin-cash'], ['ltc', 'litecoin'],
//   ['neo', 'neo'], ['ada', 'cardano'], ['xlm', 'stellar'], ['xmr', 'monero'],
//    ['eos', 'eos']] );

const shortNames = new Map();

bot.on('ready', () => {
  const https = require('https');
  let url;
  let l;

  console.log('I am ready!');
  bot.user.setActivity('$help for Help');
  url = `https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=100`;

  https.get(url, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    const reply = JSON.parse(data);
     console.log(reply[1].symbol + reply[1].id);
    for ( l = 0; l < reply.length; l++) {
      shortNames.set(reply[l].symbol.toLowerCase(), reply[l].id.toLowerCase())
      supported.add(reply[l].id.toLowerCase());
    }
    console.log(shortNames.size);
  });
  });
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
        ${author}, Star Wars >>> Summoners War Suxx!`);
    }
  } else if (command === 'help') {
      const embedHelp = new Discord.RichEmbed().setTitle('Support')
      .setColor(0x16689e).setDescription('Current version supports the top 10 cryptocurrencies in CoinMarketCap.\n Pricing information is in €.');
      embedHelp.addField('Usage :', '``` $ [Name of Coin]\n```');
      embedHelp.addField('Examples', '```$ BTC\n or\n$ ethereum```');
      message.channel.send(embedHelp);
  } else if (command.includes('gam')) {
      message.channel.send(`Watch it ${author}!`);
  } else if (supported.has(command) || shortNames.has(command)) {
      const https = require('https');
      let url;
      const embed = new Discord.RichEmbed();

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
        // console.log(reply);
        embed.setAuthor(reply[0].name +' ('+ reply[0].symbol+')'
          , 'https://s2.coinmarketcap.com/static/img/coins/16x16/1.png');
        embed.setFooter('Prices via Coinmarketcap.com'
        , 'https://coinmarketcap.com/favicon.ico');
        embed.addField('Price', parseFloat(reply[0].price_eur)
        .toFixed(3)+ ' €', true);
        embed.addField('24h Volume', parseFloat(reply[0]['24h_volume_eur'])
        .toFixed(3)+' €', true);
        embed.addField('24h Change', parseFloat(reply[0].percent_change_24h)
        .toFixed(3)+' %', true);
        message.channel.send({embed});
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
