const { TEXTS } = require('../constants');
const { adminChatId } = require('../config');

const messageHandler = (bot, userStates) => {
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    // Vérifier si une réponse est attendue
    if (!userStates[chatId] || !userStates[chatId].awaitingAnswer) return;

    const state = userStates[chatId];

    // Stocker la réponse
    state.answers.push(text);

    // Envoyer le message final
    bot.sendMessage(chatId, TEXTS[state.language].final);

    // Notifier l'admin
    const answersJoined = state.answers.join(" | ");
    bot.sendMessage(
      adminChatId,
      `Utilisateur (chat_id: ${chatId})\nLangue: ${state.language}\nProjet: ${state.projectChosen}\nRéponse: ${answersJoined}`
    );

    // Terminer le process pour cet utilisateur
    delete userStates[chatId];
  });
};

module.exports = messageHandler;
