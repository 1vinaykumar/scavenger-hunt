const cors = require("cors");
const express = require("express");
const socket = require("socket.io");

const socketApp = express();

const socketPort = process.env.SOCKET_PORT ?? 5001;

socketApp.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const socketServer = socketApp.listen(socketPort, () => {
  console.log("Socket Running at " + socketPort);
});

const io = socket(socketServer, {
  cors: {
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

module.exports = io;
