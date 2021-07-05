const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user").router;
const io = require("./services/socketApp");
const branchesRouter = require("./routes/branches");
const { insertToDB } = require("./services/readExcel");

const app = express();

const port = process.env.PORT ?? 5000;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use("/users", userRouter);
app.use("/branches", branchesRouter);

app.listen(port, () => {
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

io.on("connection", (socket) => {
  console.log("Made socket connection");
  socket.on("join", (data) => {
    console.log(data.userName + " Connected");
    socket.join(data.userName);
  });
});
