module.exports.config = {
  name: "sendmusic",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Gửi file âm thanh từ Catbox",
  usePrefix: false,
  commandCategory: "Công cụ",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "path": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event }) {
  try {
    const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];

    // Link file âm thanh trên Catbox
    const audioUrl = "https://files.catbox.moe/pp6m5k.mp3";

    // File tạm
    const filePath = resolve(
      __dirname,
      "cache",
      `say_${event.threadID}_${event.senderID}.mp3`
    );

    // Tải file từ Catbox
    await global.utils.downloadFile(audioUrl, filePath);

    // Gửi file âm thanh
    return api.sendMessage(
      {
        attachment: createReadStream(filePath)
      },
      event.threadID,
      () => {
        try {
          unlinkSync(filePath);
        } catch (e) {
          console.log(e);
        }
      }
    );

  } catch (e) {
    console.log("Lỗi command say:", e);
    return api.sendMessage(
      "Không thể gửi file âm thanh.",
      event.threadID
    );
  }
};