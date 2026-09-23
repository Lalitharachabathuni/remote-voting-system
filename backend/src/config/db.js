const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/voteremote';
    
    // Mask credentials for safe logging
    const maskedConn = connStr.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, '$1******$3');
    console.log(`[Database] Connecting to MongoDB: ${maskedConn}`);

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] Connected to MongoDB Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.log('[Database Advice] If using MongoDB Atlas, check your IP whitelist (Network Access -> 0.0.0.0/0 for dev), username, password, and connection string in backend/.env');
    // We don't necessarily exit immediately in dev so developers see the clear server output
  }
};

module.exports = connectDB;
