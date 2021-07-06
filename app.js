const mongoose = require("mongoose");

const port = process.env.PORT ?? 5000;

const cors = require("cors");
const express = require("express");
const userRouter = require("./routes/user").router;
const branchRouter = require("./routes/branch");

const app = express();
const server = require("http").createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://scavengerhunt-app.web.app",
      "https://scavengerhunt-app.web.app/",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

const socket = require("socket.io")(server, {
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

socket.on("connection", (socket) => {
  console.log("Made socket connection");
  socket.on("join", (data) => {
    console.log(data.userName + " Connected");
    socket.join(data.userName);
  });
});

app.use((req, res, next) => {
  req.socketInstance = socket;
  next();
});

app.use("/users", userRouter);
app.use("/branches", branchRouter);

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
