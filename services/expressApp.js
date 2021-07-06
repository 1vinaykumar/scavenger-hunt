const cors = require("cors");
const express = require("express");
const userRouter = require("../routes/user").router;
const branchRouter = require("../routes/branch");

const app = express();

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
app.use("/users", userRouter);
app.use("/branches", branchRouter);

module.exports = app;
