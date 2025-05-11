// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const resumeRoutes = require('./routes/resume.routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/resumes', resumeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
