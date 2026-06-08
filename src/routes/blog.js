const express = require('express');
const router = express.Router();
const { getAllPosts, getPostBySlug } = require('../utils/posts');

router.get('/', async (req, res) => {
  const posts = await getAllPosts();
  res.render('blog/index', { title: 'Blog', posts, active: 'blog' });
});

router.get('/:slug', async (req, res) => {
  const post = await getPostBySlug(req.params.slug);
  if (!post) return res.status(404).render('404', { title: '404 — Post Not Found' });
  res.render('blog/post', { title: post.meta.title, post, active: 'blog' });
});

module.exports = router;
