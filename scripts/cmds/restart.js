const fs = require("fs-extra");

module.exports = {
  config: {
    name: "r",
    aliases: ['restart'],
    author: "NTKhang + UPOL",
    role: 2,
    category: "Owner",
    guide: {
      en: "   {pn}: Restart bot"
    }
  },
  langs: {
    en: {
      restartting: "⏳ | MeGu_AI Rebooting..."
    }
  },
  onLoad: function ({ api }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
      api.sendMessage(`✅ MeGu_AI Rebooted | ⏰Time: ${(Date.now() - time) / 1000}s`, tid);
      fs.unlinkSync(pathFile);
    }
  },

  onStart: async function ({ message, event, getLang }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
    await message.reply(getLang("restartting"));
    process.exit(2);
  }
};
