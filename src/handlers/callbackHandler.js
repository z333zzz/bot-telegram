// src/handlers/callbackHandler.js
const { GIFS_LANG, TEXTS, FINAL_CONTACT_BUTTON } = require('../constants');
const userStates = require('../state');

const callbackQueryHandler = async (callbackQuery, bot) => {
  // Vérifier que callbackQuery.message existe
  if (!callbackQuery.message) {
    if (typeof bot.answerCallbackQuery === 'function') {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: "Aucune action disponible.",
        show_alert: false
      });
    }
    return;
  }

  const chatId = callbackQuery.message.chat.id;
  const msgId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  // Bouton "Fermer le bot" depuis l'écran de démarrage
  if (data === "close_bot") {
    delete userStates[chatId];
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    await bot.sendMessage(chatId, "Bot fermé. Pour redémarrer, tapez /start.");
    await bot.answerCallbackQuery(callbackQuery.id);
    return;
  }

  // 1) Choix de la langue (ex: "lang_fr", "lang_en", etc.)
  if (data.startsWith("lang_")) {
    const chosenLang = data.split("_")[1];
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    userStates[chatId] = {
      language: chosenLang,
      projectChosen: null
    };
    await bot.sendAnimation(chatId, GIFS_LANG[chosenLang], {
      caption: TEXTS[chosenLang].welcomeProject,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Scama", callback_data: "proj_scama" },
            { text: "Letter", callback_data: "proj_letter" },
            { text: "Bot", callback_data: "proj_bot" }
          ]
        ]
      }
    });
  }
  // 2) Choix du projet (ex: "proj_scama", "proj_letter", "proj_bot")
  else if (data.startsWith("proj_")) {
    const project = data.split("_")[1];
    const state = userStates[chatId];
    if (!state) return;
    state.projectChosen = project;
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    // Envoi du message final avec le bouton pour ouvrir la conversation privée
    await bot.sendMessage(chatId, "Merci pour votre sélection. Cliquez ci-dessous pour me contacter :", {
      reply_markup: {
        inline_keyboard: [
          [ FINAL_CONTACT_BUTTON[state.language] ]
        ]
      }
    });
    // Optionnel : supprimer l'état si la session est terminée
    delete userStates[chatId];
  }
};

module.exports = callbackQueryHandler;
