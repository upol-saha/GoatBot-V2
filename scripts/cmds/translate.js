const axios = require('axios');

module.exports = {
  config: {
    name: 'trans',
    aliases: ['translate'],
    version: '1.0.0',
    author: 'UPoL🦆',
    role: 0,
    coolDown: 5,
    shortDescription: {
      en: 'Translate text or reply with a language code.',
    },
    longDescription: {
      en: 'Translate a given text into another language or reply to a message to translate it to a specific language.',
    },
    usage: {
      en: '{pn} <text> \n {pn} <lang> // reply to a message'
    },
  },
  onStart: async function ({ api, message, event, args }) {
    const text = args.join(' ');
    const lang = /^[a-z]{2}$/; 
    
    let targetLang = 'en';  
    let textToTranslate = text;
    
    if (event.messageReply && lang.test(text)) {
      targetLang = text;
      textToTranslate = event.messageReply.body;
    }
    
    if (!textToTranslate) {
      message.reply('Please provide a text to translate or reply to a message with a language code.');
      return;
    }

    try {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`);
      const translatedText = response.data[0][0][0];
      
      if (event.messageReply) {
        message.reply(`Translated from ${response.data[2]} to ${targetLang}:\n\n${event.messageReply.body} = ${translatedText}`);
      } else {
        message.reply(`Translated text:\n\n${translatedText}`);
      }
    } catch (error) {
      console.error(error);
      message.reply('There was an issue with the translation service 😿');
    }
  }
};
