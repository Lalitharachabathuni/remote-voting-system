require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const autoSeedIfEmpty = require('./utils/autoSeed');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Auto initialize constituencies and elections if database is fresh
    await autoSeedIfEmpty();
    
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
