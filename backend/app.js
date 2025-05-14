require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User'); // We'll create this model
const { authenticateToken } = require('./middleware/auth'); // We'll create this middleware
const bodyParser =require('body-parser')
const resumeRoutes =require('./routes/resumeRoutes')

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


// CORS Configuration with secure settings
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection with enhanced options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// GitHub OAuth configuration
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_CALLBACK_URL;
const JWT_SECRET = process.env.JWT_SECRET;



// GitHub OAuth login endpoint
app.get('/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

// GitHub OAuth callback endpoint
app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
  
  try {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      return res.status(400).redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }

    // 2. Get user profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` }
    });

    // 3. Get user emails
    const emailsResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${access_token}` }
    });

    const primaryEmail = emailsResponse.data.find(email => email.primary)?.email;
    
    if (!primaryEmail) {
      return res.status(400).redirect(`${process.env.FRONTEND_URL}/login?error=email_required`);
    }

    // 4. Find or create user in database
    let user = await User.findOne({ githubId: userResponse.data.id });
    
    if (!user) {
      user = new User({
        githubId: userResponse.data.id,
        username: userResponse.data.login,
        name: userResponse.data.name || userResponse.data.login,
        email: primaryEmail,
        avatar: userResponse.data.avatar_url,
        githubUrl: userResponse.data.html_url,
        accessToken: access_token // Store for potential API calls
      });
      await user.save();
    } else {
      // Update existing user with latest data
      user.username = userResponse.data.login;
      user.name = userResponse.data.name || userResponse.data.login;
      user.email = primaryEmail;
      user.avatar = userResponse.data.avatar_url;
      user.accessToken = access_token;
      await user.save();
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        githubId: user.githubId,
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // 6. Set secure HTTP-only cookie with the token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
      sameSite: 'lax', // Helps prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 7. Redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
});

// Check authentication status endpoint
app.get('/api/auth/status', authenticateToken, (req, res) => {
  res.json({ 
    isAuthenticated: true, 
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    } 
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.use('/api/resumes', resumeRoutes)
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'You have access to the dashboard', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});