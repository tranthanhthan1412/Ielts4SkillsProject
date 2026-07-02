const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  const connection = await mongoose.connect(uri);
  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
  );
}

module.exports = connectDB;
