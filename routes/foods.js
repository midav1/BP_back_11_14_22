const express= require("express");
const { auth } = require("../middlewares/auth");
const { validateFood, FoodModel } = require("../models/foodModel");
const router = express.Router();

router.get("/" , async(req,res)=> {
  let perPage = req.query.perPage || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try{
    let data = await FoodModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    // .sort({_id:-1}) like -> order by _id DESC
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})
router.get("/myitems",auth,async(req,res) => {
  let perPage = req.query.perPage || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  try{
    let data = await FoodModel.find({user_id:req.tokenData._id})
    .limit(perPage)
    .skip((page - 1) * perPage)
    // .sort({_id:-1}) like -> order by _id DESC
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.get("/count", async(req,res) => {
  try{
    // .countDocument -> מחזיר את המספר רשומות שקיימים במסד
    let count = await FoodModel.countDocuments({})
    res.json({count});
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.post("/", auth, async(req,res) => {
  let validBody = validateFood(req.body);
  if(validBody.error){
    res.status(400).json(validBody.error.details)
  }
  try{
    let food = new FoodModel(req.body);
    food.user_id = req.tokenData._id;
    await food.save();
    res.json(food);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit",auth,async(req,res) => {
  let validBody = validateFood(req.body);
  if(validBody.error){
    res.status(400).json(validBody.error.details)
  }
  try{
    let idEdit= req.params.idEdit
    let data ;
    if(req.tokenData.role == "admin"){
      data = await FoodModel.updateOne({_id:idEdit},req.body);
    }
    else{
      data = await FoodModel.updateOne({_id:idEdit,user_id:req.tokenData._id},req.body);
    }
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.delete("/:idDel",auth,async(req,res) => {
  try{
    let idDel= req.params.idDel
    let data ;
    if(req.tokenData.role == "admin"){
      data = await FoodModel.deleteOne({_id:idDel});
    }
    else{
      data = await FoodModel.deleteOne({_id:idDel,user_id:req.tokenData._id});
    }
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})


module.exports = router;