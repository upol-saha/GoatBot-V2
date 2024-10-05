module.exports = {
  config: {
    name: "slot",
    version: "1.0",
    author: "UPOL",
    shortDescription: {
      en: "Word slot",
    },
    longDescription: {
      en: "Play with word slot",
    },
    category: "Games",
  },
  langs: {
    en: {
      invalid_amount: "CHIKA SLOT GAME\n━━━━━━━━━━━\n\nSelect an amount to win and loss this game.😛",
      not_enough_money: "CHIKA SLOT GAME\n━━━━━━━━━━━\n\nCheck your balance maybe you haven't much coin for palying this game.🧐",
      spin_message: "CHIKA SLOT GAME\n━━━━━━━━━━━\n\n🤥 Spinning...!",
      win_message: "CHIKA SLOT GAME\n━━━━━━━━━━━\n\nYo. You won %1$.\n-Wow dude you win this game or earn %1$.😊\n\nYour luck: ",
      lose_message: "CHIKA SLOT GAME\n━━━━━━━━━━━\n\nOps. You lost %1$.\n-Please try again to win. Best of luck😜\n\nYour luck: ",
      jackpot_message: "CHIKA SLOT GAME\n━━━━━━━━━━━\n\nJackpot! You won $%1 with three %2 symbols.🤑",
    },
  },
  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["a", "b", "c", "d", "e"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);

    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === "a" && slot2 === "a" && slot3 === "a") {
    return betAmount * 10;
  } else if (slot1 === "b" && slot2 === "b" && slot3 === "b") {
    return betAmount * 5;
  } else if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 3;
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 2;
  } else {
    return -betAmount;
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  if (winnings > 0) {
    if (slot1 === "a" && slot2 === "a" && slot3 === "a") {
      return getLang("jackpot_message", winnings, "a");
    } else {
      return getLang("win_message", winnings) + `\ [ ${slot1} | ${slot2} | ${slot3} ]`;
    }
  } else {
    return getLang("lose_message", winnings) + `\ [ ${slot1} | ${slot2} | ${slot3} ]`;
  }
        }
