const mongoose = require('mongoose');
const config = require("../src/config");
const dbUrl = config.dbUrl;

var options = {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        mongoose.connect(
          dbUrl, options, 
          () => console.log(" Mongoose is connected"),
        );
      } catch (e) {
        console.log("could not connect");
        console.log(`error: ${e}`)
      }
}

module.exports = connectDB