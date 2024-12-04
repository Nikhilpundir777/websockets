main logic 

import { WebSocket, WebSocketServer } from "ws";

const wss=new WebSocketServer({port:8080})

let usercount=0;
let allSockets:WebSocket[]=[]

wss.on("connection",(socket)=>{
    allSockets.push(socket);
    usercount+=1;
    console.log(`user connected # ${usercount}`);

    socket.on("message",(message)=>{
        console.log(`The message received is ${message}`);
        setTimeout(()=>{
            allSockets.map((s)=>{
                s.send(`${message.toString()} :sent from the server`)

            })
            
    },2000) 
        
    })

     // Handle disconnections
     socket.on("close", () => {
        usercount -= 1;
        console.log(`User disconnected. Remaining users: ${usercount}`);
        // Remove the disconnected socket from the array
        allSockets = allSockets.filter((s) => s !== socket);
    });
})
