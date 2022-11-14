// exports.secret = {
//     MONGOUSER : "slipmaster",
//     MONGOPASSWORD: "tbhaubtvpugk",
//     tokenSecret : "SECRET"
//  delete comments
// }

require("dotenv").config()

// כל המשתנים שצריכים להיות סודיים יהיו בקובץ הזה
exports.config = {
  userDb:process.env.USER_DB,
  passDb:process.env.PASS_DB,
  tokenSecret:process.env.TOKEN_SECRET
}

