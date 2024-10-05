const axios = require("axios");

module.exports = {
  config: {
    name: "fbvid",
    version: "1.0",
    author: "Fahim_Noob | UPoL Apis 🐔",
    role: 0,
    shortDescription: {
      en: "Retrieves and sends video from a provided URL."
    },
    longDescription: {
      en: "Retrieves video details from the provided URL and sends the video as an attachment."
    },
    category: "Media",
    guide: {
      en: "{pn} <facebook_video_url>"
    }
  },
  onStart: async function ({ api, event, args }) {
    if (args.length === 0) {
      return api.sendMessage("Please provide a URL after the command.", event.threadID, event.messageID);
    }

    const videoURL = args.join(" ");
    const apiURL = `https://upol-all-downloader.onrender.com/alldl?url=${encodeURIComponent(videoURL)}`;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.get(apiURL);

      const { data: { url: { data: { high, title } } } } = response;

      if (!high) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("No video content available.", event.threadID, event.messageID);
      }

      const stream = await global.utils.getStreamFromURL(high, "video.mp4");

      api.sendMessage({
        body: title,
        attachment: stream
      }, event.threadID, (err, messageInfo) => {
        if (!err) {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        } else {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
        }
      }, event.messageID);
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("An error occurred while retrieving video details.", event.threadID, event.messageID);
    }
  }
};


