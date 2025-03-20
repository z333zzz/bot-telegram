// src/handlers/messageHandler.js
const { TEXTS } = require('../constants');
const { ADMIN_CHAT_ID } = require('../config');
const userStates = require('../state');

const messageHandler = (msg, bot) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (!userStates[chatId] || !userStates[chatId].awaitingAnswer) return;

  const state = userStates[chatId];

  state.answers.push(text);

  // Envoyer le message final à l'utilisateur
  bot.sendMessage(chatId, TEXTS[state.language].final);

  // Notifier l'administrateur
  const answersJoined = state.answers.join(" | ");
  bot.sendMessage(ADMIN_CHAT_ID, `Utilisateur (chat_id: ${chatId})\nLangue: ${state.language}\nProjet: ${state.projectChosen}\nRéponse: ${answersJoined}`);

  // Fin du processus pour cet utilisateur
  delete userStates[chatId];
};

module.exports = messageHandler;
