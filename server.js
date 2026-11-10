const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// SQLite Database Connection
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create Profiles Table if not exists
db.run(`CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  name TEXT,
  title TEXT,
  company TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  bio TEXT,
  avatar TEXT,
  banner TEXT,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  twitter TEXT,
  youtube TEXT,
  github TEXT
)`);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'netairy-nfc-secure-secret-key-999',
  resave: false,
  saveUninitialized: false
}));

// Admin Authentication Middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/netairy-secret-admin-999/login');
};

// --- ROUTES ---

// Admin Login Page (GET)
app.get('/netairy-secret-admin-999/login', (req, res) => {
  res.render('admin-login', { error: null });
});

// Admin Login Action (POST)
app.post('/netairy-secret-admin-999/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Ryan' && password === '2026RyanTime') {
    req.session.isAdmin = true;
    return res.redirect('/netairy-secret-admin-999');
  }
  res.render('admin-login', { error: 'Invalid username or password' });
});

// Admin Logout
app.get('/netairy-secret-admin-999/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/netairy-secret-admin-999/login');
  });
});

// Admin Dashboard - View All Profiles
app.get('/netairy-secret-admin-999', requireAuth, (req, res) => {
  db.all(`SELECT * FROM profiles ORDER BY id DESC`, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    res.render('admin-dashboard', { profiles: rows });
  });
});

// Add / Edit Profile Form Route
app.get('/netairy-secret-admin-999/edit/:slug?', requireAuth, (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return res.render('admin-edit', { profile: null });
  }
  db.get(`SELECT * FROM profiles WHERE slug = ?`, [slug], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    res.render('admin-edit', { profile: row });
  });
});

// Save or Update Profile (POST)
app.post('/netairy-secret-admin-999/save', requireAuth, (req, res) => {
  const { originalSlug, slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github } = req.body;

  if (originalSlug) {
    // Update existing
    const query = `UPDATE profiles SET slug=?, name=?, title=?, company=?, phone=?, whatsapp=?, email=?, website=?, address=?, bio=?, avatar=?, banner=?, facebook=?, instagram=?, linkedin=?, twitter=?, youtube=?, github=? WHERE slug=?`;
    db.run(query, [slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github, originalSlug], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating profile");
      }
      res.redirect('/netairy-secret-admin-999');
    });
  } else {
    // Insert new
    const query = `INSERT INTO profiles (slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving profile (Slug might already exist)");
      }
      res.redirect('/netairy-secret-admin-999');
    });
  }
});

// Delete Profile Route
app.get('/netairy-secret-admin-999/delete/:slug', requireAuth, (req, res) => {
  db.run(`DELETE FROM profiles WHERE slug = ?`, [req.params.slug], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting profile");
    }
    res.redirect('/netairy-secret-admin-999');
  });
});

// Public Client Profile Page
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  db.get(`SELECT * FROM profiles WHERE slug = ?`, [slug], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
    if (!row) {
      return res.status(404).send("Profile not found!");
    }
    res.render('profile', { profile: row });
  });
});

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
