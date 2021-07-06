const mongoose = require("mongoose");
const { server } = require("./services/socketApp");

const insertToDB = require("./services/readExcel");

const port = process.env.PORT ?? 5000;

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
