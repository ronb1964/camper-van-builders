const DatabaseService = require('./database/database');
const { GoogleSheetsService } = require('../src/services/googleSheetsService');

class DataMigration {
  constructor() {
    this.db = new DatabaseService();
    this.sheetsService = new GoogleSheetsService();
  }

  async migrateFromGoogleSheets() {
    console.log('🚀 Starting migration from Google Sheets to SQLite...');
    
    try {
      // Get all builders from Google Sheets
      console.log('📊 Fetching data from Google Sheets...');
      const sheetsBuilders = await this.sheetsService.getBuilders();
      console.log(`📋 Found ${sheetsBuilders.length} builders in Google Sheets`);

      let migratedCount = 0;
      let errorCount = 0;

      for (const builder of sheetsBuilders) {
        try {
          // Transform Google Sheets data to database format
          const builderData = this.transformBuilderData(builder);
          
          // Insert into database
          const builderId = this.db.addBuilder(builderData);
          console.log(`✅ Migrated: ${builder.name} (ID: ${builderId})`);
          migratedCount++;
          
        } catch (error) {
          console.error(`❌ Failed to migrate ${builder.name}:`, error.message);
          errorCount++;
        }
      }

      console.log('\n🎉 Migration completed!');
      console.log(`✅ Successfully migrated: ${migratedCount} builders`);
      console.log(`❌ Failed migrations: ${errorCount} builders`);
      
      // Verify migration
      const dbBuilders = this.db.getAllBuilders();
      console.log(`🔍 Database now contains: ${dbBuilders.length} builders`);

      return {
        success: true,
        migrated: migratedCount,
        errors: errorCount,
        total: dbBuilders.length
      };

    } catch (error) {
      console.error('💥 Migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  transformBuilderData(sheetsBuilder) {
    // Transform the Google Sheets builder format to database format
    return {
      name: sheetsBuilder.name || '',
      address: sheetsBuilder.address || '',
      phone: sheetsBuilder.phone || '',
      email: sheetsBuilder.email || '',
      website: sheetsBuilder.website || '',
      location: {
        lat: sheetsBuilder.location?.lat || 0,
        lng: sheetsBuilder.location?.lng || 0
      },
      city: this.extractCity(sheetsBuilder.address),
      state: this.extractState(sheetsBuilder.address),
      zipCode: this.extractZipCode(sheetsBuilder.address),
      description: sheetsBuilder.description || '',
      rating: sheetsBuilder.rating || 0,
      reviewCount: sheetsBuilder.reviewCount || 0,
      leadTime: sheetsBuilder.leadTime || '',
      vanTypes: sheetsBuilder.vanTypes || [],
      amenities: sheetsBuilder.amenities || [],
      services: sheetsBuilder.services || [],
      certifications: sheetsBuilder.certifications || [],
      socialMedia: sheetsBuilder.socialMedia || {}
    };
  }

  extractCity(address) {
    if (!address) return '';
    // Simple extraction - assumes format "Street, City, State ZIP"
    const parts = address.split(',');
    return parts.length >= 2 ? parts[1].trim() : '';
  }

  extractState(address) {
    if (!address) return '';
    // Extract state from address
    const parts = address.split(',');
    if (parts.length >= 3) {
      const stateZip = parts[2].trim();
      const statePart = stateZip.split(' ')[0];
      return statePart;
    }
    return '';
  }

  extractZipCode(address) {
    if (!address) return '';
    // Extract ZIP code from address
    const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
    return zipMatch ? zipMatch[0] : '';
  }

  async testDatabaseConnection() {
    try {
      const builders = this.db.getAllBuilders();
      console.log(`✅ Database connection successful. Found ${builders.length} builders.`);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  async addSampleData() {
    console.log('🌱 Adding sample data...');
    
    const sampleBuilders = [
      {
        name: "Humble Road",
        address: "123 Van Builder Lane, Trenton, NJ 08620",
        phone: "(609) 555-0123",
        email: "info@humbleroad.com",
        website: "https://humbleroad.com",
        location: { lat: 40.2206, lng: -74.7563 },
        city: "Trenton",
        state: "New Jersey",
        zipCode: "08620",
        description: "Premium van conversions with attention to detail",
        rating: 4.8,
        reviewCount: 25,
        leadTime: "3-6 months",
        vanTypes: ["Sprinter", "Transit"],
        amenities: ["Solar Power", "Bathroom", "Kitchen"],
        services: ["Custom Builds", "Conversions"],
        socialMedia: {
          instagram: "https://instagram.com/humbleroad"
        }
      },
      {
        name: "Adventure Van Co",
        address: "456 Explorer Ave, Denver, CO 80202",
        phone: "(303) 555-0456",
        email: "hello@adventurevan.co",
        website: "https://adventurevan.co",
        location: { lat: 39.7392, lng: -104.9903 },
        city: "Denver",
        state: "Colorado",
        zipCode: "80202",
        description: "Off-grid adventure vans for the modern explorer",
        rating: 4.6,
        reviewCount: 18,
        leadTime: "4-8 months",
        vanTypes: ["ProMaster", "Sprinter"],
        amenities: ["Solar Power", "Kitchen", "Storage"],
        services: ["Custom Builds", "Solar Installation"],
        socialMedia: {
          facebook: "https://facebook.com/adventurevan",
          instagram: "https://instagram.com/adventurevan"
        }
      }
    ];

    for (const builder of sampleBuilders) {
      try {
        const builderId = this.db.addBuilder(builder);
        console.log(`✅ Added sample builder: ${builder.name} (ID: ${builderId})`);
      } catch (error) {
        console.log(`⚠️ Sample builder ${builder.name} might already exist`);
      }
    }
  }
}

// CLI interface
if (require.main === module) {
  const migration = new DataMigration();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      migration.migrateFromGoogleSheets();
      break;
    case 'test':
      migration.testDatabaseConnection();
      break;
    case 'sample':
      migration.addSampleData();
      break;
    default:
      console.log('Usage:');
      console.log('  node migrate-from-sheets.js migrate  - Migrate from Google Sheets');
      console.log('  node migrate-from-sheets.js test     - Test database connection');
      console.log('  node migrate-from-sheets.js sample   - Add sample data');
  }
}

module.exports = DataMigration;
