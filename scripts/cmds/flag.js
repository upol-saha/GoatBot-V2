const fs = require('fs');
const FLAG_DATA_PATH = 'flag.json';
const COLLECTED_FLAGS_PATH = 'collectFlag.json';

module.exports = {
  config: {
    name: "flag",
    aliases: ['country'],
    version: "1.2",
    author: "UPoL🐔",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Guess the country and collect flags"
    },
    longDescription: {
      en: "Guess the country name by its flag, collect flags, and trade them."
    },
    category: "game",
    guide: {
      en: "{pn} to start the game\n{pn} top to see the top 10 users\n{pn} transfer <uid> <flagName> to transfer a flag"
    },
  },

  onReply: async function ({ args, event, api, Reply, commandName, usersData }) {
    const { dataGame, country, nameUser } = Reply;
    if (event.senderID !== Reply.author) return;

    switch (Reply.type) {
      case "reply": {
        const userReply = event.body.toLowerCase();
        const senderID = event.senderID;

    
        if (userReply === country.toLowerCase()) {
          api.unsendMessage(Reply.messageID).catch(console.error);
          const rewardCoins = 800;
          const rewardExp = 10;
          const userData = await usersData.get(senderID);
          await usersData.set(senderID, {
            money: userData.money + rewardCoins,
            exp: userData.exp + rewardExp,
            data: userData.data
          });

          
          let collectedFlags = JSON.parse(fs.readFileSync(COLLECTED_FLAGS_PATH, 'utf-8'));
          if (!collectedFlags[senderID]) collectedFlags[senderID] = [];
          if (!collectedFlags[senderID].includes(country)) {
            collectedFlags[senderID].push(country);
            fs.writeFileSync(COLLECTED_FLAGS_PATH, JSON.stringify(collectedFlags, null, 2));
          }

          const msg = {
            body: `✅ ${nameUser}, You've answered correctly!\nAnswer: ${country}\nYou've received ${rewardCoins} coins and ${rewardExp} exp as a reward!\nCollected flags: ${collectedFlags[senderID].join(', ')}`
          };
          return api.sendMessage(msg, event.threadID, event.messageID);
        } else {
          api.unsendMessage(Reply.messageID).catch(console.error);
          const msg = `${nameUser}, The answer is wrong!\nCorrect answer is: ${country}`;
          return api.sendMessage(msg, event.threadID);
        }
      }
    }
  },

  onStart: async function ({ api, event, usersData, args, commandName }) {
    const { threadID, messageID, senderID } = event;

    if (args[0] === 'top') return this.showTopUsers({ api, event });
    if (args[0] === 'transfer') return this.transferFlag({ api, event, args, usersData });

    const timeout = 60;

    
    const flagData = JSON.parse(fs.readFileSync(FLAG_DATA_PATH, 'utf-8'));
    const randomIndex = Math.floor(Math.random() * flagData.length);
    const chosenFlag = flagData[randomIndex];
    const { country, link } = chosenFlag;
    const namePlayerReact = await usersData.getName(event.senderID);

    const msg = {
      body: `😺 What's the name of the country as shown in the flag picture?`,
      attachment: await global.utils.getStreamFromURL(link)
    };

    api.sendMessage(msg, threadID, async (error, info) => {
      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      global.GoatBot.onReply.set(info.messageID, {
        type: "reply",
        commandName,
        author: senderID,
        messageID: info.messageID,
        dataGame: chosenFlag,
        country,
        nameUser: namePlayerReact
      });

      setTimeout(function () {
        api.unsendMessage(info.messageID).catch(console.error);
      }, timeout * 1000);
    });
  },

  showTopUsers: function ({ api, event }) {
    const collectedFlags = JSON.parse(fs.readFileSync(COLLECTED_FLAGS_PATH, 'utf-8'));
    const topUsers = Object.entries(collectedFlags)
      .map(([userID, flags]) => ({ userID, flags, count: flags.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    let message = "🏆 Top 10 Users with the most collected flags:\n\n";
    topUsers.forEach((user, index) => {
      message += `${index + 1}. UserID: ${user.userID}, Flags (${user.count}): ${user.flags.join(', ')}\n`;
    });

    return api.sendMessage(message, event.threadID);
  },

  transferFlag: async function ({ api, event, args, usersData }) {
    const senderID = event.senderID;
    const receiverID = args[1];
    const flagName = args[2]?.toLowerCase();

    if (!receiverID || !flagName) {
      return api.sendMessage("Please provide both a valid user ID and flag name.", event.threadID);
    }

    let collectedFlags = JSON.parse(fs.readFileSync(COLLECTED_FLAGS_PATH, 'utf-8'));

 
    if (!collectedFlags[senderID] || !collectedFlags[senderID].includes(flagName)) {
      return api.sendMessage("You don't own this flag.", event.threadID);
    }

   
    collectedFlags[senderID] = collectedFlags[senderID].filter(flag => flag !== flagName);
    if (!collectedFlags[receiverID]) collectedFlags[receiverID] = [];
    collectedFlags[receiverID].push(flagName);

    fs.writeFileSync(COLLECTED_FLAGS_PATH, JSON.stringify(collectedFlags, null, 2));

    return api.sendMessage(`Successfully transferred ${flagName} to user ${receiverID}.`, event.threadID);
  }
};
