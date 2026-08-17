const mongoose = require('mongoose');

const clientOptions = {
  dbName: 'russell'
};

exports.initClientDbConnection = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, clientOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
    throw error;
  }
};