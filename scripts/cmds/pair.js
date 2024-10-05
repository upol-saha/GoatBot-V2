const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "pair",
    author: "UPoL-TAjU",
    shortDescription: {
      en: "Pair with a random members",
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ event, threadsData, message, usersData }) {
    try {
      const uidI = event.senderID;
      const avatarUrl1 = await usersData.getAvatarUrl(uidI);
      const name1 = await usersData.getName(uidI);
      let name2, avatarUrl2;

      if (uidI === "100012198960574") {
        name2 = await usersData.getName("100083406810329");
        avatarUrl2 = await usersData.getAvatarUrl("100083406810329");
      } else if (uidI === "100083406810329") {
        name2 = await usersData.getName("100012198960574");
        avatarUrl2 = await usersData.getAvatarUrl("100012198960574");
      } else {
        const threadData = await threadsData.get(event.threadID);
        const members = threadData.members.filter(member => member.inGroup);
        const senderGender = threadData.members.find(member => member.userID === uidI)?.gender;

        if (members.length < 2) {
          return message.reply('No found the others member.');
        }

        const oppositeGenderMembers = members.filter(member => member.gender !== senderGender);

        if (oppositeGenderMembers.length === 0) {
          return message.reply('Oho no members set in opposite side');
        }

        const randomIndex = Math.floor(Math.random() * oppositeGenderMembers.length);
        const randomMember = oppositeGenderMembers[randomIndex];
        name2 = await usersData.getName(`${randomMember.userID}`);
        avatarUrl2 = await usersData.getAvatarUrl(`${randomMember.userID}`);
      }

      const compatibilityScore = Math.floor(Math.random() * 61) + 40;
      const loveIntensity = Math.floor(Math.random() * 6) + 1;

      const messageBody = `Successfully pair with ${name1} and ${name2} ☺️❣️\n\n🤍 Love Percentage: ${compatibilityScore}%\nLove Intensity: ${"❤".repeat(loveIntensity)}--`;

      message.reply({
        body: messageBody,
        attachment: [
          await getStreamFromURL(`${avatarUrl1}`),
          await getStreamFromURL(`${avatarUrl2}`)
        ]
      });
    } catch (error) {
      console.error("error");
      message.reply("😿 Sorry.");
    }
  }
};
