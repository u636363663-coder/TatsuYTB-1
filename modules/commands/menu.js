
module.exports.config = {
    name: 'menu',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'DC-Nam mod by Vtuan',
    description: 'Danh sách lệnh',
    commandCategory: 'danh sách lệnh',
    usages: '[số thứ tự | tên lệnh]',
    cooldowns: 5,

    envConfig: {
        autoUnsend: {
            status: true,
            timeOut: 60
        },
        sendAttachments: {
            status: true,
            random: true,
            url: 'https://i.imgur.com/LKkw8SL.jpg'
        }
    }
};

const {
    autoUnsend = module.exports.config.envConfig.autoUnsend,
    sendAttachments = module.exports.config.envConfig.sendAttachments
} = global.config == undefined
    ? {}
    : global.config.menu == undefined
        ? {}
        : global.config.menu;


// ================================
// DANH SÁCH COMMAND HIỂN THỊ
// ================================

const commandList = [
    ['2048', '2048'],
    ['6mui', 'Xem ảnh'],
    ['777', 'Đánh bạc bằng hình thức hoa quả'],
    ['adduser', 'Thêm người dùng vào nhóm bằng link hoặc uid'],
    ['anime', 'Xem ảnh'],
    ['animev1', ''],
    ['antispam', 'Tự động kick người dùng khi spam trong nhóm'],
    ['avt', 'Lấy ảnh đại diện'],
    ['ban', 'Quản lý danh sách cấm trong nhóm (thêm bằng UID hoặc reply)'],
    ['bangtuanhoan', 'Thông tin nguyên tố hóa học ngẫu nhiên'],
    ['bank', ''],
    ['baucua', 'Game bầu cua có đặt cược'],
    ['box', 'Cài đặt và thông tin nhóm'],
    ['boy', 'Xem ảnh'],
    ['callad', 'Thông báo lỗi của bot đến admin hoặc góp ý'],
    ['caro', 'game cờ caro'],
    ['checktt', 'Check tương tác ngày/tuần/toàn bộ'],
    ['contact', 'Contact thành viên trong nhóm'],
    ['cosplay', 'Xem ảnh'],
    ['daily', 'Nhận 10000 coins mỗi ngày!'],
    ['deptrai', 'Đo độ đẹp trai'],
    ['donate', 'Donate cho thằng admin nghèo khổ'],
    ['dú', 'Xem ảnh'],
    ['finduser', 'Tìm thông tin người dùng trong các nhóm bot tham gia'],
    ['gemma', 'Chat với AI (Gemini)'],
    ['gheplove', 'Ghép đôi ❗NGẪU NHIÊN❗'],
    ['hangdangthuc', 'Hằng đẳng thức đáng nhớ'],
    ['hi', 'Hi gửi sticker'],
    ['kick', 'Xoá người bạn cần xoá khỏi nhóm bằng cách tag hoặc reply'],
    ['listqtv', 'Danh sách quản trị viên Box'],
    ['loibaihat', 'Tìm lời bài hát kèm thông tin đầy đủ'],
    ['loli', 'Xem ảnh'],
    ['masoi', 'Ma Sói'],
    ['math', 'Làm toán'],
    ['money', 'Kiểm tra số tiền của bản thân hoặc người được tag'],
    ['nguyentohoahoc', 'Nguyên tố hoá học'],
    ['nhomnguyentu', 'Nhóm nguyên tử'],
    ['pin', 'Pinterest'],
    ['setlove', 'Set love with someone'],
    ['tachnen', 'Tách nền'],
    ['tientri', 'Tiên tri về bạn'],
    ['ttt', 'Play caro with AI'],
    ['umaru', 'Xem ảnh'],
    ['vdanime', 'Xem video về anime chill'],
    ['sendmusic', 'Gửi file âm thanh nhạc']
];


// ================================
// RUN
// ================================

module.exports.run = async function ({ api, event, args }) {

    const {
        sendMessage: send,
        unsendMessage: un
    } = api;

    const {
        threadID: tid,
        messageID: mid,
        senderID: sid
    } = event;

    const cmds = global.client.commands;

    const isAdmin =
        global.config.ADMINBOT &&
        global.config.ADMINBOT.includes(sid);


    // ========================================
    // menu <số>
    // ========================================

    if (args.length >= 1) {

        // -----------------------------
        // menu all
        // -----------------------------

        if (args[0].toLowerCase() === 'all') {

            return showAllCommands({
                api,
                tid,
                mid,
                un,
                isAdmin
            });
        }


        // -----------------------------
        // menu <số>
        // -----------------------------

        if (!isNaN(args[0])) {

            const index = parseInt(args[0]) - 1;

            if (
                index < 0 ||
                index >= commandList.length
            ) {

                return send(
                    `❌ Số thứ tự không hợp lệ!\n\n` +
                    `➜ Vui lòng chọn từ 1 đến ${commandList.length}.`,
                    tid,
                    mid
                );
            }

            const commandName = commandList[index][0];

            const command = cmds.get(commandName);

            if (!command) {

                return send(
                    `❌ Không tìm thấy command:\n\n` +
                    `➜ ${commandName}\n\n` +
                    `Có thể file command này chưa được load.`,
                    tid,
                    mid
                );
            }

            const config = command.config || {};

            const body = infoCmds(config);

            const msg = sendAttachments.status
                ? { body }
                : body;

            return send(msg, tid, mid);
        }


        // -----------------------------
        // menu <tên command>
        // -----------------------------

        const commandName = args.join(' ').toLowerCase();

        const command = cmds.get(commandName);

        if (command) {

            const body = infoCmds(command.config || {});

            const msg = sendAttachments.status
                ? { body }
                : body;

            return send(msg, tid, mid);
        }


        // -----------------------------
        // Không tìm thấy
        // -----------------------------

        return send(
            `❌ Không tìm thấy lệnh "${args.join(' ')}".\n\n` +
            `➜ Dùng "menu" để xem danh sách lệnh.`,
            tid,
            mid
        );
    }


    // ========================================
    // HIỂN THỊ MENU
    // ========================================

    let txt = '';

    txt += '╭───────────────╮\n';
    txt += '       📜 MENU BOT\n';
    txt += '╰───────────────╯\n\n';

    commandList.forEach(([name, description], index) => {

        txt += `${index + 1}. ${name}`;

        if (description && description.trim() !== '') {
            txt += ` | ${description}`;
        }

        txt += '\n';
    });

    txt += '\n';
    txt += `╭───────────────╮\n`;
    txt += `│ 📌 Tổng: ${commandList.length} lệnh\n`;
    txt += `│ 🔢 Reply số để xem chi tiết\n`;
    txt += `│ ⏱ Tự động gỡ sau: ${autoUnsend.timeOut}s\n`;
    txt += `╰───────────────╯\n\n`;

    txt += '➩ FB ADMIN: https://www.facebook.com/namzprod';


    const msg = sendAttachments.status
        ? { body: txt }
        : txt;


    send(msg, tid, (a, b) => {

        // Lưu handleReply
        global.client.handleReply.push({

            name: module.exports.config.name,

            messageID: b.messageID,

            author: sid,

            case: 'menuNumber',

            data: commandList
        });


        // Auto unsend
        if (autoUnsend.status) {

            setTimeout(
                () => un(b.messageID),
                1000 * autoUnsend.timeOut
            );
        }

    });
};


// ========================================
// HANDLE REPLY
// ========================================

module.exports.handleReply = async function ({
    handleReply: $,
    api,
    event
}) {

    const {
        sendMessage: send,
        unsendMessage: un
    } = api;

    const {
        threadID: tid,
        messageID: mid,
        senderID: sid,
        body
    } = event;


    // ========================================
    // CHỈ NGƯỜI GỌI MENU MỚI ĐƯỢC REPLY
    // ========================================

    if (sid != $.author) {

        return send(
            '🥹 Menu này không phải của bạn.',
            tid,
            mid
        );
    }


    // ========================================
    // LẤY SỐ REPLY
    // ========================================

    const input = body.trim();

    if (!/^\d+$/.test(input)) {

        return send(
            `❌ Vui lòng reply bằng số.\n\n` +
            `➜ Ví dụ: 1, 2, 3... ${commandList.length}`,
            tid,
            mid
        );
    }


    const index = parseInt(input) - 1;


    // ========================================
    // KIỂM TRA SỐ
    // ========================================

    if (
        index < 0 ||
        index >= commandList.length
    ) {

        return send(
            `❌ Số ${input} không nằm trong menu.\n\n` +
            `➜ Chọn từ 1 đến ${commandList.length}.`,
            tid,
            mid
        );
    }


    const commandName = commandList[index][0];

    const command = global.client.commands.get(commandName);


    // ========================================
    // COMMAND KHÔNG TỒN TẠI
    // ========================================

    if (!command) {

        return send(
            `❌ Command "${commandName}" chưa được load.\n\n` +
            `➜ Kiểm tra lại file command.`,
            tid,
            mid
        );
    }


    // Xóa menu cũ
    try {
        un($.messageID);
    } catch (e) {}


    // ========================================
    // HIỂN THỊ THÔNG TIN COMMAND
    // ========================================

    const config = command.config || {};

    const bodyInfo = infoCmds(config);

    const msg = sendAttachments.status
        ? { body: bodyInfo }
        : bodyInfo;


    send(msg, tid, mid);
};


// ========================================
// HIỂN THỊ ALL COMMAND
// ========================================

function showAllCommands({
    api,
    tid,
    mid,
    un,
    isAdmin
}) {

    let txt = '';

    txt += '╭───────────────╮\n';
    txt += '      📜 ALL COMMAND\n';
    txt += '╰───────────────╯\n\n';


    commandList.forEach(([name, description], index) => {

        txt += `${index + 1}. ${name}`;

        if (description && description.trim() !== '') {
            txt += ` | ${description}`;
        }

        txt += '\n';
    });


    txt += `\n📌 Tổng cộng: ${commandList.length} lệnh`;


    const msg = sendAttachments.status
        ? { body: txt }
        : txt;


    api.sendMessage(
        msg,
        tid,
        (a, b) => {

            if (autoUnsend.status) {

                setTimeout(
                    () => api.unsendMessage(b.messageID),
                    1000 * autoUnsend.timeOut
                );

            }

        }
    );
}


// ========================================
// THÔNG TIN COMMAND
// ========================================

function infoCmds(a = {}) {

    return (
        `╭───────────────╮\n` +
        `       ⚙️ COMMAND\n` +
        `╰───────────────╯\n\n` +

        `📌 Tên lệnh: ${a.name || 'Không có'}\n\n` +

        `📦 Phiên bản: ${a.version || 'Không có'}\n` +

        `🔐 Quyền hạn: ${premssionTxt(a.hasPermssion)}\n` +

        `👤 Tác giả: ${a.credits || 'Không có'}\n` +

        `📝 Mô tả: ${a.description || 'Không có'}\n` +

        `📂 Nhóm: ${a.commandCategory || 'Không có'}\n` +

        `💻 Cách dùng: ${a.usages || 'Không có'}\n` +

        `⏱ Cooldown: ${a.cooldowns || 0} giây\n`
    );
}


// ========================================
// QUYỀN HẠN
// ========================================

function premssionTxt(a) {

    return a == 0
        ? 'Thành viên'
        : a == 1
            ? 'Quản trị viên nhóm'
            : a == 2
                ? 'Người điều hành bot'
                : 'ADMINBOT';
}
