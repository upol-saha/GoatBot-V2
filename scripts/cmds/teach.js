const fs = require('fs').promises;
const path = require('path');

const FILE_PATH = 'simsimi.json';

const saveResponses = async (responses) => {
  await fs.writeFile(path.join(__dirname, FILE_PATH), JSON.stringify(responses, null, 2), 'utf8');
};

const getRandomResponse = (responses) => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

module.exports = {
  config: {
    name: "teach",
    version: "1.0",
    author: "UPoL",
    countDown: 0,
    role: 0,
    shortDescription: "Teach the bot",
    longDescription: "Teach the bot by providing a user message and the corresponding bot response",
    category: "no prefix",
  },
  onStart: async function ({ event, message, args, api }) {
    const [userMessage, botResponse] = args.join(" ").split(" | ");

    if (!userMessage || !botResponse) {
      return message.reply("Please provide both user message and bot response in the format: teach user message - bot response");
    }

    try {
      let existingResponses = [];
      try {
        const data = await fs.readFile(path.join(__dirname, FILE_PATH), 'utf8');
        existingResponses = JSON.parse(data);
      } catch (readError) {
        console.error('Error reading existing file:', readError.message);
      }

      const existingIndex = existingResponses.findIndex(item => item.user.toLowerCase() === userMessage.toLowerCase());

      if (existingIndex !== -1) {
        existingResponses[existingIndex].responses.push(botResponse);
      } else {
        existingResponses.push({ user: userMessage, responses: [botResponse] });
      }

      await saveResponses(existingResponses);

      return message.reply(`Successfully taught the bot: "${userMessage}" | "${botResponse}"`);
    } catch (error) {
      return message.reply(`Error teaching the bot: ${error.message}`);
    }
  },
  getRandomResponse: getRandomResponse,
};
