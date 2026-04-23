import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Database setup
  const db = new Database('bigbroker.db');
  
  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      bhk INTEGER NOT NULL,
      location TEXT NOT NULL,
      sector TEXT NOT NULL,
      city TEXT NOT NULL,
      description TEXT,
      images TEXT NOT NULL
    )
  `);

  // Seed data if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM properties').get() as { count: number };
  if (count.count === 0) {
    const seedProperties = [
      {
        title: 'Skyline Residency',
        price: 8500000,
        bhk: 3,
        location: 'Golf Course Road',
        sector: 'Sector 54',
        city: 'Gurugram',
        description: 'Luxurious 3BHK apartment with panoramic city views and premium amenities.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000'])
      },
      {
        title: 'Emerald Heights',
        price: 12500000,
        bhk: 4,
        location: 'Vasant Kunj',
        sector: 'Block C',
        city: 'New Delhi',
        description: 'Spacious 4BHK villa nestled in a green neighborhood with private garden.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1512918766675-ed4304bf594d?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000'])
      },
      {
        title: 'Coastal Breeze Apartment',
        price: 6500000,
        bhk: 2,
        location: 'Bandra West',
        sector: 'Pali Hill',
        city: 'Mumbai',
        description: 'Modern 2BHK near the promenade, perfect for urban professionals.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000'])
      },
      {
        title: 'The Heritage Manor',
        price: 45000000,
        bhk: 5,
        location: 'Civil Lines',
        sector: 'Model Town',
        city: 'Ludhiana',
        description: 'Stately 5BHK heritage home with extensive woodwork and luxury finishes.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000'])
      },
      {
        title: 'Urban Oasis',
        price: 9800000,
        bhk: 3,
        location: 'Whitefield',
        sector: 'ITPL Road',
        city: 'Bengaluru',
        description: 'Contemporary 3BHK in the heart of the tech hub, quiet and airy.',
        images: JSON.stringify(['https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000'])
      }
    ];

    const insert = db.prepare('INSERT INTO properties (title, price, bhk, location, sector, city, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const p of seedProperties) {
      insert.run(p.title, p.price, p.bhk, p.location, p.sector, p.city, p.description, p.images);
    }
  }

  // API Routes
  app.get('/api/properties', (req, res) => {
    try {
      const { city, sector, minPrice, maxPrice, bhk } = req.query;
      let query = 'SELECT * FROM properties WHERE 1=1';
      const params: any[] = [];

      if (city) {
        query += ' AND city = ?';
        params.push(city);
      }
      if (sector) {
        query += ' AND sector = ?';
        params.push(sector);
      }
      if (minPrice) {
        query += ' AND price >= ?';
        params.push(minPrice);
      }
      if (maxPrice) {
        query += ' AND price <= ?';
        params.push(maxPrice);
      }
      if (bhk) {
        query += ' AND bhk = ?';
        params.push(bhk);
      }

      query += ' ORDER BY id DESC';
      const properties = db.prepare(query).all(...params);
      
      const parsedProperties = properties.map((p: any) => ({
        ...p,
        images: JSON.parse(p.images)
      }));
      res.json(parsedProperties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  });

  app.get('/api/locations', (req, res) => {
    try {
      const cities = db.prepare('SELECT DISTINCT city FROM properties').all() as any[];
      const sectors = db.prepare('SELECT DISTINCT sector FROM properties').all() as any[];
      res.json({
        cities: cities.map(c => c.city),
        sectors: sectors.map(s => s.sector)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  });

  app.get('/api/properties/:id', (req, res) => {
    try {
      const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
      if (!property) return res.status(404).json({ error: 'Property not found' });
      
      property.images = JSON.parse(property.images);
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
