const axios = require('axios');

module.exports = {
  config: {
    name: "imgur",
    version: "1.0",
    author: "UPoL🐔",
    countDown: 1,
    role: 0,
    longDescription: "Imgur link",
    category: "utility",
    guide: { en: "Reply To The Image" }
  },

  onStart: async function ({ message, api, event }) {
    const attachments = event.messageReply.attachments;

    if (!attachments || attachments.length === 0) {
      return message.reply('Please reply to an image.');
    }

    if (attachments.length > 4) {
      return message.reply('You can upload a maximum of 4 images at a time.');
    }

    const uploadPromises = attachments.map(async (attachment, index) => {
      const imageUrl = attachment.url;
      try {
        const res = await axios.post(
          'https://api.imgur.com/3/image',
          { image: imageUrl } 
        );
        return res.data.data.link;
      } catch (error) {
        console.error(`Error uploading image ${index + 1}:`, error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const responseLinks = results.filter(link => link !== null).map((link, index) => `${index + 1}. ${link}`).join('\n');
      const fullRes = `✅ Here is your imgur links:\n\n${responseLinks}`;
      return message.reply(fullRes);
    } catch (error) {
      console.error('Error uploading images:', error);
      return message.reply('Server issue');
    }
  }
};
