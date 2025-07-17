const express = require('express');
const app = express();
require('dotenv').config();  // Load .env variables

const eventRoutes = require('./routes/eventRoutes'); // Make sure the file exists

app.use(express.json());  // To parse JSON requests

// Base route for events
app.use('/api/events', eventRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('Event Management API Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
