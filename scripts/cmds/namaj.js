const moment = require('moment-timezone');
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: 'namaj',
    version: '1.0.0',
    author: 'UPoL 🦆',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Get prayer times for a specific location'
    },
    guide: {
      en: '{pn} <city name>, <country name>'
    }
  },
  onStart: async function ({ api, args, message, event }) {
    const { threadID, messageID } = event;
    const location = args.join(' ');
    if (!location) {
      return message.reply('Please provide a city and country name.', threadID, messageID);
    }

    const [city, country] = location.split(',');
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim();

    const prayerTimesData = {
      'Dhaka, Bangladesh': {
        Fajr: '5:00 AM',
        Sunrise: '6:00 AM',
        Dhuhr: '1:00 PM',
        Asr: '4:00 PM',
        Maghrib: '7:00 PM',
        Isha: '8:00 PM'
      },
      'London, United Kingdom': {
        Fajr: '4:30 AM',
        Sunrise: '5:30 AM',
        Dhuhr: '12:30 PM',
        Asr: '3:30 PM',
        Maghrib: '6:30 PM',
        Isha: '7:30 PM'
      },
      'New York, USA': {
        Fajr: '5:45 AM',
        Sunrise: '6:45 AM',
        Dhuhr: '1:45 PM',
        Asr: '5:45 PM',
        Maghrib: '8:45 PM',
        Isha: '9:45 PM'
      },
      'Mecca, Saudi Arabia': {
        Fajr: '4:15 AM',
        Sunrise: '5:15 AM',
        Dhuhr: '12:15 PM',
        Asr: '3:15 PM',
        Maghrib: '6:15 PM',
        Isha: '7:15 PM'
      },
      'Dubai, UAE': {
        Fajr: '4:45 AM',
        Sunrise: '5:45 AM',
        Dhuhr: '12:45 PM',
        Asr: '3:45 PM',
        Maghrib: '6:45 PM',
        Isha: '7:45 PM'
      },
      // Add more locations as needed..
    };

    const today = moment().tz('Asia/Dhaka'); 
    const date = today.format('MMMM Do YYYY');
    const day = today.format('dddd');
    const prayerTimes = prayerTimesData[`${trimmedCity}, ${trimmedCountry}`];

    if (!prayerTimes) {
      return message.reply(`Sorry, I don't have prayer times for ${trimmedCity}, ${trimmedCountry}.`, threadID, messageID);
    }

    const formattedPrayerTimes = Object.entries(prayerTimes).map(([name, time]) => `${name}: ${time}`).join('\n');

    const messageText = `DATE:  ${date}\nDAY:  ${day}\n\n\n***CITY & COUNTY***\n${trimmedCity} , ${trimmedCountry}**\n\n\n***PRAYERTIME***\n${formattedPrayerTimes}`;

    api.sendMessage(messageText, threadID, messageID);
  }
};
