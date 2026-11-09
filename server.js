const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. SQLite Database Setup
const db = new sqlite3.Database('./nfc_business.db', (err) => {
  if (err) {
    console.error('Database opening error: ' + err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create Clients Table
db.run(`CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  name TEXT,
  title TEXT,
  business TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  bio TEXT,
  avatar TEXT,
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  youtube TEXT,
  amazon TEXT,
  meesho TEXT,
  google TEXT,
  photo1 TEXT,
  photo2 TEXT,
  photo3 TEXT,
  photo4 TEXT
)`);

// 🔐 Admin Password Protection Middleware
const authMiddleware = (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  // YAHAN APNA USERNAME AUR PASSWORD SET KAREIN
  const ADMIN_USER = 'Ryan';       // Aap apna username badal sakte hain
  const ADMIN_PASS = '2026RyanTime';  // Aap apna strong password yahan set karein

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return next(); // Password sahi hai, aage badho
  }

  res.set('WWW-Authenticate', 'Basic realm="NetAiry Admin Protected Area"');
  res.status(401).send('Authentication required. (Galat password ya cancel kiya gaya)');
};

// 2. Protected Secret Admin Panel Route (Password Required)
app.get('/netairy-secret-admin-999', authMiddleware, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Secret Admin Panel - NetAiry Tech</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 p-6 flex justify-center">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl my-6">
            <h1 class="text-2xl font-bold text-amber-400 mb-2 text-center">NetAiry Admin Panel</h1>
            <p class="text-xs text-slate-400 text-center mb-6">🔒 Secure Mode Active: Authorized Access Only</p>
            <form action="/netairy-secret-admin-999/add" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-1">Unique Slug (e.g. netairy)</label>
                    <input type="text" name="slug" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400" placeholder="chote aksharo me">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Full Name</label>
                        <input type="text" name="name" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Job Title</label>
                        <input type="text" name="title" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                    </div>
                </div>
                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-1">Business Name</label>
                    <input type="text" name="business" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Phone Number</label>
                        <input type="text" name="phone" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">WhatsApp Number</label>
                        <input type="text" name="whatsapp" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                    </div>
                </div>
                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-1">Email</label>
                    <input type="email" name="email" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                </div>
                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-1">Website URL (with https://)</label>
                    <input type="text" name="website" placeholder="https://example.com" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400">
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Google Business URL</label>
                        <input type="text" name="google" placeholder="https://g.page/..." class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Instagram URL</label>
                        <input type="text" name="instagram" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Facebook URL</label>
                        <input type="text" name="facebook" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">LinkedIn URL</label>
                        <input type="text" name="linkedin" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">YouTube URL</label>
                        <input type="text" name="youtube" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Amazon Store URL</label>
                        <input type="text" name="amazon" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                    <div>
                        <label class="block text-xs uppercase text-slate-400 mb-1">Meesho Store URL</label>
                        <input type="text" name="meesho" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400 text-xs">
                    </div>
                </div>

                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-1">Avatar Image URL</label>
                    <input type="text" name="avatar" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400" placeholder="https://images.unsplash.com/...">
                </div>

                <!-- Product Gallery Photos (Optional) -->
                <div class="border-t border-slate-800 pt-4 mt-4">
                    <label class="block text-xs uppercase text-amber-400 font-bold mb-2">Product Gallery Photos (Optional)</label>
                    <div class="space-y-2">
                        <input type="text" name="photo1" placeholder="Photo 1 Image URL" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-xs">
                        <input type="text" name="photo2" placeholder="Photo 2 Image URL" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-xs">
                        <input type="text" name="photo3" placeholder="Photo 3 Image URL" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-xs">
                        <input type="text" name="photo4" placeholder="Photo 4 Image URL" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-xs">
                    </div>
                </div>

                <div>
                    <label class="block text-xs uppercase text-slate-400 mb-1 mt-3">Bio / Description</label>
                    <textarea name="bio" rows="3" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400"></textarea>
                </div>
                <button type="submit" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg transition shadow-lg mt-4">Save & Create Profile</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

// Handle Admin Form Submission (Protected with Auth too)
app.post('/netairy-secret-admin-999/add', authMiddleware, (req, res) => {
  let { slug, name, title, business, phone, whatsapp, email, website, bio, avatar, instagram, facebook, linkedin, youtube, amazon, meesho, google, photo1, photo2, photo3, photo4 } = req.body;
  slug = slug.trim().toLowerCase();

  const query = `INSERT INTO clients (slug, name, title, business, phone, whatsapp, email, website, bio, avatar, instagram, facebook, linkedin, youtube, amazon, meesho, google, photo1, photo2, photo3, photo4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [slug, name, title, business, phone, whatsapp, email, website, bio, avatar, instagram, facebook, linkedin, youtube, amazon, meesho, google, photo1, photo2, photo3, photo4], (err) => {
    if (err) {
      return res.status(400).send('<body style="background:#030712; color:white; font-family:sans-serif; text-align:center; padding-top:50px;"><h1>Error: Slug already exists!</h1><br><a href="/netairy-secret-admin-999" style="color:#fbbf24;">Go Back</a></body>');
    }
    res.send(`<body style="background:#030712; color:white; font-family:sans-serif; text-align:center; padding-top:50px;"><h1 style="color:#22c55e;">Client Added Successfully!</h1><p>Profile Link to encode in NFC card: <a href="/${slug}" target="_blank" style="color:#fbbf24; font-size:1.2rem;">http://localhost:3000/${slug}</a></p><br><a href="/netairy-secret-admin-999" style="color:#fbbf24;">Add Another Client</a></body>`);
  });
});

// 3. Dynamic Profile Route (Publicly accessible for customers)
app.get('/:slug', (req, res) => {
  const slug = req.params.slug.trim().toLowerCase();
  
  db.get(`SELECT * FROM clients WHERE LOWER(slug) = ?`, [slug], (err, client) => {
    if (err || !client) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Not Found</title></head>
        <body style="background:#030712; color:#fff; font-family:sans-serif; text-align:center; padding-top:20vh;">
            <h1 style="color:#f87171; font-size:2rem;">404 - Profile Not Found</h1>
            <p style="color:#94a3b8; margin-top:10px;">The profile slug "<strong>${req.params.slug}</strong>" does not exist in the database.</p>
        </body>
        </html>
      `);
    }

    const photos = [client.photo1, client.photo2, client.photo3, client.photo4].filter(p => p && p.trim() !== '');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${client.name} - ${client.business}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <style>
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.05); }
            }
            .blob-1 { animation: float 8s ease-in-out infinite; }
            .blob-2 { animation: float 10s ease-in-out infinite reverse; }
          </style>
      </head>
      <body class="bg-slate-950 text-slate-100 flex justify-center items-center min-h-screen p-4 relative overflow-x-hidden">
          
          <div class="absolute top-10 left-1/4 w-72 h-72 bg-amber-600/20 rounded-full blur-[100px] pointer-events-none blob-1"></div>
          <div class="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none blob-2"></div>

          <div class="w-full max-w-md bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden p-7 text-center relative z-10">
              
              <div class="flex flex-col items-center relative">
                  <div class="relative mb-4 group">
                      <div class="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur opacity-75"></div>
                      <img src="${client.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}" alt="${client.name}" class="relative w-28 h-28 rounded-full object-cover border-4 border-slate-900 shadow-2xl">
                      <span class="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs shadow-md"><i class="fa-solid fa-check font-bold"></i></span>
                  </div>
                  <h1 class="text-2xl font-extrabold text-white tracking-wide mt-1">${client.name}</h1>
                  <p class="text-amber-400 font-semibold text-sm mt-0.5 tracking-wide">${client.title || ''}</p>
                  <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">${client.business || ''}</p>
                  <p class="text-slate-300 text-xs mt-3 px-3 leading-relaxed font-normal">${client.bio || ''}</p>
              </div>

              <div class="mt-6 grid grid-cols-2 gap-3">
                  ${client.phone ? `<a href="tel:${client.phone}" class="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 text-sm shadow-lg border border-emerald-500/20"><i class="fa-solid fa-phone"></i> Call Now</a>` : ''}
                  ${client.whatsapp ? `<a href="https://wa.me/${client.whatsapp}" target="_blank" class="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 text-sm shadow-lg border border-green-500/20"><i class="fa-brands fa-whatsapp text-lg"></i> WhatsApp</a>` : ''}
              </div>

              <div class="mt-3">
                  <a href="/${slug}/vcard" class="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-4 px-4 rounded-2xl font-black transition-all duration-300 text-sm shadow-xl shadow-amber-500/20 w-full tracking-wide">
                      <i class="fa-solid fa-user-plus text-base"></i> Save Contact to Phone
                  </a>
              </div>

              ${photos.length > 0 ? `
              <div class="mt-6 border-t border-slate-800/80 pt-5">
                  <p class="text-[10px] text-amber-400 uppercase tracking-[0.2em] mb-3 font-extrabold flex items-center justify-center gap-1.5"><i class="fa-solid fa-gem"></i> Featured Showcase & Products</p>
                  <div class="grid grid-cols-2 gap-3">
                      ${photos.map((photo, index) => `
                          <div class="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg transition-all duration-300 hover:scale-[1.02]">
                              <img src="${photo}" alt="Product ${index + 1}" onclick="openLightbox('${photo}')" class="w-full h-32 object-cover cursor-pointer transition duration-500 group-hover:scale-110">
                              <div class="p-2 bg-slate-900/90 text-center">
                                  <a href="https://wa.me/${client.whatsapp}?text=Hi,%20I%20am%20interested%20in%20this%20product%20from%20your%20digital%20card." target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition">
                                      <i class="fa-brands fa-whatsapp"></i> Enquire Now
                                  </a>
                              </div>
                          </div>
                      `).join('')}
                  </div>
              </div>
              ` : ''}

              <div class="mt-6 border-t border-slate-800/80 pt-5">
                  <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 font-bold">Connect & Explore</p>
                  <div class="flex justify-center items-center gap-3 flex-wrap">
                      ${client.website ? `<a href="${client.website}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-amber-500 hover:text-slate-950 rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Website"><i class="fa-solid fa-globe"></i></a>` : ''}
                      ${client.google ? `<a href="${client.google}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-blue-500 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Google Business / Reviews"><i class="fa-brands fa-google"></i></a>` : ''}
                      ${client.instagram ? `<a href="${client.instagram}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-pink-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Instagram"><i class="fa-brands fa-instagram"></i></a>` : ''}
                      ${client.facebook ? `<a href="${client.facebook}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-blue-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>` : ''}
                      ${client.linkedin ? `<a href="${client.linkedin}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-sky-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
                      ${client.youtube ? `<a href="${client.youtube}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-red-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="YouTube"><i class="fa-brands fa-youtube"></i></a>` : ''}
                      ${client.amazon ? `<a href="${client.amazon}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-amber-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Amazon Store"><i class="fa-brands fa-amazon"></i></a>` : ''}
                      ${client.meesho ? `<a href="${client.meesho}" target="_blank" class="w-12 h-12 bg-slate-800/70 hover:bg-pink-500 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Meesho Store"><i class="fa-solid fa-store"></i></a>` : ''}
                      ${client.email ? `<a href="mailto:${client.email}" class="w-12 h-12 bg-slate-800/70 hover:bg-rose-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-200 text-lg transition-all duration-300 shadow-md border border-slate-700/50 hover:scale-110" title="Email"><i class="fa-solid fa-envelope"></i></a>` : ''}
                  </div>
              </div>

              <div class="mt-8 text-xs text-slate-500 border-t border-slate-800/60 pt-4 flex items-center justify-center gap-1.5">
                  <span>Powered by</span> <span class="text-amber-400 font-bold tracking-wide">NetAiry Tech</span>
              </div>
          </div>

          <div id="lightbox" onclick="closeLightbox()" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 hidden flex items-center justify-center p-4 cursor-pointer">
              <div class="relative max-w-lg w-full">
                  <img id="lightbox-img" src="" class="w-full h-auto max-h-[80vh] rounded-3xl object-contain border-2 border-slate-700 shadow-2xl">
                  <p class="text-center text-slate-400 text-xs mt-4">Click anywhere to close</p>
              </div>
          </div>

          <script>
            function openLightbox(src) {
              document.getElementById('lightbox-img').src = src;
              document.getElementById('lightbox').classList.remove('hidden');
            }
            function closeLightbox() {
              document.getElementById('lightbox').classList.add('hidden');
            }
          </script>
      </body>
      </html>
    `);
  });
});

// 4. vCard Generator Route
app.get('/:slug/vcard', (req, res) => {
  const slug = req.params.slug.trim().toLowerCase();
  
  db.get(`SELECT * FROM clients WHERE LOWER(slug) = ?`, [slug], (err, client) => {
    if (err || !client) {
      return res.status(404).send('Not found');
    }

    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:${client.name}
TITLE:${client.title}
ORG:${client.business}
TEL;TYPE=WORK,VOICE:${client.phone}
EMAIL:${client.email}
URL:${client.website}
NOTE:${client.bio}
END:VCARD`;

    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${client.name.replace(/\s+/g, '_')}.vcf"`);
    res.send(vcardData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Secret Admin Panel: http://localhost:${PORT}/netairy-secret-admin-999`);
});