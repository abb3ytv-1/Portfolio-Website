const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper to read data.json
function getData() {
    const dataPath = path.join(__dirname, '../data.json');
    return JSON.parse(fs.readFileSync(dataPath));
}

// Home page
router.get('/', (req, res) => {
    const data = getData();
    res.render('pages/home', {
        title: `${data.profile.name} - Portfolio`,
        profile: data.profile,
        skills: data.skills,
        projects: data.projects
    });
});

// About page
router.get('/about', (req, res) => {
    const data = getData();
    res.render('pages/about', {
        title: `About - ${data.profile.name}`,
        profile: data.profile,
        skills: data.skills
    });
});

// Projects page
router.get('/projects', (req, res) => {
    const data = getData();
    res.render('pages/projects', {
        title: `Projects - ${data.profile.name}`,
        profile: data.profile,
        projects: data.projects
    });
});

// Project detail
router.get('/projects/:id', (req, res) => {
    const data = getData();
    const project = data.projects.find(p => p.id == req.params.id);
    if (!project) return res.redirect('/projects');

    res.render('pages/project-detail', {
        title: `${project.title} - ${data.profile.name}`,
        profile: data.profile,
        project
    });
});

// Contact page
router.get('/contact', (req, res) => {
    const data = getData();
    res.render('pages/contact', {
        title: `Contact - ${data.profile.name}`,
        profile: data.profile
    });
});

// Contact form submission
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Contact submission:', { name, email, message });

    const data = getData();
    res.render('pages/contact', {
        title: `Contact - ${data.profile.name}`,
        profile: data.profile,
        success: 'Thank you! I will get back to you soon.'
    });
});

module.exports = router;