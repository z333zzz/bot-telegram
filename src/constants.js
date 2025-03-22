// src/constants.js

const WELCOME_GIF = 'https://i.imgur.com/0jv4XEN.gif';

const GIFS_LANG = {
  fr: 'https://i.imgur.com/LUFaQ9t.gif',
  en: 'https://i.imgur.com/9zItIm0.gif',
  zh: 'https://i.imgur.com/per4yrO.gif',
  ru: 'https://i.imgur.com/w2WvY20.gif'
};

const FREE_ANSWER_GIFS = {
  scama: {
    fr: 'https://i.imgur.com/XfxfQO1.gif',
    en: 'https://i.imgur.com/QPNocMo.gif',
    zh: 'https://i.imgur.com/StJPtCH.gif',
    ru: 'https://i.imgur.com/N0CiobK.gif'
  },
  letter: {
    fr: 'https://i.imgur.com/PxgocPx.gif',
    en: 'https://i.imgur.com/WkNol6B.gif',
    zh: 'https://i.imgur.com/xqrOMcT.gif',
    ru: 'https://i.imgur.com/q1jCNq1.gif'
  },
  bot: {
    fr: 'https://i.imgur.com/xGSsMWS.gif',
    en: 'https://i.imgur.com/3FyHb10.gif',
    zh: 'https://i.imgur.com/8PbeXtA.gif',
    ru: 'https://i.imgur.com/KyqdwXd.gif'
  }
};

const TEXTS = {
  fr: {
    welcomeProject: "Choisissez le projet :",
    final: "Merci ! Pour plus d'informations, contactez-moi : @jsakai_off"
  },
  en: {
    welcomeProject: "Choose your project:",
    final: "Thanks! For more info, contact me: @jsakai_off"
  },
  zh: {
    welcomeProject: "请选择项目：",
    final: "谢谢！更多信息请联系：@jsakai_off"
  },
  ru: {
    welcomeProject: "Выберите проект:",
    final: "Спасибо! По дополнительной информации свяжитесь со мной: @jsakai_off"
  }
};

// Boutons finaux : "Contactez-moi" (ouvre un lien) et "Fermer le bot" (callback)
const CONTACT_BUTTONS = {
  fr: { text: "Contactez-moi", url: "https://t.me/jsakai_off" },
  en: { text: "Contact me", url: "https://t.me/jsakai_off" },
  zh: { text: "联系我", url: "https://t.me/jsakai_off" },
  ru: { text: "Свяжитесь со мной", url: "https://t.me/jsakai_off" }
};

const CLOSE_BOT_BUTTONS = {
  fr: { text: "Fermer le bot", callback_data: "close_bot" },
  en: { text: "Close bot", callback_data: "close_bot" },
  zh: { text: "关闭机器人", callback_data: "close_bot" },
  ru: { text: "Закрыть бота", callback_data: "close_bot" }
};

module.exports = {
  WELCOME_GIF,
  GIFS_LANG,
  FREE_ANSWER_GIFS,
  TEXTS,
  CONTACT_BUTTONS,
  CLOSE_BOT_BUTTONS
};
