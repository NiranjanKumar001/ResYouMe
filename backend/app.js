require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());

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


// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
// const CLIENT_SECRET=process.env.GITHUB_CLIENT_SECRET;
// app.get('/auth/github',(req,res)=>{
//     res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
// });

// app.get ('/auth/github/callback', async (req, res) => {
//     const { code } = req.query;
//     console.log(code);

// const tokenRes = await axios.post(
//     `https://github.com/login/oauth/access_token`,
//     {
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     code,
//     },
//     {
//     headers: {
//     accept: 'application/json',
//     }
// });

// console.log()

// const access_token = tokenRes.data.access_token;
//  const userRes = await axios.get(`https://api.github.com/user`, {
//  headers: {
//  Authorization: `token ${access_token}`,
//  },
//  });
//  res.json(userRes.data);
//  console.log(res.json(userRes.data));
// });


const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// Simple GitHub OAuth endpoint
app.get('/auth/github', (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}`;
  res.redirect(redirectUrl);
});

// Callback endpoint - simplified
app.get('/auth/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    console.log(code)
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token } = tokenResponse.data;

    console.log(access)
    // 2. Get user profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` }
    });

    // 3. Get user emails
    const emailsResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${access_token}` }
    });

    const primaryEmail = emailsResponse.data.find(email => email.primary)?.email;

    // 4. Prepare response data
    const userData = {
      id: userResponse.data.id,
      login: userResponse.data.login,
      name: userResponse.data.name,
      email: primaryEmail,
      avatar_url: userResponse.data.avatar_url,
      html_url: userResponse.data.html_url
    };

    // 5. Log to console and return response
    console.log('GitHub User Data:', userData);
    res.json(userData);

  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// GITHUB_CLIENT_ID=Ov23ligzzzIRhA8wRtD2
// GITHUB_CLIENT_SECRET=3640bfacba2f8e4f619d1542dd5e6faea620f67d
// GITHUB_CALLBACK_URL=https://localhost:5000/auth/github/callback