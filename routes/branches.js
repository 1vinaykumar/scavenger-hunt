const User = require("../models/userSchema");
const Branch = require("../models/branchSchema");
const { authentication } = require("./user");
const io = require("../services/socketApp");
const router = require("express").Router();
const { Notification } = require("../models/notificationSchema");

router.get("/", authentication, async (req, res) => {
  const branchData = await Branch.find();
  return req?.user?.role === "ADMIN" ? res.json(branchData) : res.send(401);
});

router.post("/servingBranches", async (req, res) => {
  const branchData = await Branch.find();
  const details = req.body;
  const servingBranches = branchData.filter((br) =>
    br.pincodesCovered.includes(Number(details?.pincode))
  );
  const servingBranchUserNames = servingBranches.map((item) => item.incharge);
  servingBranchUserNames.push("vinaykumar");
  const notification = new Notification({
    timestamp: new Date(),
    message: `${details.name} searched for the pincode`,
    details,
  });
  io.to(servingBranchUserNames).emit("notification", notification);
  await User.updateMany(
    { userName: { $in: servingBranchUserNames } },
    {
      $push: {
        notifications: notification,
      },
    }
  );
  return res.json(servingBranches);
});

module.exports = router;
