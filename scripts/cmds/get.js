const shortenURL = require("tinyurl").shorten;
const { get } = require("axios");
const baseApiUrl = async () => {
  const base = await get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "get",
    version: "4.0",
    author: "UPoL🐔",
    role: 0,
    guide:{
     en: "{pn} [tinyurl | imgbb | imgur] // reply with attachment"
    }
  },

  onStart: async function ({ message, args, event }) {
    try {
      let { messageReply, type, senderID } = event;
      let num = 0;
      let length = messageReply.attachments.length;
      var msg = `✅ | 𝙷𝚎𝚛𝚎 𝚒𝚜 𝚢𝚘𝚞𝚛 ${length} 𝚏𝚒𝚕𝚎 𝚊𝚝𝚝𝚊𝚌𝚑𝚎𝚍:\n\n`;
      if ( args[0] === "tinyurl" ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚊𝚞𝚍𝚒𝚘, 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            let shortLink = await shortenURL(messageReply.attachments[i].url);
            num += 1;
            msg += `${num}: ${shortLink}\n`;
          }
          message.reply(msg);
        }
      } else if ( args[0] == "imgbb" ) {
        if (
          type !== "message_reply" &&
          !["photo", "sticker"].includes(messageReply.attachments[i]?.type)
        ) {
          return message.reply("❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚙𝚑𝚘𝚝𝚘");
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply("❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚙𝚑𝚘𝚝𝚘");
        } else {
          for (let i = 0; i < length; i++) {
            let imgLink = await get(
              `${await baseApiUrl()}/imgbb?url=${encodeURIComponent(messageReply.attachments[i].url)}`,
            );
            num += 1;
            msg += `${num}: ${imgLink.data.data.url}\n`;
          }
          message.reply(msg);
        }
      }  else if ( args[0] == "imgur" ) {
        if (type !== "message_reply") {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        }
        if (!messageReply.attachments || length == 0) {
          return message.reply(
            "❌ | 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚌𝚎𝚛𝚝𝚊𝚒𝚗 𝚟𝚒𝚍𝚎𝚘, 𝚘𝚛 𝚙𝚑𝚘𝚝𝚘",
          );
        } else {
          for (let i = 0; i < length; i++) {
            let shortLink = await shortenURL(messageReply.attachments[i].url);
            const res = await get(
              `${await baseApiUrl()}/imgur?url=${shortLink}`,
            );
            num += 1;
            msg += `${num}: ${res.data.data}\n`;
          }
          message.reply(msg);
        }
      }
    } catch (err) {
      console.log(err);
      message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${err.message}`);
    }
  },
};
