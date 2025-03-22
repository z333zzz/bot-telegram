// src/handlers/closeHandler.js
const userStates = require('../state');

const closeHandler = async (msg, bot) => {
  const chatId = msg.chat.id;
  // Supprimer l'état de la session si elle existe
  if (userStates[chatId]) {
    delete userStates[chatId];
  }
  // Envoyer un message de confirmation
  await bot.sendMessage(chatId, "Bot fermé. Pour redémarrer, tapez /start.");
};

module.exports = closeHandler;
