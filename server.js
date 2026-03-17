const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const REGIONS = {
  china: { title: 'Chinese Art', headerClass: 'header-china' },
  japan: { title: 'Japanese Art', headerClass: 'header-japan' },
  korea: { title: 'Korean Art', headerClass: 'header-korea' },
};

const STYLE_PAGES = {
  china: { title: 'Chinese Style', headerClass: 'header-china' },
  japan: { title: 'Japanese Style', headerClass: 'header-japan' },
  korea: { title: 'Korean Style', headerClass: 'header-korea' },
};

function queryArtworks(db, region) {
  const stmt = db.prepare(
    'SELECT id, title, image_url, description, region FROM artworks WHERE region = ? ORDER BY id'
  );
  stmt.bind([region]);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function queryAllArtworks(db, region) {
  if (region) return queryArtworks(db, region);
  const stmt = db.prepare(
    'SELECT id, title, image_url, description, region FROM artworks ORDER BY region, id'
  );
  stmt.bind([]);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

async function start() {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'gallery.db');

  let db;
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE artworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_url TEXT,
        description TEXT,
        region TEXT NOT NULL CHECK(region IN ('china', 'japan', 'korea'))
      )
    `);
  }

  app.get('/', (req, res) => {
    res.render('home', { headerClass: 'header-default', pageTitle: 'Art of the Orient' });
  });

  app.get('/gallery/:region', (req, res) => {
    const region = req.params.region.toLowerCase();
    const config = REGIONS[region];
    if (!config) return res.status(404).send('Gallery not found');
    const artworks = queryArtworks(db, region);
    res.render('gallery', {
      pageTitle: config.title,
      headerClass: config.headerClass,
      region,
      artworks,
    });
  });

  app.get('/style/:region', (req, res) => {
    const region = req.params.region.toLowerCase();
    const config = STYLE_PAGES[region];
    if (!config) return res.status(404).send('Style not found');
    res.render('style', {
      pageTitle: config.title,
      headerClass: config.headerClass,
    });
  });

  app.get('/symbolism', (req, res) => {
    res.render('symbolism', {
      pageTitle: 'Oriental Symbolism',
      headerClass: 'header-symbolism',
    });
  });

  app.get('/production', (req, res) => {
    res.render('production', {
      pageTitle: 'Production Techniques',
      headerClass: 'header-production',
    });
  });

  app.get('/production/woodblock-printing', (req, res) => {
    res.render('woodblock-printing', {
      pageTitle: 'Woodblock Printing',
      headerClass: 'header-production',
    });
  });

  app.get('/production/four-treasures', (req, res) => {
    res.render('four-treasures', {
      pageTitle: 'Four Treasures of the Study',
      headerClass: 'header-production',
    });
  });

  app.get('/api/artworks', (req, res) => {
    const artworks = queryAllArtworks(db, req.query.region || null);
    res.json(artworks);
  });

  const server = app.listen(PORT, () => {
    console.log(`Art of the Orient running at http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const alt = PORT + 1;
      console.log(`Port ${PORT} in use, trying ${alt}...`);
      app.listen(alt, () => {
        console.log(`Art of the Orient running at http://localhost:${alt}`);
      });
    } else {
      throw err;
    }
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
