const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel");
const mail_service = require("../services/mail_service");
const router = express.Router();
const uuid = require('uuid');

router.get("/", async(req, res) => {
    res.json({ msg: "Users work" })
})

// ראוט שבודק שהטוקן תקין ומחזיר מידע עליו כגון איי די של המשתמש פלוס התפקיד שלו
router.get("/checkToken", auth, async(req, res) => {
    res.json(req.tokenData);
})

// אזור שמחזיר למשתמש את הפרטים שלו לפי הטוקן שהוא שולח
router.get("/myInfo", auth, async(req, res) => {
    try {
        let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(userInfo);
        

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})
router.patch("/myInfo/edit", auth, async(req, res) => {
     //let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    // let validBody = validateUser(req.body);
    // if (validBody.error) {
    //     res.status(400).json(validBody.error.details)
    // }
    if(req.body.email||req.body.email||req.body.data_created||req.body.active)
    res.status(400).json({msg:"You send wrong data"})
    // delete req.body.email;
    // delete req.body.rank;
    // delete req.body.data_created;
    // delete req.body.active;
    try {
        let data = await UserModel.findOneAndUpdate({ _id: req.tokenData._id }, { $set: req.body });
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// רק משתמש אדמין יוכל להגיע ולהציג את רשימת 
// כל המשתמשים
router.get("/usersList", authAdmin, async(req, res) => {
    try {
        let data = await UserModel.find({}, { password: 0 }).limit(20).lean();
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.get("/count", authAdmin, async(req, res) => {
    try {
        // מחזיר את מספר הרשומות מהקולקשן
        let count = await UserModel.countDocuments({})
        res.json({ count })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.post("/", async(req, res) => {
    let validBody = validUser(req.body);
    // במידה ויש טעות בריק באדי שהגיע מצד לקוח
    // יווצר מאפיין בשם אירור ונחזיר את הפירוט של הטעות
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf
        user.activationLink=activationLink;
        console.log(activationLink)
      await mail_service.sendActivationMail(req.body.email, `${process.env.API_URL}/activate/${activationLink}`);
        // נרצה להצפין את הסיסמא בצורה חד כיוונית
        // 10 - רמת הצפנה שהיא מעולה לעסק בינוני , קטן
        user.password = await bcrypt.hash(user.password, 10);
        // מתרגם ליוניקס
        user.birth_date = Date.parse(user.birth_date);
        await user.save();
        user.password = "***";
        res.status(201).json(user);
    } catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

        }
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})

router.post("/login", async(req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        // .details -> מחזיר בפירוט מה הבעיה צד לקוח
        return res.status(400).json(validBody.error.details);
    }
    try {
        // קודם כל לבדוק אם המייל שנשלח קיים  במסד
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "Password or email is worng ,code:1" })
        }
        // אם הסיסמא שנשלחה בבאדי מתאימה לסיסמא המוצפנת במסד של אותו משתמש
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is worng ,code:2" });
        }
        // מייצרים טוקן לפי שמכיל את האיידי של המשתמש
        let token = createToken(user._id, user.role);
        res.json({ token, userName: user.name,userrole: user.role});
        
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// מאפשר לשנות משתמש לאדמין, רק על ידי אדמין אחר
router.patch("/changeRole/:userID", authAdmin, async(req, res) => {
    if (!req.body.role) {
        return res.status(400).json({ msg: "Need to send role in body" });
    }

    try {
        let userID = req.params.userID
            // לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
        if (userID == "636e309fcdbdb3f806e2823a") {
            return res.status(401).json({ msg: "You cant change superadmin to user" });

        }
        let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// מאפשר לגרום למשתמש לא יכולת להוסיף מוצרים חדשים/ סוג של באן שלא מוחק את המשתמש
router.patch("/changeActive/:userID", authAdmin, async(req, res) => {
    if (!req.body.active && req.body.active != false) {
        return res.status(400).json({ msg: "Need to send active in body" });
    }

    try {
        let userID = req.params.userID
            // לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
        if (userID == "635f9790c65e88e8e93de6db") {
            return res.status(401).json({ msg: "You cant change superadmin to user" });

        }
        let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;

router.patch("/changepassword", auth, async(req, res) => {

    try {
        // קודם כל לבדוק אם המייל שנשלח קיים  במסד
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "Password or email is worng ,code:1" })
        }
        // אם הסיסמא שנשלחה בבאדי מתאימה לסיסמא המוצפנת במסד של אותו משתמש
        let authPassword = await bcrypt.compare(req.body.password,user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is worng ,code:2" });
        }
        // מייצרים טוקן לפי שמכיל את האיידי של המשתמש
        user.password= await bcrypt.hash(req.body.newpassword, 10);
        await user.save();
        res.json({ msg: "password changed  successfully"});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;