const express = require("express");
const { UserModel } = require("../models/userModel");
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require("bcrypt");
const mail_service = require("../services/mail_service");
router.get("/:link", async (req, res) => {
  const changepasswordLink = req.params.link;
  console.log(changepasswordLink);
  try {
    const user = await UserModel.findOne({changepasswordLink});
    console.log(user);
    if (!user) {
      return res.status(401).json("Wrong link");
    }
    const temppassword = uuid.v4();
    user.password = await bcrypt.hash(temppassword,10);
    user.changepasswordLink='';
    await mail_service.sendTempPasswordMail(user.email,temppassword);
    await user.save();
    return (
    //   res.redirect(process.env.CLIENT_URL) &&
      res.status(200).json("Check your mail with temporary password")
    );
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "there erorr try again later", err });
  }
});
module.exports = router;
