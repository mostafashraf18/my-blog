const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume', active: 'resume' });
});

router.get('/download', (req, res) => {
  const file = path.join(__dirname, '../public/assets/resume.pdf');
  res.download(file, 'resume.pdf', (err) => {
    if (err) res.status(404).send('Resume file not found. Please upload your PDF to src/public/assets/resume.pdf');
  });
});

module.exports = router;
