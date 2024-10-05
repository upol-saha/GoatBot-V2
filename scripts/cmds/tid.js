module.exports = {
  config: {
    name: 'tid',
    version: '1.0',
    role: 0,
    author: 'UPoL The MiMis Momo ☺️🌸',
    category: 'thread',
    shortDescription: {
      en: 'Get the thread ID',
    },
    longDescription: {
      en: 'Get the thread ID of the current thread.',
    },
  },
  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const threadInfo = await api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName || 'Unnamed Thread';
    const threadIDMessage = `•Thread Name: ${threadName}\n•Thread ID: ${threadID}\n\n•Thread Link: https://www.facebook.com/messages/t/${threadID}`;
    message.reply(threadIDMessage);
  }
};
