module.exports = {
  config: {
    name: "animewar",
    version: "1.0",
    author: "UPoL 💀",
    countDown: 5,
    role: 0,
    shortDescription: "Anime Character Battle",
    longDescription: "Fight between two anime characters with random damage. Anyone can use random characters.",
    category: "fun",
    guide: {
      en: "{pn} <character1> vs <character2>"
    }
  },
  onStart: async function ({ message, args, event, api }) {
    const fs = require('fs-extra');
    const { threadID, messageID, senderID } = event;
    const { getPrefix } = global.utils;
    const [char1, char2] = args.join(" ").split(" vs ");

    if (!char1 || !char2) {
      return message.reply(`Please enter two character names to fight!\nExample: animewar Goku vs Vegeta`);
    }
    const char1Health = 100;
    const char2Health = 100;
    const char1Damage = Math.floor(Math.random() * 50) + 1; 
    const char2Damage = Math.floor(Math.random() * 50) + 1; 

    let winner;
    if (char1Damage > char2Damage) {
      winner = char1;
    } else if (char2Damage > char1Damage) {
      winner = char2;
    } else {
      winner = "It's a draw!";
    }

    const result = `💥 **${char1}** vs **${char2}** 💥\n\n${char1} dealt **${char1Damage} damage**!\n${char2} dealt **${char2Damage} damage**!\n\n🏆 **${winner} wins!** 🏆`;
    return message.reply(result);
  }
};



