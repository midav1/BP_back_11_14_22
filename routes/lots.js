const express= require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const { validateLot, LotModel, validateLotBid } = require("../models/lotModel");
router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 9;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let category = req.query.category ;
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let queryS = req.query.s;
  let searchReg = new RegExp(queryS, "i")
  let filter_category = {category_url :category};
  if(category=="ALL") {
    filter_category={}
}

  try {
    let data = await LotModel.find(
      {
        $and: [
            { $or: [ filter_category ] },
            { $or: [ {name: searchReg  }, { info: searchReg } ] }
        ]
    }  ).populate('categories')
      .limit(perPage)
      .skip((page - 1) * perPage)
      // .sort({_id:-1}) like -> order by _id DESC
      .sort({ [sort]: reverse })
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there erorr try again later", err });
  }
});
router.get("/myitems",auth, async (req, res) => {
  let perPage = req.query.perPage || 9;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    let count=await LotModel.countDocuments({ user_id: req.tokenData._id });
    let data = await LotModel.find({ user_id: req.tokenData._id })
      .limit(perPage)
      .skip((page - 1) * perPage)
      // .sort({_id:-1}) like -> order by _id DESC
      .sort({ [sort]: reverse });
      console.log(data,count);
    res.json({"data":data,"count":count});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});
router.get("/byId/:id",async (req, res) => {
  try {
    let data = await LotModel.findOne({ _id:req.params.id }).populate('categories')
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/count", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let category = req.query.category ;
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let queryS = req.query.s;
  let searchReg = new RegExp(queryS, "i")
  let filter_category = {category_url :category};
  if(category=="ALL") {
    filter_category={}
}
  try {
    let count = await LotModel.countDocuments({
      $and: [
          { $or: [ filter_category ] },
          { $or: [ {name: searchReg  }, { info: searchReg } ] }
      ]
  } );
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
    let validBody = validateLot(req.body);
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
  router.patch("/bid/:id", auth, async (req, res) => {
    let validBody = validateLotBid(req.body);
    if (validBody.error) {
      res.status(400).json(validBody.error.details);
    }
    try {
      let id = req.params.id;
      console.log(req.body)
      if (req.tokenData._id== req.body.user_id)
      {
      res.json({ msg: "You cant buy your own product" });
      return}
      if (req.tokenData._id == req.body.winner_user_id && req.tokenData.role == "user") {
        let data = await LotModel.findOneAndUpdate({ _id: id },  req.body  );
        res.json(data);
      }
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