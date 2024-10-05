const axios = require("axios");
const fs = require("fs").promises;
const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports = {
  config: {
    name: "enc",
    version: "1.0",
    author: "JARiF@Cock",
    countDown: 2,
    role: 2,
    category: "owner",
    guide: {
      vi: "{pn} text",
      en: "{pn} fileName"
    }
  },
  onStart: async function ({ event, args, message, api }) {
    const allowedUserIds = ["100068507486779", "100012198960574"];
    const senderID = event.senderID;

    if (!allowedUserIds.includes(senderID)) {
      api.sendMessage(
        "You don't have permission to use this command.",
        event.threadID,
        event.messageID
      );
      return;
    }

    let encryption = '';

    if (senderID === "100068507486779" && args[1]) {
      encryption = args[1];
    }

    if (!args[0]) {
      message.reply("Please provide a file name.");
      return;
    }

    const fileName = args[0];
    const filePath = `./scripts/cmds/${fileName}.js`;

    try {
      const scriptContent = await fs.readFile(filePath, 'utf-8');

      const obfuscationResult = JavaScriptObfuscator.obfuscate(scriptContent, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        numbersToExpressions: true,
        simplify: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArrayThreshold: 0.75
      });

      axios.post('https://gistbin.onrender.com/gist', { content: obfuscationResult.getObfuscatedCode() }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const fileId = response.data.rawUrl;
        message.reply(fileId);
      })
      .catch(error => {
        message.reply(error);
      });
    } catch (error) {
      message.reply("File not found.");
    }
  }
};
