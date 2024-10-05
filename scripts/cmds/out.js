const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "out",
    author: "UPOL",
    role: 2,
    category: "admin",
    guide: {
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('Good Bye guys. I am leaving this chat box.', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
    }
  };
