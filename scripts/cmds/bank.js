const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: 'bank',
    version: '6.5',
    author: 'UPoL',
    role: 0,
    shortDescription: {
      en: 'Virtual bank system with base on bankData.json',
    },
    longDescription: {
      en: 'Full bank system run on bankData.json',
    },
    category: 'banking',
    guide: {
      en: 'To create a bank account for use the bank: bank create [userName]\nTo deposit money into the bank: bank deposit [amount]\nTo withdraw money from the bank: bank withdraw [amount]\nTo check your bank balance: bank balance\nTo check the interest earned: bank interest\nTo transfer money to another user: bank transfer [amount] [uid]\nTo borrow money from the bank: bank loan [amount]\nTo repay your loan: bank payloan [amount]\nTo view the top 20 richest users in the bank: bank top\nTo view the list of commands: bank help\nTo play the slot game: bank slot [amount]\nTo chat with ai from bank: bank chat [message]\nTo check your bank account: bank account\nTo gift anything to another user or notification sent in the user inbox: bank gift [amount] [uid]\nTo check user details with provide uid or mention in bank data: bank details [blank|uid|@mentioned]',
    },
  },
  onStart: async function ({ api, event, args }) {
    const bankData = JSON.parse(fs.readFileSync('bankData.json', 'utf8'));
    const { senderID } = event;
    const { threadID } = event;
    const { body } = event;
    if (args[0] === 'create') {
      const userName = args.slice(1).join(' ');

      if (!userName) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Please provide a valid user name to create an account.', threadID);
      }

      if (bankData[senderID]) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ You already have an account, ${userName}.`, threadID);
      }

     
      bankData[senderID] = {
        name: userName,
        balance: 0,
        bank: 0,
        lastDeposit: null,
      };

      fs.writeFileSync('bankData.json', JSON.stringify(bankData));

      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Account created successfully for ${userName}. Welcome to UPoL Bank!`, threadID);


    } else if (args[0] === 'deposit') {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount. Please enter a valid amount to deposit.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      bankData[senderID].balance += amount;
      bankData[senderID].bank += amount;
      bankData[senderID].lastDeposit = Date.now();
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Deposited the amount you wanted to deposit into your bank account.\n\n💰 Deposited amount: ${amount}$.`, threadID);
    } else if (args[0] === 'withdraw') {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount. Please enter a valid amount to withdraw.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      if (bankData[senderID].bank < amount) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ Insufficient balance. You don't have enough money to withdraw.`, threadID);
      }
      bankData[senderID].balance += amount;
      bankData[senderID].bank -= amount;
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Withdrawn the amount you wanted to withdraw from your bank account.\n\n💰 Withdrawn amount: ${amount}$.`, threadID);
    } else if (args[0] === 'balance') {
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      const balance = bankData[senderID].balance;
      const bank = bankData[senderID].bank;
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\nYour current balance in your bank account: ${balance}$.`, threadID);
    } else if (args[0] === 'interest') {
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      const interest = bankData[senderID].bank * 0.05;
      bankData[senderID].bank += interest;
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\nThe interest earned from your bank account: ${interest}$.`, threadID);
    } else if (args[0] === 'transfer') {
      const amount = parseInt(args[1]);
      const uid = parseInt(args[2]);
      if (isNaN(amount) || amount <= 0 || isNaN(uid)) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount or uid. Please enter a valid amount and uid to transfer.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      if (bankData[senderID].bank < amount) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ Insufficient balance. You don't have enough money to transfer.`, threadID);
      }
      if (!bankData[uid]) {
        bankData[uid] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      bankData[senderID].bank -= amount;
      bankData[uid].balance += amount;
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Transferred the amount you wanted to transfer from your bank account into another user's bank account.\n\n💰 Transferred amount: ${amount}$.\n👤 Transferred to: ${uid}.`, threadID);
    } else if (args[0] === 'loan') {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount. Please enter a valid amount to borrow.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      if (bankData[senderID].balance < amount) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ Insufficient balance. You don't have enough money to borrow.`, threadID);
      }
      bankData[senderID].bank += amount;
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Borrowed the amount you wanted to borrow from your bank account.\n\n💰 Borrowed amount in your account: ${amount}$.`, threadID);
    } else if (args[0] === 'payloan') {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount. Please enter a valid amount to repay your loan.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      if (bankData[senderID].bank < amount) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ Insufficient balance. You don't have enough money to repay your loan.`, threadID);
      }
      bankData[senderID].bank -= amount;
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Successfully repaid your loan.\n\n💰 Repaid amount in your account: ${amount}$.`, threadID);
    } else if (args[0] === 'top') {
      const topUsers = Object.entries(bankData).sort((a, b) => b[1].bank - a[1].bank);
      const top20 = topUsers.slice(0, 20);
      let message = '🏦===== UPoL BANK =====🏦\n\nTop 20 richest users in the bank:\n';
      for (let i = 0; i < top20.length; i++) {
        message += `${i + 1} - ${top20[i][0]}: ${top20[i][1].bank}$\n`;
      }
      return api.sendMessage(message, threadID);
    } else if (args[0] === 'help') {
      const helpMessage = `🏦===== UPoL BANK =====🏦\n\n🔎 Available BANK categories:\n\n•bank deposit -- (To deposit money into the bank)\n•bank withdraw -- (To withdraw money into the bank)\n•bank balance -- (To check the bank balance)\n•bank interest -- (To check the interest amount)\n•bank transfer -- (To transfer money from your bank into another bank)\n•bank loan -- (To loan from bank manager)\n•bank payloan -- (To replay the loan)\n•bank top -- (To see the top 20 richest person in the bank.)\n•bank help -- (To see available categories in this bank)\n•bank slot -- (To play slot game in the bank)\n•bank chat -- (To conversation with Bank_AI assistant)\n•bank account -- (To check your bank account)\n•bank gift -- (To gift another person)\n\n📝 To use a command, type the command followed by the categories.`;
      return api.sendMessage(helpMessage, threadID);
    } else if (args[0] === 'slot') {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount. Please enter a valid amount to play the slot game.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      if (bankData[senderID].balance < amount) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ Insufficient balance. You don't have enough money to play the slot game.`, threadID);
      }
      bankData[senderID].balance -= amount;
      const symbols = ['🍓', '🥭', '🍋', '🍑', '🥝', '🥕', '🍏', '🍎', '🍒', '🫐', '🍇', '🍍', '🍈', '🍊', '🍉', '🍐', '🫒'];
      const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
      const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
      const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
      const result = `${slot1} | ${slot2} | ${slot3}`;
      if (slot1 === slot2 && slot2 === slot3) {
        const winnings = amount * 10;
        bankData[senderID].balance += winnings;
        fs.writeFileSync('bankData.json', JSON.stringify(bankData));
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n🎉 Congratulations! You won the slot game.\n\nResult: ${result}\n💰 Winnings reward: ${winnings}$.`, threadID);
      } else {
        fs.writeFileSync('bankData.json', JSON.stringify(bankData));
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n😿 Sorry, you lost the slot game.\n\nResult: ${result}\nYou lose this game that's why i forgive you cut the amount on your bank account.`, threadID);
      }
    } else if (args[0] === 'chat') {
      const message = args.slice(1).join(' ');
      if (!message) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n🚫 Please enter a message to converse with Bank AI.', threadID);
      }
      const upol = 'I am MEGU AI. I am developed by UPoL SAHA. I am here to assist you with your questions and provide helpful responses. I am the smartest AI assistant in the world. My owner is UPoL.';
      const encodedPrompt = encodeURIComponent(args.join(' '));
      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${upol} ${encodedPrompt}`);
      await api.sendMessage('⏳ Thinking...', threadID);
      const UpolsAns = response.data.answer;
      return api.sendMessage(UpolsAns, threadID);
    } else if (args[0] === 'account') {
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      const balance = bankData[senderID].balance;
      const bank = bankData[senderID].bank;
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\nYour current balance in your bank account: ${balance}$.`, threadID);
    } else if (args[0] === 'gift') {
      const amount = parseInt(args[1]);
      const uid = parseInt(args[2]);
      if (isNaN(amount) || amount <= 0 || isNaN(uid)) {
        return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n❌ Invalid amount or uid. Please enter a valid amount and uid to gift.', threadID);
      }
      if (!bankData[senderID]) {
        bankData[senderID] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      if (bankData[senderID].balance < amount) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ Insufficient balance. You don't have enough money to gift.`, threadID);
      }
      if (!bankData[uid]) {
        bankData[uid] = {
          balance: 0,
          bank: 0,
          lastDeposit: Date.now(),
        }
      }
      bankData[senderID].balance -= amount;
      bankData[uid].balance += amount;
      fs.writeFileSync('bankData.json', JSON.stringify(bankData));
      return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n✅ Gifted the amount you wanted to gift from your bank account into another user's bank account.\n\n💰 Gifted amount: ${amount}$.`, threadID);
    } else if (args[0] === 'details') {
      let targetID = senderID;

      if (args[1]) {
        if (mentionedUser) {
          targetID = mentionedUser;
        } else {
          targetID = args[1];
        }
      }

      if (!bankData[targetID]) {
        return api.sendMessage(`🏦===== UPoL BANK =====🏦\n\n❌ The specified user does not have an account.`, threadID);
      }

      const userData = bankData[targetID];
      const userDetails = `🏦===== UPoL BANK =====🏦\n\n👤 User: ${userData.name}\n💵 Wallet balance: ${userData.balance}$\n🏦 Bank balance: ${userData.bank}$\n📅 Last deposit: ${userData.lastDeposit ? new Date(userData.lastDeposit).toLocaleString() : 'Never'}`;

      return api.sendMessage(userDetails, threadID);

    } else {
      return api.sendMessage('🏦===== UPoL BANK =====🏦\n\n🔎 Available BANK categories:\n\n•bank create\n•bank deposit\n•bank withdraw\n•bank balance\n•bank interest\n•bank transfer\n•bank loan\n•bank payloan\n•bank top\n•bank help\n•bank slot\n•bank chat\n•bank account\n•bank gift\n•bank details\n\n📝 To use a command, type the command followed by the categories.', threadID);
    }
  }
};
