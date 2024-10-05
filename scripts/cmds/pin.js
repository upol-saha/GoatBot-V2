const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "ArYAN",
    role: 0,
    countDown: 20,
    longDescription: {
      en: "This command allows you to search for images on Pinterest based on a given query and fetch a specified number of images (1-100)."
    },
    category: "Search",
    guide: {
      en: "{pn} <search query> <number of images>\nExample: {pn} tomozaki -5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          `Please enter the search query and number of images.`,
          event.threadID,
          event.messageID
        );
      }

      const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
      let numberSearch = parseInt(keySearch.split("-").pop()) || 6;
      if (numberSearch > 100) {
        numberSearch = 100;
      }

      const apiUrl = `https://c-v1.onrender.com/api/pin?query=${encodeURIComponent(keySearchs)}&limits=${numberSearch}`;

      const res = await axios.get(apiUrl);
      const data = res.data;
      const imgData = [];

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        try {
          const imgResponse = await axios.get(data[i], {
            responseType: "arraybuffer",
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          const imgPath = path.join(cacheDir, `${i + 1}.jpg`);
          await fs.promises.writeFile(imgPath, imgResponse.data, 'binary');
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(`Error downloading image ${data[i]}:`, error.message);
        }
      }

      await api.sendMessage({
        body: `Here are the top ${numberSearch} results for your query ${keySearchs}`,
        attachment: imgData,
      }, event.threadID, event.messageID);

      if (fs.existsSync(cacheDir)) {
        await fs.promises.rm(cacheDir, { recursive: true });
      }

    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `An error occurred: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
