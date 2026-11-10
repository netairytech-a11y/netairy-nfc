const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection (Render Environment variable se uthayega)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://netairytech_db_user:JhK62hQrDHRjSqvu@cluster0.3n35kvz.mongodb.net/netairy_nfc?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema & Model for Profiles
const profileSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: String,
  company: String,
  phone: String,
  whatsapp: String,
  email: String,
  website: String,
  address: String,
  bio: String,
  avatar: String,
  banner: String,
  facebook: String,
  instagram: String,
  linkedin: String,
  twitter: String,
  youtube: String,
  github: String
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'netairy-nfc-secure-secret-key-999',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
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
app.get('/netairy-secret-admin-999', requireAuth, async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.render('admin-dashboard', { profiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Add / Edit Profile Form Route
app.get('/netairy-secret-admin-999/edit/:slug?', requireAuth, async (req, res) => {
  try {
    const slug = req.params.slug;
    let profile = null;
    if (slug) {
      profile = await Profile.findOne({ slug });
    }
    res.render('admin-edit', { profile });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Save or Update Profile (POST)
app.post('/netairy-secret-admin-999/save', requireAuth, async (req, res) => {
  try {
    const { originalSlug, slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github } = req.body;
    
    if (originalSlug && originalSlug !== slug) {
      await Profile.findOneAndUpdate(
        { slug: originalSlug },
        { slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github },
        { upsert: true, new: true }
      );
    } else {
      await Profile.findOneAndUpdate(
        { slug },
        { slug, name, title, company, phone, whatsapp, email, website, address, bio, avatar, banner, facebook, instagram, linkedin, twitter, youtube, github },
        { upsert: true, new: true }
      );
    }

    res.redirect('/netairy-secret-admin-999');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving profile: " + err.message);
  }
});

// Delete Profile Route
app.get('/netairy-secret-admin-999/delete/:slug', requireAuth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ slug: req.params.slug });
    res.redirect('/netairy-secret-admin-999');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting profile");
  }
});

// Public Client Profile Page
app.get('/:slug', async (req, res) => {
  try {
    const profile = await Profile.findOne({ slug: req.params.slug });
    if (!profile) {
      return res.status(404).send("Profile not found!");
    }
    res.render('profile', { profile });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Server Listener
app.listen(PORT, () => {
  console.log(`🚀 NetAiry NFC Server is running on port ${PORT}`);
});
