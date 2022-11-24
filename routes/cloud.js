const express= require("express");
const router = express.Router();
const { cloudinary } = require("../services/cloud_service");
router.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: "users_preset",
        });
        console.log(uploadResponse);
        res.json({ msg: 'Succsess' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});
module.exports = router;