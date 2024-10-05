const fs = require('fs');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const categories = ["history", "math", "science", "english", "hindu", "islam", "sports", "food", "coding", "bangla", "hindi", "anime", "movie", "biology", "grammer", "chemistry", "physics", "random", "music"];

module.exports = {
    config: {
        name: "quiz",
        version: "1.0",
        author: "UPoL 🐔",
        role: 0,
        category: "games",
        shortDescription: { en: "Multiplayer quiz game" },
        longDescription: { en: "Play a quiz game with multiple categories!" },
        guide: { en: "Use the command followed by a category name to start." }
    },

    onStart: async function ({ message, event, args }) {
        const category = args[0];
        if (!categories.includes(category)) {
            return message.reply(`✨ UPoL Quiz Game ✨   \n\nAvailble categories:\n\n${categories.join("\n")}`);
        }

        const filePath = `./categories/${category}.json`;
        let quizData;
        try {
            quizData = JSON.parse(fs.readFileSync(filePath));
        } catch (err) {
            return message.reply("Error loading quiz data. Please try again later.");
        }

        const shuffledQuizData = shuffle(quizData);
        const randomQuestion = shuffledQuizData[0];

        let options = '';
        Object.entries(randomQuestion.options).forEach(([key, value]) => {
            options += `${key}. ${value}\n`;
        });

        message.reply(`✨ UPoL Quiz Game ✨   \n\nCategory: ${category.toUpperCase()}\n\nQuestion: ${randomQuestion.question}\nOptions:\n${options}\n\nReply with the message for your answer.`, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: "quiz",
                messageID: info.messageID,
                author: event.senderID,
                correctAnswer: randomQuestion.answer,
                startTime: Date.now()
            });
            setTimeout(() => {
                if (global.GoatBot.onReply.has(info.messageID)) {
                    global.GoatBot.onReply.delete(info.messageID);
                    message.unsend(info.messageID);
                }
            }, 40000);
        });
    },

    onReply: async function ({ message, Reply, event, usersData }) {
        const { author, messageID, correctAnswer, startTime } = Reply;
        const userChoice = event.body.toUpperCase();

        if (event.senderID !== author) {
            return message.reply("🚫 Sorry, only the user who started the game can interact with it.");
        }

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > 40000) {
            global.GoatBot.onReply.delete(messageID);
            return message.reply("⏰ Time's up! You took too long to answer.");
        }

        if (userChoice === correctAnswer) {
            global.GoatBot.onReply.delete(messageID);

            const money = Math.floor(Math.random() * (100 - 50 + 1) + 50);
            const exp = Math.floor(Math.random() * (20 - 10 + 1) + 10);
            await usersData.addMoney(event.senderID, money);
            await usersData.set(event.senderID, {
                money: usersData.money,
                exp: exp,
                data: usersData.data
            });

            message.unsend(event.messageReply.messageID);
            message.reply(`🎉 Correct Answer! You win ${money}$ and ${exp} experience points! 🌟`);
        } else {
            setTimeout(async () => {
                await message.unsend(event.messageReply.messageID);
            }, 1000);

            message.reply(`❌ Sorry, that's incorrect.`);
        }
    }
};
