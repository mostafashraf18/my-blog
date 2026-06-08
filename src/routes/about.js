const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('about', { title: 'About', active: 'about' });
});

module.exports = router;
