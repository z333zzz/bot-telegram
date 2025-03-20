const { GIFS_LANG, TEXTS } = require('../constants');

const callbackHandler = (bot, userStates) => {
  bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const msgId = callbackQuery.message.message_id;

    // Choix de la langue
    if (data.startsWith("lang_")) {
      const chosenLang = data.split("_")[1];

      // Supprimer l'ancien clavier
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: msgId
      });

      // Sauvegarder la langue choisie
      userStates[chatId] = {
        language: chosenLang,
        projectChosen: null,
        awaitingAnswer: false,
        answers: []
      };

      // Envoyer le GIF + question de projet
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
    // Choix du projet
    else if (data.startsWith("proj_")) {
      const project = data.split("_")[1];
      const state = userStates[chatId];
      if (!state) return;

      // Supprimer l'ancien clavier
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: msgId
      });

      // Sauvegarder le projet choisi
      state.projectChosen = project;

      // Déterminer le GIF et la question en fonction du projet
      let gif = GIFS_LANG[state.language] || GIFS_LANG['fr'];
      let question = "";

      if (project === "scama") {
        question = TEXTS[state.language].questionScama;
      } else if (project === "letter") {
        question = TEXTS[state.language].questionLetter;
      } else if (project === "bot") {
        question = TEXTS[state.language].questionBot;
      }

      await bot.sendAnimation(chatId, gif, { caption: question });
      state.awaitingAnswer = true;
    }
  });
};

module.exports = callbackHandler;
