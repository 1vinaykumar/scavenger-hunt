const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/userSchema");
const Branch = require("../models/branchSchema");

const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PASSWORD_KEY, async (err, userDetails) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (userDetails) {
        const user = await User.findOne({ userName: userDetails.userName });
        if (user) {
          req.user = user;
          next();
        } else {
          return res
            .status(404)
            .send(`User with user name ${userDetails.userName} Not Found`);
        }
      } else {
        return res.status(404).send(`Invalid Token`);
      }
    });
  } else return res.sendStatus(401);
};

const userLoginValidation = (user) =>
  Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().required().min(4),
  }).validate(user);

router.post("/login", async (req, res) => {
  const validatedData = userLoginValidation(req.body);
  if (!validatedData.error) {
    const { userName, password, role } = validatedData.value;
    const user = await User.findOne({ userName });
    if (user) {
      const passwordvalid = await bcrypt.compare(password, user.password);
      if (passwordvalid) {
        const token = jwt.sign({ userName }, process.env.PASSWORD_KEY);
        return res.send({ token, role }).status(200);
      } else {
        return res.status(401).send("Invalid Credentials");
      }
    } else {
      return res.status(401).send("User not found");
    }
  } else {
    return res.status(403).send("Invalid Form data");
  }
});

const userRegisterValidation = (user) =>
  Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().valid("USER", "ADMIN").required(),
  }).validate(user);

// router.post("/", async (req, res) => {
//   const validatedData = userRegisterValidation(req.body);
//   if (!validatedData.error) {
//     const { password } = validatedData.value;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     validatedData.value.password = hashedPassword;
//     await User.create(validatedData.value);
//     return res.status(201).send("User created successfully");
//   } else {
//     return res.status(403).send("Invalid Form data");
//   }
// });

router.get("/:userName", authentication, async (req, res) => {
  const branchDetails = await Branch.findById(req?.user?.branchDetails);
  const { userName, notifications } = req.user;
  return res.json({ userName, branchDetails, notifications });
});

module.exports = { router, authentication };
