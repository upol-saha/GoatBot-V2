const fs = require('fs-extra');
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: 'balance',
    aliases: ['bal'],
    version: '500',
    role: 0,
    author: 'UPoL The MiMis Momo ☺️🌸',
    shortDescription: 'Check your balanace',
    longDescription: 'Check your balance and see other user balance whit mention or reply .',
    guide: '${pn} [empty | @tag | reply]',
  },
  langs: {
    en: {
      money: "You have %1$",
      moneyOf: "%1 has %2$"
    }
  },
    onStart: async function ({ message, usersData, event, getLang }) {
    if (Object.keys(event.mentions).length > 0) {
      const uids = Object.keys(event.mentions);
      let msg = "";
      for (const uid of uids) {
        const userMoney = await usersData.get(uid, "money");
        msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
      }
      return message.reply(msg);
    }
    const userData = await usersData.get(event.senderID);
    message.reply(getLang("money", userData.money));
    }
};
