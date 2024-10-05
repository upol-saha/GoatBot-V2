const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "pencil",
    author: "UPoL", 
    version: "2.0",
    role: 0,
    shortDescription: "Generate an image.",
    category: "fun",
    guide: {
        en: "{pn} <prompt>",
     }
  },
  onStart: async function ({ message, args, api, event }) {
  const prompt = args.join(' ');
   if (!prompt) {
   return message.reply('Please type a prompt.');
 }

    api.setMessageReaction("", event.messageID, (err) => {}, true);

    api.sendMessage(" Creating....", event.threadID, () => {
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    });

    try {
      const emiApiUrl = `https://upol-meaw-artist.onrender.com/pencil-draw?prompt=${encodeURIComponent(prompt)}`;

      const emiResponse = await axios.get(emiApiUrl, {
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);

      fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);

      message.reply({
        body: `✅ Here is your imagination`,
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};
