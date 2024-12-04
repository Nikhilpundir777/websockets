"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let usercount = 0;
wss.on("connection", (socket) => {
    usercount += 1;
    console.log(`user connected # ${usercount}`);
    socket.on("message", (message) => {
        console.log(`The message is ${message}`);
        socket.send(`${message.toString()} :sent from the server`);
    });
});
