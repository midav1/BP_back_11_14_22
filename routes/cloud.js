const express = require("express");
const { auth } = require("../middlewares/auth");
const { LotModel } = require("../models/lotModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();
const { cloudinary } = require("../services/cloud_service");
router.post("/api/upload", auth, async (req, res) => {
  console.log(req.body.preset, req.tokenData._id);
  
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: req.body.preset,
      public_id: req.tokenData._id+(req.body._id?("_id"+req.body._id) :"")
    });
    console.log(uploadResponse);
     if ((req.body.preset == "users_preset")) {
     let data = await UserModel.findOneAndUpdate(
         { _id: req.tokenData._id },
         { img_url: uploadResponse.url }
       );
     }
     if ((req.body.preset == "items_preset")) {
       let data = await LotModel.findOneAndUpdate(
         { _id:req.body._id},
         { img_url: uploadResponse.url }
       );
     }

    res.json({ msg: "Succsess"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});
module.exports = router;
router.post("/api/destroy", auth, async (req, res) => {
  console.log(req.body.folder + "/" + req.tokenData._id);
  try {
    //  const fileStr = req.body.data;
    const destroyResponse = await cloudinary.uploader
      .destroy(req.body.folder + "/" + req.tokenData._id+(req.body._id?("_id"+req.body._id) :""))
      .then((result) => console.log(result));
    console.log(destroyResponse);
    if ((req.body.folder = "users")) {
      let data = await UserModel.findOneAndUpdate(
        { _id: req.tokenData._id },
        { img_url: "" }
      );
    }
    if ((req.body.folder = "items")) {
      let data = await ItemModel.findOneAndUpdate(
        { _id: req.body._id },
        { img_url: "" }
      );
    }
  } catch {}
});
///cloudinary.v2.uploader
//.destroy('sample', resource_type: 'video')
//.then(result=>console.log(result));
