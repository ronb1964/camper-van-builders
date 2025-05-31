const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class DatabaseService {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    try {
      // Create database file
      const dbPath = path.join(__dirname, 'builders.db');
      this.db = new Database(dbPath);
      
      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');
      
      // Read and execute schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split and execute each statement
      const statements = schema.split(';').filter(stmt => stmt.trim());
      statements.forEach(statement => {
        if (statement.trim()) {
          this.db.exec(statement + ';');
        }
      });
      
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  // Get all builders with related data
  getAllBuilders() {
    const query = `
      SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT vt.name) as van_types,
        GROUP_CONCAT(DISTINCT a.name) as amenities,
        GROUP_CONCAT(DISTINCT s.name) as services,
        GROUP_CONCAT(DISTINCT c.name) as certifications,
        sm.facebook, sm.instagram, sm.youtube, sm.pinterest, sm.tiktok
      FROM builders b
      LEFT JOIN builder_van_types bvt ON b.id = bvt.builder_id
      LEFT JOIN van_types vt ON bvt.van_type_id = vt.id
      LEFT JOIN builder_amenities ba ON b.id = ba.builder_id
      LEFT JOIN amenities a ON ba.amenity_id = a.id
      LEFT JOIN builder_services bs ON b.id = bs.builder_id
      LEFT JOIN services s ON bs.service_id = s.id
      LEFT JOIN builder_certifications bc ON b.id = bc.builder_id
      LEFT JOIN certifications c ON bc.certification_id = c.id
      LEFT JOIN social_media sm ON b.id = sm.builder_id
      GROUP BY b.id
      ORDER BY b.name
    `;
    
    const builders = this.db.prepare(query).all();
    
    return builders.map(builder => ({
      id: builder.id,
      name: builder.name,
      address: builder.address,
      phone: builder.phone,
      email: builder.email,
      website: builder.website,
      location: {
        lat: builder.latitude,
        lng: builder.longitude
      },
      city: builder.city,
      state: builder.state,
      zipCode: builder.zip_code,
      description: builder.description,
      rating: builder.rating,
      reviewCount: builder.review_count,
      leadTime: builder.lead_time,
      vanTypes: builder.van_types ? builder.van_types.split(',') : [],
      amenities: builder.amenities ? builder.amenities.split(',') : [],
      services: builder.services ? builder.services.split(',') : [],
      certifications: builder.certifications ? builder.certifications.split(',') : [],
      socialMedia: {
        facebook: builder.facebook,
        instagram: builder.instagram,
        youtube: builder.youtube,
        pinterest: builder.pinterest,
        tiktok: builder.tiktok
      },
      reviews: this.getBuilderReviews(builder.id),
      photos: this.getBuilderPhotos(builder.id)
    }));
  }

  // Get builders by state
  getBuildersByState(state) {
    const builders = this.getAllBuilders();
    return builders.filter(builder => 
      builder.state && builder.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Get builders within radius of coordinates
  getBuildersNearLocation(lat, lng, radiusMiles = 50) {
    const builders = this.getAllBuilders();
    
    return builders.filter(builder => {
      const distance = this.calculateDistance(lat, lng, builder.location.lat, builder.location.lng);
      return distance <= radiusMiles;
    }).map(builder => ({
      ...builder,
      distanceFromLocation: this.calculateDistance(lat, lng, builder.location.lat, builder.location.lng)
    }));
  }

  // Calculate distance using Haversine formula
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  }

  // Get reviews for a builder
  getBuilderReviews(builderId) {
    const query = `
      SELECT * FROM reviews 
      WHERE builder_id = ? 
      ORDER BY created_at DESC
    `;
    return this.db.prepare(query).all(builderId);
  }

  // Get photos for a builder
  getBuilderPhotos(builderId) {
    const query = `
      SELECT * FROM photos 
      WHERE builder_id = ? 
      ORDER BY is_primary DESC, created_at ASC
    `;
    return this.db.prepare(query).all(builderId);
  }

  // Add a new builder
  addBuilder(builderData) {
    const insertBuilder = this.db.prepare(`
      INSERT INTO builders (
        name, address, phone, email, website, 
        latitude, longitude, city, state, zip_code, 
        description, rating, review_count, lead_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertBuilder.run(
      builderData.name,
      builderData.address,
      builderData.phone,
      builderData.email,
      builderData.website,
      builderData.location.lat,
      builderData.location.lng,
      builderData.city,
      builderData.state,
      builderData.zipCode,
      builderData.description,
      builderData.rating || 0,
      builderData.reviewCount || 0,
      builderData.leadTime
    );

    const builderId = result.lastInsertRowid;

    // Add related data
    if (builderData.vanTypes) {
      this.addBuilderVanTypes(builderId, builderData.vanTypes);
    }
    if (builderData.amenities) {
      this.addBuilderAmenities(builderId, builderData.amenities);
    }
    if (builderData.services) {
      this.addBuilderServices(builderId, builderData.services);
    }
    if (builderData.socialMedia) {
      this.addBuilderSocialMedia(builderId, builderData.socialMedia);
    }

    return builderId;
  }

  // Helper methods for adding related data
  addBuilderVanTypes(builderId, vanTypes) {
    const getVanTypeId = this.db.prepare('SELECT id FROM van_types WHERE name = ?');
    const insertVanType = this.db.prepare('INSERT OR IGNORE INTO van_types (name) VALUES (?)');
    const linkVanType = this.db.prepare('INSERT OR IGNORE INTO builder_van_types (builder_id, van_type_id) VALUES (?, ?)');

    vanTypes.forEach(vanType => {
      insertVanType.run(vanType);
      const vanTypeRow = getVanTypeId.get(vanType);
      if (vanTypeRow) {
        linkVanType.run(builderId, vanTypeRow.id);
      }
    });
  }

  addBuilderAmenities(builderId, amenities) {
    const getAmenityId = this.db.prepare('SELECT id FROM amenities WHERE name = ?');
    const insertAmenity = this.db.prepare('INSERT OR IGNORE INTO amenities (name) VALUES (?)');
    const linkAmenity = this.db.prepare('INSERT OR IGNORE INTO builder_amenities (builder_id, amenity_id) VALUES (?, ?)');

    amenities.forEach(amenity => {
      insertAmenity.run(amenity);
      const amenityRow = getAmenityId.get(amenity);
      if (amenityRow) {
        linkAmenity.run(builderId, amenityRow.id);
      }
    });
  }

  addBuilderServices(builderId, services) {
    const getServiceId = this.db.prepare('SELECT id FROM services WHERE name = ?');
    const insertService = this.db.prepare('INSERT OR IGNORE INTO services (name) VALUES (?)');
    const linkService = this.db.prepare('INSERT OR IGNORE INTO builder_services (builder_id, service_id) VALUES (?, ?)');

    services.forEach(service => {
      insertService.run(service);
      const serviceRow = getServiceId.get(service);
      if (serviceRow) {
        linkService.run(builderId, serviceRow.id);
      }
    });
  }

  addBuilderSocialMedia(builderId, socialMedia) {
    const insertSocialMedia = this.db.prepare(`
      INSERT OR REPLACE INTO social_media 
      (builder_id, facebook, instagram, youtube, pinterest, tiktok) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertSocialMedia.run(
      builderId,
      socialMedia.facebook,
      socialMedia.instagram,
      socialMedia.youtube,
      socialMedia.pinterest,
      socialMedia.tiktok
    );
  }

  // Get all unique states
  getAllStates() {
    const query = 'SELECT DISTINCT state FROM builders WHERE state IS NOT NULL ORDER BY state';
    return this.db.prepare(query).all().map(row => row.state);
  }

  // Get all van types
  getAllVanTypes() {
    const query = 'SELECT name FROM van_types ORDER BY name';
    return this.db.prepare(query).all().map(row => row.name);
  }

  // Get all amenities
  getAllAmenities() {
    const query = 'SELECT name FROM amenities ORDER BY name';
    return this.db.prepare(query).all().map(row => row.name);
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = DatabaseService;
