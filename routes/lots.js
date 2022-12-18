const express= require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const { validateLot, LotModel } = require("../models/lotModel");
router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let queryS = req.query.s;
  let searchReg = new RegExp(queryS, "i")

  try {
    let data = await LotModel.find({ $or: [{ name: searchReg }, { info: searchReg }] }).populate('categories')
      .limit(perPage)
      .skip((page - 1) * perPage)
      // .sort({_id:-1}) like -> order by _id DESC
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there erorr try again later", err });
  }
});
router.get("/myitems",auth, async (req, res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let data = await LotModel.find({ user_id: req.tokenData._id }).populate('categories')
      .limit(perPage)
      .skip((page - 1) * perPage)
      // .sort({_id:-1}) like -> order by _id DESC
      .sort({ [sort]: reverse });
    res.json(data);
    console.log(data)
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});
router.get("/byId/:id",auth,async (req, res) => {
  try {
    let data = await LotModel.findOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/count", async (req, res) => {
  try {
    let count = await LotModel.countDocuments({});
    res.json({ count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});
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
  router.patch("/:idEdit", auth, async (req, res) => {
    let validBody = validateItem(req.body);
    if (validBody.error) {
      res.status(400).json(validBody.error.details);
    }
    try {
      let idEdit = req.params.idEdit;
      let data;
      if (req.tokenData.role == "admin") {
        data = await LotModel.updateOne({ _id: idEdit }, req.body);
      } else {
        data = await LotModel.updateOne(
          { _id: idEdit, user_id: req.tokenData._id },
          req.body
        );
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  });
  
  router.delete("/:idDel", auth, async (req, res) => {
    try {
      let idDel = req.params.idDel;
      let data;
      if (req.tokenData.role == "admin") {
        data = await LotModel.deleteOne({ _id: idDel });
      } else {
        data = await LotModel.deleteOne({
          _id: idDel,
          user_id: req.tokenData._id,
        });
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  });
  module.exports = router;