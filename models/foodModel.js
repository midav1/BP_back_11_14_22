const mongoose = require("mongoose");
const Joi = require("joi");

const foodSchema = new mongoose.Schema({
    name: String,
    info: String,
    kosher: String,
    img_url: String,
    location: String,
    phone: String,
    date_created: {
        type: Date,
        default: Date.now()
    },
    user_id: String,
    categories_url: String,
    price: Number,
    user_nickname: String,
    active: {
        type: Boolean,
        default: true
    }
})

exports.FoodModel = mongoose.model("foods", foodSchema);

exports.validateFood = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(500).required(),
        kosher: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        location: Joi.string().min(2).max(99).required(),
        phone: Joi.string().min(2).max(20).required(),
        categories_url: Joi.string().min(2).max(99).required(),
        price: Joi.number().min(2).max(99).required(),
        user_nickname: Joi.string().min(2).max(99).allow(null, ""),
    })
    return joiSchema.validate(_reqBody);
}