const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURL');

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useCreateIndex:true,useNewUrlParser: true });
    console.log('Atlas Connected');
  } catch (error) {
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
