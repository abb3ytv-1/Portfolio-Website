const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Helper functions
function getData() {
    const dataPath = path.join(__dirname, '../data.json');
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
}

function saveData(data) {
    const dataPath = path.join(__dirname, '../data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
}

// Login page
router.get('/login', (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('admin/login', {
        title: 'Admin Login',
        error: null
    });
});

// Login handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const data = getData();
    
    if (username === data.admin.username) {
        const match = await bcrypt.compare(password, data.admin.password);
        if (match) {
            req.session.isAdmin = true;
            return res.redirect('/admin');
        }
    }
    
    res.render('admin/login', {
        title: 'Admin Login',
        error: 'Invalid credentials'
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin dashboard
router.get('/', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        profile: data.profile,
        projects: data.projects,
        skills: data.skills
    });
});

// Edit profile
router.get('/profile', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/edit-profile', {
        title: 'Edit Profile',
        profile: data.profile,
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
        bio: [bio1, bio2, bio3]
    };
    
    saveData(data);
    res.redirect('/admin/profile?success=1');
});

// Edit skills
router.get('/skills', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/edit-skills', {
        title: 'Edit Skills',
        skills: data.skills,
        success: req.query.success
    });
});

router.post('/skills', isAuthenticated, (req, res) => {
    const data = getData();
    
    // Process skills data
    const skills = [];
    for (let i = 1; i <= 4; i++) {
        const category = req.body[`category${i}`];
        const items = req.body[`items${i}`].split(',').map(item => item.trim());
        skills.push({ id: i, category, items });
    }
    
    data.skills = skills;
    saveData(data);
    res.redirect('/admin/skills?success=1');
});

// Projects list
router.get('/projects', isAuthenticated, (req, res) => {
    const data = getData();
    res.render('admin/projects-list', {
        title: 'Manage Projects',
        projects: data.projects
    });
});

// Add project
router.get('/projects/add', isAuthenticated, (req, res) => {
    res.render('admin/edit-project', {
        title: 'Add Project',
        project: null,
        success: false
    });
});

// Edit project
router.get('/projects/edit/:id', isAuthenticated, (req, res) => {
    const data = getData();
    const project = data.projects.find(p => p.id == req.params.id);
    
    if (!project) {
        return res.redirect('/admin/projects');
    }
    
    res.render('admin/edit-project', {
        title: 'Edit Project',
        project: project,
        success: req.query.success
    });
});

// Save project
router.post('/projects/save', isAuthenticated, (req, res) => {
    const data = getData();
    const { id, type, title, description, technologies, link, image } = req.body;
    
    const techArray = technologies.split(',').map(t => t.trim());
    
    if (id) {
        // Update existing project
        const index = data.projects.findIndex(p => p.id == id);
        if (index !== -1) {
            data.projects[index] = {
                id: parseInt(id),
                type,
                title,
                description,
                technologies: techArray,
                link: link || '',
                image: image || ''
            };
        }
    } else {
        // Add new project
        const newId = Math.max(...data.projects.map(p => p.id)) + 1;
        data.projects.push({
            id: newId,
            type,
            title,
            description,
            technologies: techArray,
            link: link || '',
            image: image || ''
        });
    }
    
    saveData(data);
    res.redirect(id ? `/admin/projects/edit/${id}?success=1` : '/admin/projects');
});

// Delete project
router.post('/projects/delete/:id', isAuthenticated, (req, res) => {
    const data = getData();
    data.projects = data.projects.filter(p => p.id != req.params.id);
    saveData(data);
    res.redirect('/admin/projects');
});

module.exports = router;