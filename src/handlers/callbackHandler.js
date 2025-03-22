// src/handlers/callbackHandler.js
const { GIFS_LANG, FREE_ANSWER_GIFS, TEXTS } = require('../constants');
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

  // Cas : fermeture du bot
  if (data === "close_bot") {
    // Supprimer l'état de l'utilisateur (fermer la session)
    delete userStates[chatId];
    // Retirer le clavier inline
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: msgId
    });
    // Envoyer un message de confirmation de fermeture
    await bot.sendMessage(
      chatId,
      "Bot fermé. Pour redémarrer, tapez /start. / Bot closed. To restart, type /start."
    );
    await bot.answerCallbackQuery(callbackQuery.id);
    return;
  }

  // 1) Choix de la langue (ex: "lang_fr", "lang_en", etc.)
  if (data.startsWith("lang_")) {
    const chosenLang = data.split("_")[1];

    // Supprimer l'ancien clavier
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: msgId
    });

    // Stocker la langue choisie dans l'état
    userStates[chatId] = {
      language: chosenLang,
      projectChosen: null,
      awaitingAnswer: false,
      answers: []
    };

    // Envoyer le GIF associé à la langue + texte de bienvenue
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

    // Envoyer le GIF spécifique au projet et la question (pour la réponse libre ou la suite du traitement)
    const question =
      project === "scama"
        ? TEXTS[state.language].questionScama
        : project === "letter"
        ? TEXTS[state.language].questionLetter
        : project === "bot"
        ? TEXTS[state.language].questionBot
        : "";
    const gifForProject = FREE_ANSWER_GIFS[project][state.language];

    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: msgId
    });
    await bot.sendAnimation(chatId, gifForProject, { caption: question });
    state.awaitingAnswer = true;
  }
  // Vous pouvez ajouter ici d'autres branches pour gérer d'autres callbacks si nécessaire...
};

module.exports = callbackQueryHandler;
