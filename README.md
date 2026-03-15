# Art of the Orient

A gallery website for Asian art (China, Japan, Korea) with a Node/Express backend and SQLite database.

## Setup

```bash
npm install
npm run seed
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- **Backend:** `server.js` — Express server, EJS views, SQLite via `better-sqlite3`
- **Database:** `data/gallery.db` — `artworks` table (title, image_url, description, region)
- **Frontend:** `views/` (EJS), `public/css/`, `public/js/`
- **Seed:** `npm run seed` fills the DB with sample artworks for China, Japan, and Korea

## Navigation

- **Home:** Blue header “Art of the Orient”; buttons: Gallery, Style, Symbolism, Production Techniques.
- **Gallery** opens a dropdown: China → Chinese Art (blue header), Japan → Japanese Art (red header), Korea → Korean Art (green header).
