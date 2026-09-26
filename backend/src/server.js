require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const autoSeedIfEmpty = require('./utils/autoSeed');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    const conn = await connectDB();
    
    // Auto initialize constituencies and elections if database is fresh and connected
    if (conn && mongoose.connection.readyState === 1) {
      await autoSeedIfEmpty();
    } else {
      console.log('[Server Notice] Running server. If MongoDB connects later, data will be accessed normally.');
    }
    
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  VoteRemote Digital Voting Server running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  API Root: http://localhost:${PORT}/api/v1`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
};

startServer();
