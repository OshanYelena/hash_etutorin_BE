const db = require("../models");
const ChatMsg = db.chat_msg;

const initSocket = (io) => {
    let onlineUsers = []

    io.on('connection', (socket) => {
        console.log(`Socket ${socket.id} connected`);

        socket.on('disconnect', () => {
            console.log(`Socket ${socket.id} disconnected`);
            onlineUsers = onlineUsers.filter(({ socketId }) => socketId !== socket.id)
            io.emit('ONLINE_USER_CHANGED', onlineUsers)
        });

        socket.on('USER_ONLINE', (userId, socketId) => {
            const userExisted = onlineUsers.some(user => user.userId === userId)
            const prevSocketId = userExisted?.socketId || null
            
            if (userExisted && prevSocketId !== socketId) {
                onlineUsers = onlineUsers.map(user => {
                    return user.userId === userId ? ({ ...user, socketId: socketId }) : user
                })
            } else if (!userExisted) {
                onlineUsers.push({
                    userId,
                    socketId: socketId
                })
                io.emit('ONLINE_USER_CHANGED', onlineUsers)
            }
            console.log("---onlineUsers---", onlineUsers);
        });

        // Use only if this needs in the frontend
        // socket.on('USER_OFFLINE', (logoutUserId) => {
        //     onlineUsers = onlineUsers.filter(({ userId }) => userId !== logoutUserId)
        //     io.emit('ONLINE_USER_CHANGED', onlineUsers)
        // })

        socket.on('SEND_MESSAGE', async (messageData) => {
            try {
                const { senderId, receiverId, message } = messageData
                console.log(senderId, receiverId, message)

                // save msg
                const chatMsg = new ChatMsg({
                    sender: senderId,
                    receiver: receiverId,
                    message: message,
                    users: [senderId, receiverId]
                });
                await chatMsg.save();

                const receiverSocket = onlineUsers.find(({ userId }) => userId === receiverId)?.socketId;
                const senderSocket = onlineUsers.find(({ userId }) => userId === senderId)?.socketId;

                const socketsToSend = [];
                if (receiverSocket) {
                    socketsToSend.push(receiverSocket);
                }
                if (senderSocket) {
                    socketsToSend.push(senderSocket);
                }

                io.in(socketsToSend).emit('message', messageData);
            }
            catch (error) {
                console.log(error);
            }
        })
    });
}

module.exports = {
    initSocket
}
