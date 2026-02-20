# Portfolio CMS - Full-Stack Portfolio Website with Backend

A beautiful, modern portfolio website with a built-in Content Management System (CMS) that allows you to easily update your profile, skills, and projects through an admin panel.

## Features

### Public Website
- **Multi-page design** with smooth navigation
- **Responsive design** that works on all devices
- **Modern animations** and smooth transitions
- **Clean, professional aesthetics** with customizable colors
- Pages:
  - Home (Hero + About + Skills + Projects preview)
  - About (Full bio + Skills)
  - Projects (All projects with detail Pages)
  - Contact (Contact form + Social links)

### Admin Panel
- **Secure login** with session management
- **Edit Profile** - Update name, title, bio, and social links
- **Manage Skills** - Edit skill categories and items
- **Manage Projects** - Add, edit, and delete projects
- **Live preview** - View your site while editing

## Tech Stack

- **Backend**: Node.js + Express
- **Templating**: EJS
- **Data Storage**: JSON file (simple and portable)
- **Authentication**: bcryptjs + express-session
- **Styling**: Custom CSS

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Steps

1. **Extract the portfolio-cms folder** to your desired location

2. **Install dependencies**:
   ```bash
   cd portfolio-cms
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access your portfolio**:
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

5. **Login to admin** (default credentials):
   - Username: `admin`
   - Password: `password123`

## Configuration

### Change Admin Password

1. Generate a new password hash:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-new-password', 10))"
   ```

2. Open `data.json` and replace the password hash in the admin section

### Edit Environment Variables

Edit the `.env` file to change:
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Session encryption key (change in production!)

## File Structure

```
portfolio-cms/
├── public/              # Static assets
│   ├── css/
│   │   ├── style.css    # Main site styles
│   │   └── admin.css    # Admin panel styles
│   ├── js/              # JavaScript files
│   └── images/          # Image uploads
├── views/               # EJS templates
│   ├── Pages/           # Main site Pages
│   ├── admin/           # Admin panel Pages
│   └── partials/        # Reusable components
├── routes/
│   ├── main.js          # Public routes
│   └── admin.js         # Admin routes
├── data.json            # Content database
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Usage Guide

### Updating Your Portfolio

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin
   - Enter your credentials

2. **Edit Profile**
   - Click "Edit Profile" in the sidebar
   - Update your name, title, bio, and social links
   - Click "Save Changes"

3. **Manage Skills**
   - Click "Edit Skills"
   - Update your skill categories and items
   - Separate multiple skills with commas
   - Click "Save Changes"

4. **Manage Projects**
   - Click "Manage Projects"
   - Add new projects or edit existing ones
   - Include project title, type, description, and technologies
   - Optionally add project links and images
   - Click "Save Project"

### Adding Project Images

You can add images in two ways:

1. **Use external URLs** (recommended for now):
   - Upload images to a service like Imgur, Cloudinary, or your own hosting
   - Paste the image URL in the "Image URL" field

2. **Add to public/images** (for local hosting):
   - Save images in `public/images/`
   - Use the path `/images/your-image.jpg` in the Image URL field

## Customization

### Change Color Scheme

Edit `public/css/style.css` and modify the CSS variables at the top:

```css
:root {
    --bg-primary: #fafaf8;
    --bg-secondary: #ffffff;
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --accent: #2c5f4f;        /* Change this for main color */
    --accent-light: #4a8a73;  /* Change this for hover color */
    --border: #e0e0dc;
    --shadow: rgba(0, 0, 0, 0.08);
}
```

### Add Custom Pages

1. Create a new EJS file in `views/Pages/`
2. Add a route in `routes/main.js`
3. Add a navigation link in `views/partials/header.ejs`

## Deployment

### Deploy to Heroku

1. Create a Heroku account and install the CLI
2. In your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku create your-portfolio-name
   git push heroku main
   ```

### Deploy to Vercel/Netlify

For static deployment, you'll need to export your site or use a compatible hosting platform that supports Node.js.

### Deploy to VPS (DigitalOcean, AWS, etc.)

1. SSH into your server
2. Install Node.js
3. Clone or upload your project
4. Install dependencies: `npm install`
5. Use PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   ```

## Backup

Your content is stored in `data.json`. Make regular backups of this file to preserve your portfolio content.

```bash
cp data.json data-backup-$(date +%Y%m%d).json
```

## Troubleshooting

**Port already in use:**
- Change the PORT in `.env` to a different number (e.g., 3001)

**Can't login to admin:**
- Check that you're using the correct credentials
- Default is username: `admin`, password: `password123`

**Changes not appearing:**
- Make sure you clicked "Save Changes"
- Refresh your browser (Ctrl+F5 or Cmd+Shift+R)

**npm install fails:**
- Make sure you have Node.js installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

## Support

For issues or questions:
- Check the code comments in the files
- Review the data structure in `data.json`
- Ensure all dependencies are installed with `npm install`

## License

MIT License

---

Made with ❤️ by Abbey Kelley