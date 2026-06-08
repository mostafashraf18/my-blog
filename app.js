require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Static files
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', require('./src/routes/home'));
app.use('/about', require('./src/routes/about'));
app.use('/projects', require('./src/routes/projects'));
app.use('/blog', require('./src/routes/blog'));
app.use('/resume', require('./src/routes/resume'));
app.use('/contact', require('./src/routes/contact'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404 — Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
