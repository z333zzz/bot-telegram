// src/bot.js
const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('./config');
const callbackQueryHandler = require('./handlers/callbackHandler');
const startHandler = require('./handlers/startHandler');
const messageHandler = require('./handlers/messageHandler');

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN n'est pas défini dans le fichier .env");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Commande /start
bot.onText(/\/start/, (msg) => {
  startHandler(msg, bot).catch(console.error);
});

// Gestion des callback queries
bot.on('callback_query', (callbackQuery) => {
  callbackQueryHandler(callbackQuery, bot).catch(console.error);
});

// Gestion des messages textes (réponses libres)
bot.on('message', (msg) => {
  // Ignorer les commandes pour éviter les doublons
  if (msg.text && msg.text.startsWith('/')) return;
  messageHandler(msg, bot);
});

console.log("Bot lancé : en attente des interactions...");
