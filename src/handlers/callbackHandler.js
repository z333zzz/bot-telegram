// src/handlers/callbackHandler.js
const {
  GIFS_LANG,
  FREE_ANSWER_GIFS,
  TEXTS
} = require('../constants');
const userStates = require('../state');

const callbackQueryHandler = async (callbackQuery, bot) => {
  // Vérifier qu'il y a bien un message
  if (!callbackQuery.message) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: "Aucune action disponible.",
      show_alert: false
    });
    return;
  }

  const chatId = callbackQuery.message.chat.id;
  const msgId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  // Bouton "Fermer le bot"
  if (data === "close_bot") {
    delete userStates[chatId];
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    await bot.sendMessage(chatId, "Bot fermé. Pour redémarrer, tapez /start.");
    return;
  }

  // 1) Choix de la langue
  if (data.startsWith("lang_")) {
    const chosenLang = data.split("_")[1];
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });

    userStates[chatId] = {
      language: chosenLang,
      projectChosen: null,
      awaitingAnswer: false,
      answers: []
    };

    await bot.sendAnimation(chatId, GIFS_LANG[chosenLang], {
      caption: TEXTS[chosenLang].welcomeProject,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Scama",  callback_data: "proj_scama" },
            { text: "Letter", callback_data: "proj_letter" },
            { text: "Bot",    callback_data: "proj_bot" }
          ]
        ]
      }
    });
  }
  // 2) Choix du projet
  else if (data.startsWith("proj_")) {
    const project = data.split("_")[1];
    const state = userStates[chatId];
    if (!state) return;

    state.projectChosen = project;

    // Déterminer la question
    let question = "";
    if (project === "scama") {
      question = "Quel projet Scama souhaitez-vous faire ? (Réponse libre)";
    } else if (project === "letter") {
      question = "Quel type de Letter souhaitez-vous faire ? (Réponse libre)";
    } else if (project === "bot") {
      question = "Quel Bot souhaitez-vous faire et quel type de Bot ? (Réponse libre)";
    }

    // Envoyer le GIF du projet + la question
    const gif = FREE_ANSWER_GIFS[project][state.language];
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    await bot.sendAnimation(chatId, gif, { caption: question });

    // On attend la réponse en texte
    state.awaitingAnswer = true;
  }
};

module.exports = callbackQueryHandler;
