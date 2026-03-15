const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'gallery.db');

const seed = [
  ['Blue and White Porcelain Vase', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400', 'Ming-style blue and white porcelain.', 'china'],
  ['Ink Wash Landscape', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', 'Traditional Chinese ink wash painting.', 'china'],
  ['Terracotta Warrior', 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400', 'Replica of Qin dynasty terracotta sculpture.', 'china'],
  ['Cherry Blossom Scroll', 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400', 'Japanese ukiyo-e inspired cherry blossom.', 'japan'],
  ['Zen Garden', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', 'Minimalist Japanese zen garden.', 'japan'],
  ['Samurai Armor', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', 'Edo period style armor and helmet.', 'japan'],
  ['Celadon Bowl', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', 'Korean Goryeo celadon pottery.', 'korea'],
  ['Hanbok Silk', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400', 'Traditional Korean hanbok fabric.', 'korea'],
  ['Joseon Painting', 'https://images.unsplash.com/photo-1515405295579-ba67b82027ed?w=400', 'Joseon dynasty landscape painting.', 'korea'],
];

async function run() {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

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

  const result = db.exec('SELECT COUNT(*) as c FROM artworks');
  const count = result.length && result[0].values[0][0];
  if (count > 0) {
    console.log('Database already has', count, 'artworks. Skipping seed.');
    db.close();
    return;
  }

  const insert = db.prepare(
    'INSERT INTO artworks (title, image_url, description, region) VALUES (?, ?, ?, ?)'
  );
  seed.forEach(([title, image_url, description, region]) => {
    insert.run([title, image_url, description, region]);
  });
  insert.free();

  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
  db.close();
  console.log('Database seeded with', seed.length, 'artworks.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
