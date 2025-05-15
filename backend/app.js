require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const { authenticateToken } = require('./middleware/auth');
const bodyParser = require('body-parser');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require("./routes/userRoutes");
//const deployroutes = require("./routes/deployroutes")
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Enhanced CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
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

// Auth status endpoint - more forgiving version
app.get('/api/auth/status', async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.json({ isAuthenticated: false });
    }
    
    res.json({ 
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});

// GitHub OAuth endpoints
app.get('/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo user:email`;

  res.redirect(githubAuthUrl);
});

app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
  
  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      return res.status(400).redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }

    const [userResponse, emailsResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${access_token}` }
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${access_token}` }
      })
    ]);

    const primaryEmail = emailsResponse.data.find(email => email.primary)?.email;
    
    if (!primaryEmail) {
      return res.status(400).redirect(`${process.env.FRONTEND_URL}/login?error=email_required`);
    }

    let user = await User.findOne({ githubId: userResponse.data.id });
    
    if (!user) {
      user = new User({
        githubId: userResponse.data.id,
        username: userResponse.data.login,
        name: userResponse.data.name || userResponse.data.login,
        email: primaryEmail,
        avatar: userResponse.data.avatar_url,
        githubUrl: userResponse.data.html_url,
        accessToken: access_token
      });
      await user.save();
    } else {
      user.username = userResponse.data.login;
      user.name = userResponse.data.name || userResponse.data.login;
      user.email = primaryEmail;
      user.avatar = userResponse.data.avatar_url;
      user.accessToken = access_token;
      await user.save();
    }

    const token = jwt.sign(
      { 
        id: user._id,
        githubId: user.githubId,
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api',portfolioRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes)
app.use("/api", portfolioRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});