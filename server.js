const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
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
  gallery: [String],
  instagram: String,
  facebook: String,
  linkedin: String,
  youtube: String
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

app.get('/netairy-secret-admin-999/login', (req, res) => {
  res.render('admin-login', { error: null });
});

app.post('/netairy-secret-admin-999/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Ryan' && password === '2026RyanTime') {
    req.session.isAdmin = true;
    return res.redirect('/netairy-secret-admin-999');
  }
  res.render('admin-login', { error: 'Invalid username or password' });
});

app.get('/netairy-secret-admin-999/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/netairy-secret-admin-999/login');
  });
});

app.get('/netairy-secret-admin-999', requireAuth, async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.render('admin-dashboard', { profiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

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

app.post('/netairy-secret-admin-999/save', requireAuth, async (req, res) => {
  try {
    const { 
      originalSlug, slug, name, title, company, phone, whatsapp, 
      email, website, address, bio, avatar, banner, 
      product1, product2, product3, 
      instagram, facebook, linkedin, youtube 
    } = req.body;
    
    const gallery = [product1, product2, product3].filter(img => img && img.trim() !== "");

    const updateData = {
      slug, name, title, company, phone, whatsapp, email, 
      website, address, bio, avatar, banner, gallery, 
      instagram, facebook, linkedin, youtube
    };

    if (originalSlug && originalSlug !== slug) {
      await Profile.findOneAndUpdate({ slug: originalSlug }, updateData, { upsert: true, new: true });
    } else {
      await Profile.findOneAndUpdate({ slug }, updateData, { upsert: true, new: true });
    }

    res.redirect('/netairy-secret-admin-999');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving profile: " + err.message);
  }
});

app.get('/netairy-secret-admin-999/delete/:slug', requireAuth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ slug: req.params.slug });
    res.redirect('/netairy-secret-admin-999');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting profile");
  }
});

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

app.listen(PORT, () => {
  console.log(`🚀 NetAiry NFC Server is running on port ${PORT}`);
});
