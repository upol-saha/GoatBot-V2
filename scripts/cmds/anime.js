module.exports = {
  config: {
    name: 'anime',
    role: 0,
    category: 'game',
    version: '1.0',
    author: 'UPoL🐔',
    shortDescription: 'Engage in an anime character fight game!',
    longDescription: 'Create and fight with your anime character. Available actions: create, shop, eat, train, heal, medkit, balance, id, health, bet, fight.',
    guide: {
      en: 'Here are the actions:\n\nanime create <character_name> <owner_name> <bio>\nanime shop <item_name> <number>\nanime eat <food_name>\nanime train\nanime heal\nanime medkit\nanime balance\nanime id\nanime health\nanime bet <amount>\nanime fight <opponent_id>'
    }
  },
  onStart: async function ({ api, args, message, event, userData, threadData, threadID, userID }) {
    const fs = require('fs-extra');
    const animeDataPath = 'animeData.json'; 

    // Helper functions to read and write data
    function readAnimeData() {
      try {
        const data = fs.readFileSync(animeDataPath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        console.error('❌ Error reading animeData.json:', error);
        return {};
      }
    }

    function writeAnimeData(data) {
      try {
        fs.writeFileSync(animeDataPath, JSON.stringify(data, null, 2), 'utf8');
      } catch (error) {
        console.error('❌ Error writing to animeData.json:', error);
      }
    }

    let animeData = readAnimeData();
    const action = args[0];

    // Create a new anime character
    if (action === 'create') {
      const characterName = args[1];
      const ownerName = args[2];
      const bio = args.slice(3).join(' ');

      if (!characterName || !ownerName || !bio) {
        return message.reply('👀 Please provide a character name, owner name, and bio.');
      }

      if (animeData[userID] && animeData[userID].characterName) {
        return message.reply('😾 You already have a character!');
      }

      animeData[userID] = {
        characterName: characterName,
        ownerName: ownerName,
        bio: bio,
        balance: 100,
        health: 100,
        strength: 10,
        defense: 10,
        inventory: [],
      };

      writeAnimeData(animeData);

      return message.reply(`🎉 Congratulations "${ownerName}"! You have created a new character.\nCharacter name: ${characterName}\nBio: ${bio}\nBalance: 100\nHealth: 100\nStrength: 10\nDefense: 10`);
    } 

    // Buy items from the shop
    else if (action === 'shop') {
      const itemName = args[1];
      const itemNumber = parseInt(args[2]);

      if (!itemName || !itemNumber) {
        return message.reply('👀 Please provide the item name and the number of items you want to buy.');
      }

      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      const itemCost = itemNumber * 10;
      if (animeData[userID].balance < itemCost) {
        return message.reply('⚠️ You do not have enough balance to buy these items.');
      }

      animeData[userID].balance -= itemCost;
      animeData[userID].inventory.push({
        name: itemName,
        number: itemNumber,
      });

      writeAnimeData(animeData);

      return message.reply(`You have bought ${itemNumber} ${itemName}(s).`);
    } 

    // Eat food to regain health
    else if (action === 'eat') {
      const foodName = args[1];

      if (!foodName) {
        return message.reply('👀 Please provide the food name you want to eat.');
      }

      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      let foodFound = false;

      for (let i = 0; i < animeData[userID].inventory.length; i++) {
        if (animeData[userID].inventory[i].name === foodName) {
          if (animeData[userID].inventory[i].number > 0) {
            animeData[userID].inventory[i].number -= 1;
            animeData[userID].health += 10; 
            foodFound = true;
            break;
          } else {
            return message.reply(`⚠️ You don't have enough "${foodName}" to eat.`);
          }
        }
      }

      if (!foodFound) {
        return message.reply('👀 You do not have this food item.');
      }

      writeAnimeData(animeData);

      return message.reply(`✅ You have eaten ${foodName} and gained 10 health!`);
    } 

    // Train to increase strength and defense
    else if (action === 'train') {
      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      animeData[userID].strength += 5; 
      animeData[userID].defense += 5; 

      writeAnimeData(animeData);
      return message.reply('💪 Your character trained hard! Strength and defense have increased.');
    } 

    // Heal character using balance
    else if (action === 'heal') {
      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      if (animeData[userID].balance < 10) {
        return message.reply('⚠️ You do not have enough balance to heal.');
      }

      animeData[userID].balance -= 10;
      animeData[userID].health += 20; 

      writeAnimeData(animeData);

      return message.reply('🩹 You have healed your character by 20 health points.');
    } 

    // Use a medkit from inventory
    else if (action === 'medkit') {
      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      if (!animeData[userID].inventory.some(item => item.name === 'medkit' && item.number > 0)) {
        return message.reply('⚠️ You do not have a medkit to use.');
      }

      animeData[userID].inventory = animeData[userID].inventory.map(item => {
        if (item.name === 'medkit' && item.number > 0) {
          item.number -= 1;
          animeData[userID].health += 50; 
        }
        return item;
      });

      writeAnimeData(animeData);
      return message.reply('🩺 You used a medkit and gained 50 health!');
    } 

    // Check character balance
    else if (action === 'balance') {
      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      return message.reply(`💰 Your current balance is: ${animeData[userID].balance}`);
    } 

    // Check character ID
    else if (action === 'id') {
      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      return message.reply(`✅ Your character ID is: ${userID}`);
    } 

    // Check character health
    else if (action === 'health') {
      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      return message.reply(`❤️ Your character's current health is: ${animeData[userID].health}`);
    } 

    // Place a bet using balance
    else if (action === 'bet') {
      const betAmount = parseInt(args[1]);

      if (!betAmount) {
        return message.reply('👀 Please specify the amount you want to bet.');
      }

      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      if (animeData[userID].balance < betAmount) {
        return message.reply('⚠️ You do not have enough balance to make this bet.');
      }

      animeData[userID].balance += betAmount;

      // Betting logic (to be implemented)

      writeAnimeData(animeData);

      return message.reply(`🤑 You have placed a bet of ${betAmount}!`);
    } 

    // Fight another character
    else if (action === 'fight') {
      const opponentID = parseInt(args[1]);

      if (!opponentID) {
        return message.reply('👀 Please provide the ID of the character you want to fight.');
      }

      if (!animeData[userID] || !animeData[userID].characterName) {
        return message.reply('⚠️ You need to create a character first!');
      }

      if (!animeData[opponentID] || !animeData[opponentID].characterName) {
        return message.reply('⚠️ The opponent character does not exist.');
      }

      // Fight logic (to be implemented)

      writeAnimeData(animeData);

      return message.reply(`⚔️ You challenged ${animeData[opponentID].characterName} to a fight!`);
    }

    // Default case: if the user enters an invalid action
    else {
      return message.reply('🤔 Invalid action. Please try again using one of the commands listed in the help guide.');
    }
  }
};


