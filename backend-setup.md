# Backend Setup Guide

## 🚀 Quick Start

To make the Smart Management Portal fully functional with real email notifications and database storage, follow these steps:

### 1. Create Backend Server

Create a new directory for your backend:

```bash
mkdir smart-portal-backend
cd smart-portal-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv nodemailer
npm install -D @types/node @types/express @types/bcryptjs @types/jsonwebtoken @types/cors @types/nodemailer typescript ts-node nodemon
```

### 3. Create Backend Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── ServiceProvider.js
│   │   ├── Appliance.js
│   │   └── Issue.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── serviceProviders.js
│   │   ├── appliances.js
│   │   └── issues.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── emailService.js
│   └── server.js
├── package.json
└── .env
```

### 4. Example Backend Files

#### server.js
```javascript
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
```

#### models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### services/emailService.js
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendIssueNotification = async (issue, serviceProvider) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: serviceProvider.email,
    subject: `New Issue Reported: ${issue.applianceName}`,
    html: `
      <h2>New Issue Reported</h2>
      <p><strong>Appliance:</strong> ${issue.applianceName}</p>
      <p><strong>Location:</strong> Room ${issue.room}, Floor ${issue.floor}</p>
      <p><strong>Priority:</strong> ${issue.priority}</p>
      <p><strong>Description:</strong> ${issue.description}</p>
      <p><strong>Reported by:</strong> ${issue.reportedBy}</p>
      <p><strong>Date:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
      
      <p>Please contact the facility manager to schedule a repair.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendIssueNotification };
```

### 5. Environment Variables

Create a `.env` file in your backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/smart-management-portal
JWT_SECRET=your-super-secret-jwt-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
PORT=3001
```

### 6. Frontend Environment Variables

Create a `.env` file in your frontend directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### 7. Email Setup (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for your application
3. Use your Gmail address as `SMTP_USER`
4. Use the app password as `SMTP_PASS`

### 8. Database Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env`

### 9. Run the Application

#### Backend:
```bash
cd smart-portal-backend
npm run dev
```

#### Frontend:
```bash
cd smart-portal-frontend
npm run dev
```

## 🔧 Features Enabled

With the backend setup:

✅ **Real Authentication**: JWT-based secure login/signup
✅ **Database Storage**: Persistent data in MongoDB
✅ **Email Notifications**: Automatic emails to service providers
✅ **API Integration**: RESTful API for all operations
✅ **Data Validation**: Server-side validation and error handling
✅ **Security**: Password hashing, JWT tokens, CORS protection

## 📧 Email Templates

The system sends professional email notifications to service providers with:
- Issue details and priority
- Appliance information and location
- Reporter contact information
- Formatted HTML emails with company branding

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Production Deployment

For production deployment:
1. Use MongoDB Atlas for database
2. Deploy backend to Heroku/Railway/DigitalOcean
3. Deploy frontend to Netlify/Vercel
4. Configure production environment variables
5. Set up SSL certificates
6. Configure email service (SendGrid/Mailgun for production)