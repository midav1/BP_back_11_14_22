const express = require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();
router.post("/:link",auth, async(req, res) => {
    const activationLink = req.params.link;
    try 
    {   
        const user = await UserModel.findOne({activationLink})
        if (!user) {
           return  res.status(401).json('Wrong link')
        }
        user.active = true;
        await user.save();
        return res.redirect(process.env.CLIENT_URL);
    } 
    catch(err){
        console.log(err);
        res.status(401).json({msg:"there erorr try again later",err})
    }
})
module.exports = router;
