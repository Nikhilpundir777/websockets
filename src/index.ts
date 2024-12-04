import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let usercount = 0;
let allSockets: User[] = [];

wss.on("connection", (socket) => {
    usercount += 1;
    console.log(`User connected. Current user count: ${usercount}`);

    socket.on("message", (message) => {
        try {
            // Parse incoming message
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.type === "join") {
                // Add user to the `allSockets` array with their room information
                allSockets.push({
                    socket,
                    room: parsedMessage.payload.roomId,
                });
                console.log(`User joined room: ${parsedMessage.payload.roomId}`);
            } else if (parsedMessage.type === "chat") {
                // Find the room of the current user
                const currentUserRoom = allSockets.find((s) => s.socket === socket)?.room;

                if (currentUserRoom) {
                    // Broadcast the message to all users in the same room
                    allSockets.forEach((user) => {
                        if (user.room === currentUserRoom) {
                            user.socket.send(parsedMessage.payload.message);
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    });

    // Handle disconnections
    socket.on("close", () => {
        usercount -= 1;
        console.log(`User disconnected. Remaining users: ${usercount}`);
        // Remove the disconnected user from the `allSockets` array
        allSockets = allSockets.filter((s) => s.socket !== socket);
    });
});
