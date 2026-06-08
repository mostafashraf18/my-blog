const express = require('express');
const router = express.Router();

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['Node.js', 'AWS', 'PostgreSQL'],
    github: 'https://github.com/yourusername/project-one',
    live: 'https://project-one.com',
    featured: true
  },
  {
    title: 'Project Two',
    description: 'Another project showcasing your skills in a different domain.',
    tags: ['React', 'TypeScript', 'REST API'],
    github: 'https://github.com/yourusername/project-two',
    live: null,
    featured: true
  },
  {
    title: 'Project Three',
    description: 'A CLI tool or utility that automates a common development task.',
    tags: ['Python', 'CLI', 'Automation'],
    github: 'https://github.com/yourusername/project-three',
    live: null,
    featured: false
  }
];

router.get('/', (req, res) => {
  res.render('projects', { title: 'Projects', projects, active: 'projects' });
});

module.exports = router;
