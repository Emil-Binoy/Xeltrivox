const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

const onlineUsers={}

app.set("io",io)
app.set("onlineUsers",onlineUsers)

io.on("connection", (socket) => {
  socket.on("join",(userId)=>{
   onlineUsers[userId]=socket.id
   io.emit("onlineUsers",Object.keys(onlineUsers))
   console.log("user joined:", userId);
  })

  socket.on("disconnect", () => {
    for(let userId in onlineUsers){
      if(onlineUsers[userId]===socket.id){
         delete onlineUsers[userId]
      }
    }
    io.emit("onlineUsers",Object.keys(onlineUsers))
  });

  socket.on("sendMessage",(data)=>{
   const receiverSocketId=onlineUsers[data.receiverId]
   if(receiverSocketId){
      io.to(receiverSocketId).emit("receiveMessage",data)
   }
  })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
