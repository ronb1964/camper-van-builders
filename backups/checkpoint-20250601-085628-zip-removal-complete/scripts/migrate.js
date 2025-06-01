require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Database path
const DB_PATH = path.join(__dirname, 'camper-van-builders.db');

async function migrateToSQLite() {
  try {
    console.log('🚀 Starting migration from Google Sheets to SQLite...');
    
    // Initialize database
    const db = new Database(DB_PATH);
    
    // Create table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS builders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        zip TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        description TEXT,
        specialties TEXT,
        van_types TEXT,
        price_range_min INTEGER,
        price_range_max INTEGER,
        pricing_tiers TEXT,
        amenities TEXT,
        services TEXT,
        certifications TEXT,
        years_in_business INTEGER,
        lead_time TEXT,
        photos TEXT,
        social_media TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.exec(createTableSQL);
    db.exec('CREATE INDEX IF NOT EXISTS idx_builders_state ON builders(state)');
    
    console.log('✅ SQLite database initialized');
    
    // Fetch from Google Sheets
    const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    const sheetId = process.env.REACT_APP_GOOGLE_SHEETS_ID;
    
    if (!apiKey || !sheetId) {
      throw new Error('Missing Google Sheets API key or Sheet ID');
    }
    
    console.log('📊 Fetching builders from Google Sheets...');
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/builders!A:N?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    if (rows.length === 0) {
      console.warn('⚠️ No data found in sheet');
      return;
    }
    
    console.log(`✅ Fetched ${rows.length - 1} builders from Google Sheets`);
    
    // Prepare insert statement
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO builders (
        name, city, state, lat, lng, zip, phone, email, website, description,
        specialties, van_types, price_range_min, price_range_max, pricing_tiers,
        amenities, services, certifications, years_in_business, lead_time,
        photos, social_media
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Skip header row and process data
    let inserted = 0;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue; // Skip empty rows
      
      // Get coordinates (simplified distribution)
      const lat = 40.0583 + (Math.random() - 0.5) * 2;
      const lng = -74.4057 + (Math.random() - 0.5) * 2;
      
      try {
        stmt.run(
          row[0] || 'Unknown Builder',    // name
          row[2] || 'Unknown City',       // city
          row[3] || 'New Jersey',         // state
          lat,                            // lat
          lng,                            // lng
          row[4] || null,                 // zip
          row[7] || null,                 // phone
          row[8] || null,                 // email
          row[6] || null,                 // website
          row[5] || null,                 // description
          JSON.stringify(['Custom Builds']), // specialties
          JSON.stringify(['Sprinter', 'Transit', 'Promaster']), // van_types
          50000,                          // price_range_min
          150000,                         // price_range_max
          JSON.stringify([]),             // pricing_tiers
          JSON.stringify(['Solar Power', 'Kitchen']), // amenities
          JSON.stringify(['Custom Builds']), // services
          JSON.stringify([]),             // certifications
          5,                              // years_in_business
          '4-8 months',                   // lead_time
          JSON.stringify([]),             // photos
          JSON.stringify({})              // social_media
        );
        inserted++;
      } catch (err) {
        console.error(`Error inserting row ${i}:`, err);
      }
    }
    
    console.log(`✅ Successfully inserted ${inserted} builders to SQLite`);
    
    // Verify New Jersey builders
    const njBuilders = db.prepare('SELECT * FROM builders WHERE state = ?').all('New Jersey');
    console.log(`🔍 New Jersey builders in SQLite: ${njBuilders.length}`);
    
    if (njBuilders.length > 0) {
      console.log('📋 New Jersey builders:');
      njBuilders.forEach((builder, index) => {
        console.log(`  ${index + 1}. ${builder.name} (${builder.city})`);
      });
    }
    
    // Show states summary
    const statesWithCounts = db.prepare(`
      SELECT state, COUNT(*) as count 
      FROM builders 
      GROUP BY state 
      ORDER BY state
    `).all();
    
    console.log('\n📊 States summary:');
    statesWithCounts.forEach(({ state, count }) => {
      console.log(`  ${state}: ${count} builders`);
    });
    
    db.close();
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateToSQLite()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
