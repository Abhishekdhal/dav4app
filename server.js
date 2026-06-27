require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.send('DAV Bokaro Registration API is running...');
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/registrations', require('./routes/registration'));
app.use('/api/upload', require('./routes/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Seed default Admin User if not exists
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        email: 'admin@dav.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Seeded default admin user: admin@dav.com / admin123');
    } else {
      console.log('Admin user already exists in database');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdmin();
});

module.exports = app;
