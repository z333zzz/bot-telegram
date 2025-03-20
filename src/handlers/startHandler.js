const { WELCOME_GIF } = require('../constants');
const { adminChatId } = require('../config');

const startHandler = (bot, userStates) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "Utilisateur";

    // Notifier l'admin
    await bot.sendMessage(
      adminChatId,
      `Nouvel utilisateur : ${userName} (chat_id: ${chatId}) a démarré le bot.`
    );

    // Envoyer le GIF avec le choix de langue
    await bot.sendAnimation(chatId, WELCOME_GIF, {
      caption: "Choisissez votre langue / Choose your language :",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Français", callback_data: "lang_fr" },
            { text: "English",  callback_data: "lang_en" }
          ],
          [
            { text: "中文",    callback_data: "lang_zh" },
            { text: "Русский", callback_data: "lang_ru" }
          ]
        ]
      }
    });
  });
};

module.exports = startHandler;
