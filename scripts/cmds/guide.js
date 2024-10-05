const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "guide",
    version: "0.9",
    author: "𝑼𝑷𝒐𝑳 ✿︎", 
    role: 0,
    shortDescription: {
      en: "View guide",
    },
    longDescription: {
      en: "",
    },
    category: "𝐆𝐔𝐈𝐃𝐄",
    guide: {
      en: "{p}guide cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "𝙰𝚞𝚝𝚑𝚘𝚛 𝙽𝚘𝚝 𝙵𝚘𝚞𝚗𝚍";

        const guideBody = configCommand.guide?.en || "𝙽𝚘 𝙶𝚞𝚒𝚍𝚎 𝙵𝚘𝚞𝚗𝚍";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `-----------------------❀
  » 𝚅𝚎𝚛𝚜𝚒𝚘𝚗: ${configCommand.version || "1.0"}
  » 𝚁𝚘𝚕𝚎: ${roleText}
  » 𝙰𝚞𝚝𝚑𝚘𝚛: ${author}
  » 𝚄𝚜𝚊𝚐𝚎: ${usage}
------------------------------------------`;

        await message.reply(response);
      }
  },
}; 
function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 [𝚄𝚜𝚎𝚛]";
    case 1:
      return "1 [𝙱𝚘𝚡 𝙰𝚍𝚖𝚒𝚗]";
    case 2:
      return "2 [𝙱𝚘𝚝 𝚂𝚎𝚗𝚜𝚎𝚒]";
    default:
      return "𝙽𝚘𝚝 𝙵𝚘𝚞𝚗𝚍";
  }
}
