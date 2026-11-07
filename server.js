const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILES = {
  submissions: path.join(DATA_DIR, 'submissions.json'),
  queries: path.join(DATA_DIR, 'queries.json'),
  appointments: path.join(DATA_DIR, 'appointments.json'),
  chatLeads: path.join(DATA_DIR, 'chat_leads.json'),
  adminConfig: path.join(DATA_DIR, 'admin-config.json')
};

Object.entries(DB_FILES).forEach(([key, filePath]) => {
  if (!fs.existsSync(filePath)) {
    if (key === 'adminConfig') {
      fs.writeFileSync(filePath, JSON.stringify({ username: 'admin', password: 'admin123' }, null, 2));
    } else {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  }
});

function getAdminConfig() {
  try {
    if (fs.existsSync(DB_FILES.adminConfig)) {
      return JSON.parse(fs.readFileSync(DB_FILES.adminConfig, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading admin config:', e);
  }
  return { username: 'admin', password: 'admin123' };
}

// In-memory active session tokens
const activeSessions = new Map();

function createSession(username) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { username, expiresAt });
  return token;
}

function isValidSession(req) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  const session = activeSessions.get(token);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

function readDb(type) {
  try {
    const file = DB_FILES[type];
    if (!file || !fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${type} DB:`, err);
    return [];
  }
}

function writeDb(type, data) {
  try {
    const file = DB_FILES[type];
    if (!file) return false;
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${type} DB:`, err);
    return false;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 25 * 1024 * 1024) { // 25MB max
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token'
    });
    return res.end();
  }

  const [reqPath] = decodeURI(req.url).split('?');

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // Admin Login
  if (reqPath === '/api/admin/login' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const { username, password } = payload;
      const config = getAdminConfig();

      if (username === config.username && password === config.password) {
        const token = createSession(username);
        console.log(`[AUTH] Admin login successful for user: "${username}"`);
        return sendJson(res, 200, {
          success: true,
          token: token,
          username: username,
          message: 'Login successful'
        });
      } else {
        console.warn(`[AUTH] Failed login attempt with username: "${username}"`);
        return sendJson(res, 401, {
          success: false,
          error: 'Invalid username or password'
        });
      }
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Admin Logout
  if (reqPath === '/api/admin/logout' && req.method === 'POST') {
    const authHeader = req.headers['authorization'] || req.headers['x-admin-token'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token) activeSessions.delete(token);
    return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
  }

  // Change Admin Credentials
  if (reqPath === '/api/admin/change-credentials' && req.method === 'POST') {
    if (!isValidSession(req)) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: Please log in first' });
    }
    try {
      const payload = await parseBody(req);
      const { currentPassword, newUsername, newPassword } = payload;
      const config = getAdminConfig();

      if (currentPassword !== config.password) {
        return sendJson(res, 400, { success: false, error: 'Current password is incorrect' });
      }

      const updated = {
        username: (newUsername || config.username).trim(),
        password: (newPassword || config.password).trim()
      };

      fs.writeFileSync(DB_FILES.adminConfig, JSON.stringify(updated, null, 2), 'utf8');
      console.log(`[AUTH] Admin credentials updated for user: "${updated.username}"`);
      return sendJson(res, 200, { success: true, message: 'Credentials updated successfully!', username: updated.username });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // PUBLIC CLIENT SUBMISSION ENDPOINTS (No login required)
  // ==========================================

  // 1. Manuscript Submission Endpoint
  if (reqPath === '/api/submissions' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const newEntry = {
        id: 'SUB-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(2).toString('hex').toUpperCase(),
        submittedAt: new Date().toISOString(),
        authorName: payload.authorName || payload.name || 'Anonymous Author',
        email: payload.email || '',
        phone: payload.phone || 'N/A',
        title: payload.title || payload.workingTitle || 'Untitled',
        genre: payload.genre || 'General',
        synopsis: payload.synopsis || '',
        fileName: payload.fileName || (payload.hasFile ? 'manuscript_uploaded.pdf' : 'No file attached'),
        status: 'Under Review'
      };

      const all = readDb('submissions');
      all.unshift(newEntry);
      writeDb('submissions', all);

      console.log(`\n[NEW SUBMISSION] From: ${newEntry.authorName} (${newEntry.email}) | Title: "${newEntry.title}"`);
      return sendJson(res, 201, {
        success: true,
        message: 'Manuscript submitted successfully to House of Memoir Editorial Board.',
        data: newEntry
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 2. General Query Endpoint
  if (reqPath === '/api/queries' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const newEntry = {
        id: 'QRY-' + Date.now().toString(36).toUpperCase(),
        submittedAt: new Date().toISOString(),
        fullName: payload.fullName || payload.name || 'Visitor',
        email: payload.email || '',
        phone: payload.phone || '',
        query: payload.query || payload.message || '',
        status: 'Unread'
      };

      const all = readDb('queries');
      all.unshift(newEntry);
      writeDb('queries', all);

      console.log(`\n[NEW QUERY] From: ${newEntry.fullName} (${newEntry.email}) | Query: "${newEntry.query.slice(0, 50)}..."`);
      return sendJson(res, 201, {
        success: true,
        message: 'Your query has been recorded. Our editorial desk will reach out shortly.',
        data: newEntry
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3. Consultation Appointment Booking Endpoint
  if (reqPath === '/api/appointments' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const newEntry = {
        id: 'APT-' + Date.now().toString(36).toUpperCase(),
        bookedAt: new Date().toISOString(),
        name: payload.name || 'Author',
        email: payload.email || '',
        phone: payload.phone || '',
        date: payload.date || 'To be scheduled',
        timeSlot: payload.timeSlot || '10:00 AM EST',
        consultationType: payload.consultationType || 'Virtual 1-on-1 Consultation',
        status: 'Confirmed'
      };

      const all = readDb('appointments');
      all.unshift(newEntry);
      writeDb('appointments', all);

      console.log(`\n[NEW APPOINTMENT] Booked by: ${newEntry.name} | Date: ${newEntry.date} at ${newEntry.timeSlot}`);
      return sendJson(res, 201, {
        success: true,
        message: 'Consultation appointment scheduled and confirmed.',
        data: newEntry
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 4. Chat Lead Endpoint
  if (reqPath === '/api/chat-lead' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const newEntry = {
        id: 'CHT-' + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        message: payload.message || '',
        contact: payload.contact || '',
        page: payload.page || 'Home'
      };

      const all = readDb('chatLeads');
      all.unshift(newEntry);
      writeDb('chatLeads', all);

      return sendJson(res, 201, { success: true, data: newEntry });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // PROTECTED ADMIN API ROUTES (Login required)
  // ==========================================

  // 5. Admin Stats Endpoint (Protected)
  if (reqPath === '/api/stats' && req.method === 'GET') {
    if (!isValidSession(req)) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: Admin login required' });
    }
    const submissions = readDb('submissions');
    const queries = readDb('queries');
    const appointments = readDb('appointments');
    const chatLeads = readDb('chatLeads');

    return sendJson(res, 200, {
      totalSubmissions: submissions.length,
      totalQueries: queries.length,
      totalAppointments: appointments.length,
      totalChatLeads: chatLeads.length
    });
  }

  // 6. Admin Data Retrieval Endpoints (Protected)
  if (reqPath === '/api/admin/submissions' && req.method === 'GET') {
    if (!isValidSession(req)) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    return sendJson(res, 200, readDb('submissions'));
  }

  if (reqPath === '/api/admin/queries' && req.method === 'GET') {
    if (!isValidSession(req)) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    return sendJson(res, 200, readDb('queries'));
  }

  if (reqPath === '/api/admin/appointments' && req.method === 'GET') {
    if (!isValidSession(req)) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    return sendJson(res, 200, readDb('appointments'));
  }

  if (reqPath === '/api/admin/chat-leads' && req.method === 'GET') {
    if (!isValidSession(req)) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    return sendJson(res, 200, readDb('chatLeads'));
  }

  // 7. Admin Delete Entry Endpoint (Protected)
  if (reqPath === '/api/admin/delete' && req.method === 'POST') {
    if (!isValidSession(req)) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    try {
      const payload = await parseBody(req);
      const { type, id } = payload;
      if (!DB_FILES[type] || !id) {
        return sendJson(res, 400, { success: false, error: 'Invalid type or ID' });
      }

      let all = readDb(type);
      all = all.filter(item => item.id !== id);
      writeDb(type, all);

      return sendJson(res, 200, { success: true, message: `Item ${id} deleted` });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let relativePath = reqPath;
  if (relativePath === '/' || relativePath === '') {
    relativePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, relativePath);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found - House of Memoir</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 60px; background: #f9f9ff; color: #1a1b20;">
          <h1 style="color: #1978e5; font-size: 48px; margin-bottom: 10px;">404</h1>
          <h2>Page Not Found</h2>
          <p>Requested URL: <code>${req.url}</code></p>
          <p style="margin-top: 25px;"><a href="/" style="background: #1978e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Return to Home</a></p>
        </body>
        </html>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(` House of Memoir Protected Hybrid Server is running!`);
  console.log(` Port: ${PORT}`);
  console.log(` URL:  http://localhost:${PORT}/`);
  console.log(` Admin Portal: http://localhost:${PORT}/admin.html`);
  console.log(` Default Admin User: admin`);
  console.log(` Default Admin Pass: admin123`);
  console.log(`=================================================\n`);
});
