const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: 'simsimi',
    aliases: ['sim'],
    version: '1.0',
    author: 'UPoL',
    role: 0,
    category: 'SimSimi',
    shortDescription: {
      en: 'Simsimi chatbot',
    },
    longDescription: {
      en: 'Simsimi chatbot response with json file. If the simsimi don\'t have json file. It will not respond.',
    },
    guide: {
      en: '{pn} <text>',
    },
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const upol = args.join(" ");
    const FILE_PATH = 'simsimi.json';

    try {
      let jsonData = [];
      try {
        const data = fs.readFileSync(path.join(__dirname, FILE_PATH), 'utf8');
        jsonData = JSON.parse(data);
      } catch (readError) {
        console.error('Error reading simsimi.json:', readError.message);
      }

      if (!upol) {
        return message.reply("কিছু লিখেন 🥹");
      }

      const response = jsonData.find(item => item.user.toLowerCase() === upol.toLowerCase());
      if (response) {
        const randomResponse = getRandomResponse(response.responses);
        return message.reply(randomResponse);
      } else {
        return message.reply('আমি এসব পারিনা দয়া করে আমাকে শিখান🥺');
      }
    } catch (error) {
      return message.reply(`An error occurred: ${error.message}`);
    }
  } 
};

function getRandomResponse(responses) {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}
