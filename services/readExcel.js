const xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const Branch = require("../models/branchSchema");

const getBranchData = () => {
  const workbook = xlsx.readFile(__dirname + "\\BeetleNut_Data.xlsx");
  const data = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );
  return data.map((item) => ({
    instituteName: item["Insitution Name"],
    name: item["Branch Name"],
    address: item["Address"],
    city: item["City"],
    contact: item["Contact Number"],
    incharge: item["Branch Incharge"],
    pincodesCovered:
      typeof item["Pincode covered"] === "string"
        ? item["Pincode covered"]
            .replaceAll(",", "")
            .split(" ")
            .filter((item) => item && item !== " ")
            .map((pin) => Number(pin))
        : item["Pincode covered"]
        ? [item["Pincode covered"]]
        : [],
  }));
};

const insertToDB = async () => {
  await User.deleteMany({});
  await Branch.deleteMany({});
  const adminSalt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("987654321", adminSalt);
  await User.create({
    userName: "vinaykumar",
    password: adminPassword,
    role: "ADMIN",
    notifications: [],
  });
  getBranchData().forEach(async (branch) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(branch.incharge, salt);
    const branchDetails = await Branch.create(branch);
    await User.create({
      userName: branch.incharge,
      password,
      role: "USER",
      branchDetails,
      notifications: [],
    });
  });
};

module.exports = insertToDB;
