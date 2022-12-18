const mongoose =require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name:String,
  category_url:String,
  info:String,
  img_url:String,
   date_created: {
        type: Date,
        default: Date.now()
    }
})
exports.CategoryModel = mongoose.model("categories",categorySchema);


exports.validateCategory = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    category_url:Joi.string().min(2).max(99).required(),
    info:Joi.string().min(2).max(500).required(),
    img_url:Joi.string().min(2).max(200).required()
  })
  return joiSchema.validate(_reqBody);
}