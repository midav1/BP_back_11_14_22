const express = require("express");
const { auth } = require("../middlewares/auth");
const { UserModel } = require("../models/userModel");
const router = express.Router();
router.get("/:link", async(req, res) => {
    const activationLink = req.params.link;
    console.log (activationLink)
    try 
    {   
        const user = await UserModel.findOne({activationLink})
        console.log(user)
        if (!user) {
            
           return  res.status(401).json('Wrong link')
        }

        user.active = true;
        await user.save();
        res.status(200).json('welcome to usell')
        return res.redirect(process.env.CLIENT_URL);
    } 
    catch(err){
        console.log(err);
        res.status(401).json({msg:"there erorr try again later",err})
    }
    
})
module.exports = router;
