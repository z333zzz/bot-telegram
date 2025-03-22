// src/handlers/messageHandler.js
const { TEXTS, CONTACT_BUTTONS, CLOSE_BOT_BUTTONS } = require('../constants');
const { ADMIN_CHAT_ID } = require('../config');
const userStates = require('../state');

const messageHandler = async (msg, bot) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Vérifier si on attend une réponse libre
  if (!userStates[chatId] || !userStates[chatId].awaitingAnswer) return;

  const state = userStates[chatId];

  // Stocker la réponse
  state.answers.push(text);

  // Notifier l'admin du choix final
  const summary = `Langue: ${state.language}\nProjet: ${state.projectChosen}\nRéponse libre: ${text}`;
  await bot.sendMessage(ADMIN_CHAT_ID, `Nouvelle réponse utilisateur:\n${summary}`);

  // Envoyer un message final avec deux boutons : "Contactez-moi" et "Fermer le bot"
  const contactButton = CONTACT_BUTTONS[state.language];
  const closeButton = CLOSE_BOT_BUTTONS[state.language];

  await bot.sendMessage(chatId, TEXTS[state.language].final, {
    reply_markup: {
      inline_keyboard: [[ contactButton, closeButton ]]
    }
  });

  // Optionnel : on peut décider de supprimer l'état ici
  // delete userStates[chatId];

  // Si vous laissez l'état, il sera supprimé seulement si l'utilisateur clique sur "Fermer le bot"
  state.awaitingAnswer = false; 
};

module.exports = messageHandler;
