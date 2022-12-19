const mongoose = require("mongoose");
const Joi = require("joi");
const ONE_DAY =  86400
const lotSchema = new mongoose.Schema({
    name: String,
    info: String,
    hand:Number,
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
    item:{
    item_lot: {type: Boolean, default: false},
    days: {type: Number, default:null },
    winner_user_id:{ type: String,default:null },
    winner_price:{ type: String,default:null }}
}
)
lotSchema.virtual('date_expired').
  get(function() { return `${this.item.days*ONE_DAY+this.date_created.getTime()}`; });
lotSchema.virtual('categories',{
    ref: 'categories',
    localField: 'category_url',
    foreignField: 'category_url',
  });
  lotSchema.set('toObject', { virtuals: true });
  lotSchema.set('toJSON', { virtuals: true });

exports.validateLot = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(500).required(),
        hand: Joi.number().min(1).max(99).required(),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        location: Joi.string().min(2).max(99).required(),
         phone: Joi.string().min(2).max(20).required().allow(null, ""),
         category_url: Joi.string().min(2).max(99).required(),
         start_price: Joi.string().min(1).max(99).required(),
         user_nickname: Joi.string().min(2).max(99).allow(null, ""),
         item:{item_lot: Joi.boolean(),
         days: Joi.number().min(1).max(7).allow(null, "")} 
                                }
    )
    return joiSchema.validate(_reqBody);
}
exports.LotModel = mongoose.model("lots", lotSchema);