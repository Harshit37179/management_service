const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceProviderRoutes = require('./routes/serviceProviders');
const applianceRoutes = require('./routes/appliances');
const issueRoutes = require('./routes/issues');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/service-providers', serviceProviderRoutes);
app.use('/api/appliances', applianceRoutes);
app.use('/api/issues', issueRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
