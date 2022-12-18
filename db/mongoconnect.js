const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.1trevld.mongodb.net/USELL`);
  console.log("mongo connect black22")
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}