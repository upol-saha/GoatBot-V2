module.exports = {
  config: {
    name: 'leaveall',
    role: 2,
    version: '1.2.3',
    category: 'Admin',
    author: 'UPoL',
    longDescription: 'Leave all groups',
    guide: {
      en: '{pn}'
    }
  },
  onStart: async function ({ api, event, args, threadsData }) {
    const { threadID } = event;
    const allThreads = await threadsData.getAll();
    const leaveAll = allThreads.filter(thread => thread.isGroup && thread.threadID !== threadID);
    const leaveAllCount = leaveAll.length;
    const leaveAllSuccess = [];
    const leaveAllError = [];
    for (const thread of leaveAll) {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID);
        leaveAllSuccess.push(thread.threadID);
      } catch (error) {
        leaveAllError.push(thread.threadID);
      }
    };
    const UPoL = `✅ Successfully left ${leaveAllSuccess.length} groups.\n❌ Failed to leave ${leaveAllError.length} groups.`;
    api.sendMessage(UPoL, threadID);
  }
};
