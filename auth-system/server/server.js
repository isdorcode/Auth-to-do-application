require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const titleRoutes = require('./routes/titleRoutes');
const formRoutes = require('./routes/formRoutes');

// Better route prefixing
app.use('/api/auth', authRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/forms', formRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Test DB connection and start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected!');
    
    // Sync models - consider using { alter: true } for development
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Models synchronized!');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Connection/sync failed:', err);
    process.exit(1);
  });