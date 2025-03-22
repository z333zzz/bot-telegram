// src/handlers/messageHandler.js
const { TEXTS } = require('../constants');
const { ADMIN_CHAT_ID } = require('../config');
const userStates = require('../state');

const messageHandler = (msg, bot) => {
  const chatId = msg.chat.id;
  // Ici, on peut gérer des réponses libres si nécessaire
};

module.exports = messageHandler;
