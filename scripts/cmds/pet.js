module.exports = {
  config: {
    name: 'pet',
    role: 0,
    category: 'fun',
    version: '1.0',
    author: 'UPoL🐔',
    shortDescription: 'Play with your virtual pet!',
    guide: {
      en: 'Here is the actions:\n\npet create <pet_name> <gender> <bio>\npet shop <food_name> <number of food>\npet feed <food_name> <food_number>\npet play\npet id\npet balance\npet rest\npet reset <old_pet_name> <new_pet_name> <new gender>\npet details'
    }
  },
  onStart: async function ({ api, args, message, event, userData, threadData, threadID, userID }) {
    const fs = require('fs-extra');
    const petDataPath = 'petData.json'; 

    function readPetData() {
      try {
        const data = fs.readFileSync(petDataPath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        console.error('❌ Error reading petData.json:', error);
        return {};
      }
    }


    function writePetData(data) {
      try {
        fs.writeFileSync(petDataPath, JSON.stringify(data, null, 2), 'utf8');
      } catch (error) {
        console.error('❌ Error writing to petData.json:', error);
      }
    }


    let petData = readPetData();


    const action = args[0];
    if (action === 'create') {

      const petName = args[1];
      const gender = args[2];
      const bio = args[3];
      if (!petName || !gender || !bio) {
        message.reply('👀 Please provide a pet name, gender, and bio.');
      }
      if (petData[userID] && petData[userID].petName) {
        return message.reply('😾 You already have a pet!');
      }
      petData[userID] = {
        petName: petName,
        gender: gender,
        bio: bio,
        balance: 100, 
        food: [], 
        happiness: 50, 
        energy: 50, 
      };
      writePetData(petData);
      return message.reply(`🎉 Congratulations! You have created a new pet.\nYour pet name: ${petName}\nPet gender: ${gender}\nPet bio: ${bio}\n\n😺 Yeah you got balance: ${petData[userID].balance}$\nYour pet happiness: ${petData[userID].happiness}\nYour pet energy: ${petData[userID].energy}`);
    } else if (action === 'shop') {

      const foodName = args[1];
      const foodNumber = parseInt(args[2]);
      if (!foodName || !foodNumber) {
        return message.reply('👀 Please provide the food name and the number of food you want to buy.');
      }
      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      if (petData[userID].balance < foodNumber * 10) { 
        return message.reply('⚠️ You do not have enough balance to buy this food.');
      }
      petData[userID].balance -= foodNumber * 10;
      petData[userID].food.push({
        name: foodName,
        number: foodNumber
      });
      writePetData(petData);
      return message.reply(`You have bought the food.\nFood name: ${foodName}\nNumber of food: ${foodNumber}!`);
    } else if (action === 'feed') {
      const foodName = args[1];
      const foodNumber = parseInt(args[2]);
      if (!foodName || !foodNumber) {
        return message.reply('👀 Please provide the food name and the number of food you want to feed.');
      }
      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      let foodFound = false;
      for (let i = 0; i < petData[userID].food.length; i++) {
        if (petData[userID].food[i].name === foodName) {
          if (petData[userID].food[i].number >= foodNumber) {
            petData[userID].food[i].number -= foodNumber;
            petData[userID].happiness += foodNumber * 5; 
            foodFound = true;
            break;
          } else {
            return message.reply(`⚠️ You don't have enough "${foodName}" to feed your pet.`);
          }
        }
      }
      if (!foodFound) {
        return message.reply('😿 Your pet doesn\'t have this food.');
      }
      writePetData(petData);
      return message.reply(`🎊 You have fed your pet ${foodNumber} ${foodName}!`);
    } else if (action === 'play') {
      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      petData[userID].happiness += 10; 
      petData[userID].energy -= 5; 
      writePetData(petData);
      return message.reply('😻 You played with your pet! It seems happy.');
    } else if (action === 'id') {

      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      return message.reply(`✅ Your pet ID is: ${userID}`);
    } else if (action === 'balance') {

      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      return message.reply(`🐾 Your pet balance is: ${petData[userID].balance}`);
    } else if (action === 'rest') {

      if (!petData[userID] || !petData[userID].petName) {
        return message.reply(' ⚠️ You need to create a pet first!');
      }
      petData[userID].energy += 15;
      petData[userID].balance += 5; 
      writePetData(petData);
      return message.reply('👀 Your pet is resting and gaining energy.');
    } else if (action === 'reset') {
      const oldPetName = args[1];
      const newPetName = args[2];
      const newGender = args[3];
      if (!oldPetName || !newPetName || !newGender) {
        return message.reply('👀 Please provide the old pet name, new pet name, and new gender.');
      }
      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      if (petData[userID].petName !== oldPetName) {
        return message.reply('🚫 The old pet name you provided is incorrect.');
      }
      petData[userID].petName = newPetName;
      petData[userID].gender = newGender;
      petData[userID].balance = 100; 
      petData[userID].food = []; 
      petData[userID].happiness = 50; 
      petData[userID].energy = 50; 
      writePetData(petData);
      return message.reply(`✅ Your pet data has been reset.\nYour pet's new name is ${newPetName}\ngender is ${newGender}.`);
    } else if (action === 'details') {

      if (!petData[userID] || !petData[userID].petName) {
        return message.reply('⚠️ You need to create a pet first!');
      }
      const petDetails = `✅ Here is your pet details
        Pet Name: ${petData[userID].petName}
        Gender: ${petData[userID].gender}
        Bio: ${petData[userID].bio}
        Balance: ${petData[userID].balance}
        Happiness: ${petData[userID].happiness}
        Energy: ${petData[userID].energy}
        Food: ${petData[userID].food.map(food => `${food.number} ${food.name}`).join(', ')}
      `;
      return message.reply(petDetails);
    } else if (action === 'help') {
        return message.reply('🐾 Pet Actions 🐾\n1. create\n2. shop\n3. feed\n4. play\n5. rest\n6. reset\n7. id\n8 balance\n9. details');
    } else {
      return message.reply('❌ Invalid command. Please use `pet help` to see available commands.');
    }
  }
};
