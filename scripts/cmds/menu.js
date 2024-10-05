const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const upol = 'MEGU AI';

module.exports = {
  config: {
    name: 'menu',
    version: '1.2',
    role: 0,
    author: 'UPoL',
    category: 'System',
    shortDescription: {
      en: 'Show available commands in the bot system'
    },
    guide: {
      en: '{pn}'
    },
    priority: 1,
  },

 onStart: async function ({ api, args, message, event, threadsData }) {

    const { threadID } = event;

    const threadData = await threadsData.get(threadID);

    const prefix = getPrefix(threadID);

    const allCmds = Array.from(commands.keys());

    const UPoLCmds = allCmds.join("\n");

    const msg = `✨ UPoL HELP CATEGORY ✨\n\n---------------------\n${UPoLCmds}\n\n---------------------\n${upol}\n---------------------\n---------------------\n\n⚠️ UPoL GUIDE ⚠️\n\n---------------------\nIf you want to know how to use a command, type: {p}guide <command_name>`;

    const img = `https://i.ibb.co/0YtBsQV/image.jpg`;

    await api.sendMessage({ body: msg, attachment: await global.utils.getStreamFromURL(img) }, threadID);
 }
};
