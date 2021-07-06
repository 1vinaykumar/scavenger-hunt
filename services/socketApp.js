const app = require("./expressApp");

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://scavengerhunt-app.web.app",
      "https://scavengerhunt-app.web.app/",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
});

io.on("connection", (socket) => {
  console.log("Made socket connection");
  socket.on("join", (data) => {
    console.log(data.userName + " Connected");
    socket.join(data.userName);
  });
});

module.exports = { io, server };
