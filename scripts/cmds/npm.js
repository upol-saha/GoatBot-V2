const { exec } = require('child_process');

module.exports = {
  config: {
    name: 'npm',
    role: 2, 
    author: 'UPoL🐔',
    category: 'owner',
    version: '1.0',
    shortDescription: 'Execute npm commands.',
    longDescription: '',
    guide: {
      en: '{pn} <command> [args...]' 
    }
  },
  onStart: async function({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const command = args.join(' '); 

    if (command.trim() === '') {
      return message.reply('Please provide an npm command.');
    }

    exec(`npm ${command}`, (error, stdout, stderr) => {
      if (error) {
        api.sendMessage(`Error: ${error}`, threadID, messageID);
      } else if (stderr) {
        api.sendMessage(`Error: ${stderr}`, threadID, messageID);
      } else {
        api.sendMessage(`Output:\n${stdout}`, threadID, messageID);
      }
    });
  }
};
