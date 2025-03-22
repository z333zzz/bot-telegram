// src/handlers/startHandler.js
const { ADMIN_CHAT_ID } = require('../config');
const { WELCOME_GIF } = require('../constants');
const userStates = require('../state');

const startHandler = async (msg, bot) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || "Utilisateur";

  // Si l'utilisateur a déjà démarré une session, on lui indique et on arrête le traitement
  if (userStates[chatId]) {
    await bot.sendMessage(chatId, "Vous avez déjà démarré le bot.");
    return;
  }

  // Notifier l'administrateur
  await bot.sendMessage(ADMIN_CHAT_ID, `Nouvel utilisateur : ${userName} (chat_id: ${chatId}) a démarré le bot.`);

  // Initialiser l'état de l'utilisateur pour la session en cours
  userStates[chatId] = {};

  // Envoyer le GIF de bienvenue avec le clavier de choix de langue ET un bouton pour fermer le bot
  await bot.sendAnimation(chatId, WELCOME_GIF, {
    caption: "Choisissez votre langue / Choose your language :",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Français", callback_data: "lang_fr" },
          { text: "English", callback_data: "lang_en" }
        ],
        [
          { text: "中文", callback_data: "lang_zh" },
          { text: "Русский", callback_data: "lang_ru" }
        ],
        [
          { text: "Fermer le bot / Close Bot / 关闭机器人 / Закрыть бота", callback_data: "close_bot" }
        ]
      ]
    }
  });
};

module.exports = startHandler;
