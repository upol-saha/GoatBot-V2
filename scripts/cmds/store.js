const fs = require("fs-extra");
const pastebinAPI = require("pastebin-js"); 
const pastebin = new pastebinAPI('YOUR_PASTEBIN_API_KEY'); 

module.exports = {
  config: {
    name: "store",
    version: "1.0",
    author: "UPoL🐔",
    role: 0,
    category: "System",
    guide: {
      en: "{pn} [page | find | search | paste | add | delete] <args>\n\n" +
          "{pn} page <number> - View a page of available commands\n" +
          "{pn} find <index> - Find a command by its index number\n" +
          "{pn} search <commandName> - Search for a command by its name and see details\n" +
          "{pn} paste <commandName> - Get the Pastebin URL of a command\n" +
          "{pn} add <commandName> <commandCode> - Add a new command with its Pastebin URL to the JSON file\n" +
          "{pn} delete <commandName> - Delete a command and its Pastebin URL from the JSON file"
    }
  },

  onStart: async function ({ api, message, args }) {
      const action = args.shift();
      const commandsData = JSON.parse(fs.readFileSync('commands.json', 'utf8'));

      switch (action) {
        case "page":
          const pageNumber = parseInt(args.shift());
          const commandsPerPage = 7;
          const totalCommands = Object.keys(commandsData.commands).length;
          const totalPages = Math.ceil(totalCommands / commandsPerPage);
          if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
            return message.reply(`    GOAT COMMANDS STORE\n\nInvalid page number. Please select a page between 1 and ${totalPages}.`);
          }

          const startIdx = (pageNumber - 1) * commandsPerPage;
          const endIdx = startIdx + commandsPerPage;
          const pageCommands = Object.entries(commandsData.commands).slice(startIdx, endIdx);

          let response = `     GOAT COOMANDS STORE\n\n🔍 Commands on Page (${pageNumber}/${totalPages})\n\n\n`;
          pageCommands.forEach(([cmdName, cmdData], idx) => {
            response += `|--------------------\nINDEX NUMBER: ${startIdx + idx + 1}.\n| Name: ${cmdName}\n| Status: ${cmdData.status}\n|_________________\n\n`;
          });

          message.reply(response);
          break;

        case "find":
          const commandIndex = parseInt(args.shift());
          if (isNaN(commandIndex) || commandIndex < 1 || commandIndex > Object.keys(commandsData.commands).length) {
            return message.reply("    GOAT COMMANDS STORE\n\nInvalid command index.");
          }

          const commandByIndex = Object.entries(commandsData.commands)[commandIndex - 1];
          if (commandByIndex) {
            const [cmdName, cmdData] = commandByIndex;
            message.reply(`     GOAT COMMANDS STORE\n\n|-----------------\n| ✅ Command Details:\n|_______________\n| Name: ${cmdName}\n| Author: ${cmdData.author}\n| Status: ${cmdData.status}\n|-----------------`);
          } else {
            message.reply(`     GOAT COMMANDS STORE\n\nCommand at index ${commandIndex} not found.`);
          }
          break;

        case "search":
          const commandName = args.shift();
          const command = commandsData.commands[commandName];
          if (command) {
            message.reply(`     GOAT COMMANDS STORE\n\n|--------------------\n✅ You searched the command name.\nID: ${command.id}\n| Name: ${command.name}\n| Status: ${command.status}\n|------------------`);
          } else {
            message.reply(`GOAT COMMANDS STORE\n\nCommand "${commandName}" not found.`);
          }
          break;

        case "paste":
          const pasteCommandName = args.shift();
          const pasteUrl = commandsData.commands[pasteCommandName]?.pasteUrl;
          if (pasteUrl) {
            message.reply(`GOAT COMMAMDS STORE\n\n✅ Here is your Pastebin Url.\n|-------------------\n| File Name: ${pasteCommandName}.js\n| Link: ${pasteUrl}\n| Status: ${commandsData.commands[pasteCommandName].status}\n|_________________`);
          } else {
            message.reply(`GOAT COMMANDS STORE\n\nThere is no provided Pastebin URL for " ${pasteCommandName}".\nSee another commands for get Pastebin Url.`);
          }
          break;

        case "add":
          const newCommandName = args.shift();
          const newCommandCode = args.join(' ');
          if (!newCommandName || !newCommandCode) {
            return message.reply("GOAT COMMANDS STORE\n\nPlease provide a command name and code.");
          }

          pastebin.createPaste({
            text: newCommandCode,
            title: newCommandName,
            format: 'javascript',
            privacy: 1,  
            expiration: 'N'
          }).then(async (url) => {
            commandsData.commands[newCommandName] = {
              name: newCommandName,
              author: message.senderID,
              status: 'active',
              pasteUrl: url,
              id: Object.keys(commandsData.commands).length + 1
            };
            fs.writeFileSync('commands.json', JSON.stringify(commandsData, null, 2), 'utf8');
            message.reply(`GOAT COMMANDS STORE\n\n✅ Successfully added the command in the json "${newCommandName}"`);
          }).catch(err => {
            console.error('[STORE] Error creating Pastebin:', err);
            message.reply("GOAT COMMANDS STORE\n\nError creating json file.");
          });

          break;

        case "delete":
          const deleteCommandName = args.shift();
          if (commandsData.commands[deleteCommandName]) {
            delete commandsData.commands[deleteCommandName];
            fs.writeFileSync('commands.json', JSON.stringify(commandsData, null, 2), 'utf8');
            message.reply(`GOAT COMMANDS STORE\n\n✅ Command "${deleteCommandName}" deleted successfully.`);
          } else {
            message.reply(`GOAT COMMANDS STORE\n\nCommand "${deleteCommandName}" not found.`);
          }
          break;

        default:
          message.reply("⚠️ GOAT COMMANDS STORE ⚠️\n\nYou have some actions\n*store page\n*store find\n*store search\n*store paste\n*store add\n*store delete");
      }
  },
};
