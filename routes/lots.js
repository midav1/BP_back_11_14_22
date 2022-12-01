const express= require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const { validateLot, LotModel } = require("../models/lotModel");
router.post("/",auth, async (req, res) => {
    let validBody = validateLot(req.body);
    console.log(req.body);
    if (validBody.error) {
      res.status(400).json(validBody.error.details);
    }
    try {
      let lot = new LotModel(req.body);
      lot.user_id = req.tokenData._id;
      await lot.save();
      res.json(lot);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  });
  module.exports = router;