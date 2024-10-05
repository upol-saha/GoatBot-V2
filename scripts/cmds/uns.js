module.exports = {
  config: {
    name: 'unsend',
    aliases: ['uns'],
    longDescription: 'Unsend a message',
    role: 0,
    author: 'UPoL🐔',
    guide: {
      en: '{pn} // reply with a message'
    },
    version: '69',
    category: 'System'
  },
  onStart: async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    if (event.type !== 'message_reply') {
      return api.sendMessage('Please reply to a message to unsend.', threadID, event.messageID);
    }
    const messageID = event.messageReply.messageID;
    api.unsendMessage(messageID, (err) => {
      if (err) {
        return message.reply('gay', threadID, messageID);
      } else {
        return message.reply('gay', threadID, messageID);
      }
    });
  }
};
