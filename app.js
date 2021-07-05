const mongoose = require("mongoose");

const app = require("./services/expressApp");

const insertToDB = require("./services/readExcel");

const port = process.env.PORT ?? 5000;

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

io.on("connection", (socket) => {
  console.log("Made socket connection");
  socket.on("join", (data) => {
    console.log(data.userName + " Connected");
    socket.join(data.userName);
  });
});

server.listen(port, () => {
  console.log(`Application Running at ${port}`);
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Database connection successful");
      //insertToDB();
    })
    .catch((error) => console.log("Database connection failed"));
});

module.exports = io;
