// src/handlers/callbackQueryHandler.js

const { GIFS_LANG, FREE_ANSWER_GIFS, TEXTS } = require('../constants');
const userStates = require('../state');

const callbackQueryHandler = async (callbackQuery, bot) => {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const msgId = callbackQuery.message.message_id;

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

    // Envoyer le GIF associé à la langue + texte "Choisissez le projet"
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

  // 2) Choix du projet (ex: "proj_scama", "proj_letter", "proj_bot")
  else if (data.startsWith("proj_")) {
    const project = data.split("_")[1];
    const state = userStates[chatId];
    if (!state) return;

    // Supprimer l'ancien clavier
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: msgId
    });

    // Stocker le projet choisi dans l'état
    state.projectChosen = project;

    // Déterminer la question selon le projet
    let question = "";
    if (project === "scama") {
      question = TEXTS[state.language].questionScama;
    } else if (project === "letter") {
      question = TEXTS[state.language].questionLetter;
    } else if (project === "bot") {
      question = TEXTS[state.language].questionBot;
    }

    // Récupérer le GIF spécifique à ce projet et à la langue
    const gifForProject = FREE_ANSWER_GIFS[project][state.language];

    // Envoyer ce GIF avec la question en légende
    await bot.sendAnimation(chatId, gifForProject, { caption: question });

    // Mettre à jour l'état pour indiquer qu'on attend une réponse en texte libre
    state.awaitingAnswer = true;
  }
};

module.exports = callbackQueryHandler;
