const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "animex",
    version: "1.2",
    author: "UPoL🐔",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: 'Generate anime-style images based on user prompts.'
    },
    longDescription: {
      en: "This command uses an external API to create anime-style images from user-provided prompts."
    },
    category: "media",
    guide: {
      en: "{p}animex <prompt>"
    }
  },

  onStart: async function({ message, args, api, event }) {
    try {
      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("Please provide a prompts");
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const startTime = new Date().getTime();
    
      const baseURL = `https://c-v2.onrender.com/animex`;
      const params = {
        prompt: prompt,
      };

      const response = await axios.get(baseURL, {
        params: params,
        responseType: 'stream'
      });

      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const fileName = 'animex.png'; // Adjust file name and extension as per your API response
      const filePath = `/tmp/${fileName}`; // Example path, adjust as necessary

      const writerStream = fs.createWriteStream(filePath);
      response.data.pipe(writerStream);

      writerStream.on('finish', function() {
        message.reply({
          body: `✅ Here is your generated image:\n\n Prompt: ${prompt}\n Time Taken: ${timeTaken} seconds`,
          attachment: fs.createReadStream(filePath)
        });
      });

    } catch (error) {
      console.error('Error generating image:', error);
      message.reply("❌ Failed to generate your AnimeX image.");
    }
  }
};

