const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const logger = require('../utils/logger');


const generateStateToken = () => crypto.randomBytes(16).toString('hex');

exports.initiateGithubAuth = (req, res) => {
  const state = generateStateToken();
  req.session.oauthState = state;
  
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'user:email',
    state,
    allow_signup: false
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

exports.handleGithubCallback = async (req, res) => {
  try {
    // 1. Validate state parameter
    if (!req.query.state || req.query.state !== req.session.oauthState) {
      return res.redirect(`${process.env.FRONTEND_LOGIN_URL}?error=invalid_state`);
    }

    // 2. Exchange code for tokens
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL
      },
      {
        headers: { Accept: 'application/json' },
        timeout: 5000
      }
    );

    const { access_token: githubAccessToken } = tokenResponse.data;

    // 3. Fetch user profile and emails
    const [profileResponse, emailsResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${githubAccessToken}` },
        timeout: 5000
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${githubAccessToken}` },
        timeout: 5000
      })
    ]);

    const primaryEmail = emailsResponse.data.find(email => email.primary)?.email;

    // 4. Create or update user
    
    const userData =  {
      githubId: profileResponse.data.id.toString(),
      githubAccessToken,
      profile: {
        username: profileResponse.data.login,
        name: profileResponse.data.name,
        email: primaryEmail,
        avatar: profileResponse.data.avatar_url,
        profileUrl: profileResponse.data.html_url,
        company: profileResponse.data.company,
        location: profileResponse.data.location,
        bio: profileResponse.data.bio
      },
      lastLogin: new Date()
    };

    const user = await User.findOneAndUpdate(
      { githubId: userData.githubId },
      { $set: userData },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).select('-githubAccessToken -githubRefreshToken');

    // 5. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        sessionId: req.sessionID,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    // 6. Set secure cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800000, // 7 days
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/'
    });

    // 7. Redirect with success
    res.redirect(process.env.FRONTEND_AUTH_SUCCESS_URL);
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.redirect(`${process.env.FRONTEND_LOGIN_URL}?error=auth_failed`);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('authToken', {
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  });
  req.session.destroy();
  res.json({ success: true });
};