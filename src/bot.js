const TelegramBot = require('node-telegram-bot-api');
const { botToken } = require('./config');

const startHandler = require('./handlers/startHandler');
const callbackHandler = require('./handlers/callbackHandler');
const messageHandler = require('./handlers/messageHandler');

// Objet pour suivre l'état de chaque utilisateur
const userStates = {};

// Création du bot
const bot = new TelegramBot(botToken, { polling: true });

// Initialisation des gestionnaires
startHandler(bot, userStates);
callbackHandler(bot, userStates);
messageHandler(bot, userStates);

console.log("Bot lancé : en attente des interactions...");
