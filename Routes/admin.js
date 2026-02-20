const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Helper functions
function getData() {
    const dataPath = path.join(__dirname, '../data.json');
    if (!fs.existsSync(dataPath)) {
        return { admin: {}, profile: {}, skills: [], projects: [] };
    }
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
}

function saveData(data) {
    const dataPath = path.join(__dirname, '../data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) return next();
    res.redirect('/admin/login');
}

// ----------------------
// LOGIN / LOGOUT ROUTES
// ----------------------
router.get('/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin');
    res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const data = getData();

    if (data.admin && username === data.admin.username) {
        const match = await bcrypt.compare(password, data.admin.password);
        if (match) {
            req.session.isAdmin = true;
            return res.redirect('/admin');
        }
    }

    res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials' });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
});

// ----------------------
// DASHBOARD
// ----------------------
router.get('/', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        profile: data.profile || {},
        projects: data.projects || [],
        skills: data.skills || []
    });
});

// ----------------------
// PROFILE ROUTES
// ----------------------
router.get('/profile', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/edit-profile', {
        title: 'Edit Profile',
        profile: data.profile || {},
        success: req.query.success
    });
});

router.post('/profile', isAuthenticated, (req, res) => {
    const data = getData();
    const { name, title, subtitle, email, github, linkedin, instagram, youtube, bio1, bio2, bio3 } = req.body;

    data.profile = {
        ...data.profile,
        name,
        title,
        subtitle,
        email,
        github,
        linkedin,
        instagram,
        youtube,
        bio: [bio1 || '', bio2 || '', bio3 || '']
    };

    saveData(data);
    res.redirect('/admin/profile?success=1');
});

// ----------------------
// SKILLS ROUTES
// ----------------------
router.get('/skills', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/edit-skills', {
        title: 'Edit Skills',
        skills: data.skills || [],
        success: req.query.success
    });
});

router.post('/skills', isAuthenticated, (req, res) => {
    const data = getData();
    const skills = [];

    for (let i = 1; i <= 4; i++) {
        const category = req.body[`category${i}`] || '';
        const items = req.body[`items${i}`] ? req.body[`items${i}`].split(',').map(item => item.trim()).filter(Boolean) : [];
        skills.push({ id: i, category, items });
    }

    data.skills = skills;
    saveData(data);
    res.redirect('/admin/skills?success=1');
});

// ----------------------
// PROJECTS ROUTES
// ----------------------
router.get('/projects', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/projects-list', {
        title: 'Manage Projects',
        projects: data.projects || []
    });
});

router.get('/projects/add', isAuthenticated, (req, res) => {
    res.render('admin/edit-project', {
        title: 'Add Project',
        project: null,
        success: false
    });
});

router.get('/projects/edit/:id', isAuthenticated, (req, res) => {
    const data = getData();
    const projectId = parseInt(req.params.id);
    const project = data.projects.find(p => p.id === projectId);

    if (!project) return res.redirect('/admin/projects');

    res.render('admin/edit-project', {
        title: 'Edit Project',
        project,
        success: req.query.success
    });
});

router.post('/projects/save', isAuthenticated, (req, res) => {
    const data = getData();
    const { id, type, title, description, technologies, link, image } = req.body;
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (id) {
        // Update existing
        const projectId = parseInt(id);
        const index = data.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            data.projects[index] = { id: projectId, type, title, description, technologies: techArray, link: link || '', image: image || '' };
        }
        saveData(data);
        return res.redirect(`/admin/projects/edit/${projectId}?success=1`);
    } else {
        // Add new
        const newId = data.projects.length > 0 ? Math.max(...data.projects.map(p => p.id)) + 1 : 1;
        data.projects.push({ id: newId, type, title, description, technologies: techArray, link: link || '', image: image || '' });
        saveData(data);
        return res.redirect('/admin/projects');
    }
});

router.post('/projects/delete/:id', isAuthenticated, (req, res) => {
    const data = getData();
    const projectId = parseInt(req.params.id);
    data.projects = (data.projects || []).filter(p => p.id !== projectId);
    saveData(data);
    res.redirect('/admin/projects');
});

module.exports = router;