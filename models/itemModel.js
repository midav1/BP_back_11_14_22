const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
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
    price: String,
    user_nickname: String,
    active: {
        type: Boolean,
        default: false
    },
    date_expired: {
        type: Date,
        default: Date.now()+86400000
    }
})

exports.ItemModel = mongoose.model("items", itemSchema);

exports.validateItem = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(500).required(),
        hand: Joi.string().min(1).max(99).required(),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        location: Joi.string().min(2).max(99).required(),
         phone: Joi.string().min(2).max(20).required().allow(null, ""),
         category_url: Joi.string().min(2).max(99).required(),
         price: Joi.string().min(1).max(99).required(),
         user_nickname: Joi.string().min(2).max(99).allow(null, ""),
    })
    return joiSchema.validate(_reqBody);
}