const express = require('express');
const router = express.Router();
const { getRecentPosts } = require('../utils/posts');

router.get('/', async (req, res) => {
  const recentPosts = await getRecentPosts(3);
  res.render('home', {
    title: 'Home',
    recentPosts,
    active: 'home'
  });
});

module.exports = router;
