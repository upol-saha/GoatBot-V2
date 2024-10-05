const fs = require('fs');

module.exports = {
  config: {
    name: "scramble",
    version: "69.96",
    author: "UPoL The MiMi's Momo ☺🌸",
     role: 0,
    reward: Math.floor(Math.random() * (100 - 50 + 1) + 50),
    category: "games",
  },

  onStart: async function ({ message, event, commandName }) {
    const words = JSON.parse(fs.readFileSync('words.json'));
    const randomWord = words[Math.floor(Math.random() * words.length)];

    const upolWord = shuffleWord(randomWord);

    message.reply(`😺 Here's the scrambled word. You have only 30 seconds to guess it:\n\n${upolWord}`, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        answer: randomWord
      });
   setTimeout(() => {
        message.unsend(info.messageID);
      }, 30000);
    });
  },

  onReply: async ({ message, Reply, event, usersData, envCommands, commandName }) => {
    const { author, messageID, answer } = Reply;

    if (formatText(event.body) === formatText(answer)) {
      global.GoatBot.onReply.delete(messageID);
      message.unsend(event.messageReply.messageID);
      const coins = Math.floor(Math.random() * (100 - 50 + 1) + 50);
      await usersData.addMoney(event.senderID, coins);

      message.reply(`🥳 Congratulations. You got the right answer and won ${coins}৳ and 29 exp`);
    }
    else {
      message.reply("Oops 😿, Wrong answer. Try again.");
    }
  }
};

function shuffleWord(word) {
  const shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
  if (shuffled === word) {
    return shuffleWord(word);
  }
  return shuffled;
}

function formatText(text) {
  return text.normalize("NFD").toLowerCase();
    }
