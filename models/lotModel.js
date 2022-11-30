const mongoose = require("mongoose");
const Joi = require("joi");

const lotSchema = new mongoose.Schema({
    name: String,
    info: String,
    hand:String,
    img_url: String,
    location: String,
    phone: String,
    date_created: {
        type: Date,
        default: Date.now()
    },
    user_id: String,
    category_url: String,
    start_price: String,
    user_nickname: String,
    active: {
        type: Boolean,
        default: false
    },
    item_lot: {
        type: Boolean,
        default: false
    },
    date_expired: {
        type: Date,
        default:Date.now()+864000
    },
    winner_user_id:{
        type: String,
        default:null
    }
})

exports.lotModel = mongoose.model("lots", lotSchema);

exports.validateLot = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(500).required(),
        hand: Joi.string().min(1).max(99).required(),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        location: Joi.string().min(2).max(99).required(),
         phone: Joi.string().min(2).max(20).required().allow(null, ""),
         category_url: Joi.string().min(2).max(99).required(),
         start_price: Joi.string().min(1).max(99).required(),
         user_nickname: Joi.string().min(2).max(99).allow(null, ""),
    })
    return joiSchema.validate(_reqBody);
}