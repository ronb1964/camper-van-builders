#!/usr/bin/env node

/**
 * 🚀 CAMPER VAN BUILDERS - PROGRAMMATIC API
 * 
 * High-level API for managing the builder database programmatically.
 * This provides simple functions for common operations.
 */

const DatabaseManager = require('./databaseManager');

class BuilderAPI {
  constructor() {
    this.db = new DatabaseManager();
  }

  /**
   * ➕ Add a new camper van builder
   */
  async addBuilder({
    name,
    address,
    phone,
    email,
    website = '',
    city,
    state,
    zip,
    lat = 0,
    lng = 0,
    description = '',
    vanTypes = [],
    services = [],
    amenities = [],
    priceRange = null,
    leadTime = '',
    socialMedia = {},
    certifications = []
  }) {
    const builderData = {
      name,
      address,
      phone,
      email,
      website,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city,
        state: state.toUpperCase(),
        zip
      },
      description,
      vanTypes,
      services,
      amenities,
      priceRange,
      leadTime,
      socialMedia,
      certifications,
      gallery: []
    };

    const id = this.db.addBuilder(builderData);
    console.log(`✅ Successfully added builder: ${name} (ID: ${id})`);
    return id;
  }

  /**
   * ✏️ Update builder information
   */
  async updateBuilder(builderId, updates) {
    const builder = this.db.updateBuilder(builderId, updates);
    console.log(`✅ Successfully updated builder: ${builder.name}`);
    return builder;
  }

  /**
   * 🗑️ Remove a builder
   */
  async removeBuilder(builderId) {
    const builder = this.db.removeBuilder(builderId);
    console.log(`✅ Successfully removed builder: ${builder.name}`);
    return builder;
  }

  /**
   * 🔍 Find builders by various criteria
   */
  async findBuilders({ name, state, city, service, vanType, limit = 10 }) {
    const { builders } = this.db.loadDatabase();
    
    let results = builders;

    if (name) {
      results = results.filter(b => 
        b.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (state) {
      results = results.filter(b => 
        b.location.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (city) {
      results = results.filter(b => 
        b.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (service) {
      results = results.filter(b => 
        b.services && b.services.some(s => 
          s.toLowerCase().includes(service.toLowerCase())
        )
      );
    }

    if (vanType) {
      results = results.filter(b => 
        b.vanTypes && b.vanTypes.some(v => 
          v.toLowerCase().includes(vanType.toLowerCase())
        )
      );
    }

    return results.slice(0, limit);
  }

  /**
   * 📊 Get comprehensive database statistics
   */
  async getStatistics() {
    const stats = this.db.getStats();
    const { builders } = this.db.loadDatabase();

    // Additional statistics
    const vanTypeStats = {};
    const serviceStats = {};
    
    builders.forEach(builder => {
      if (builder.vanTypes) {
        builder.vanTypes.forEach(type => {
          vanTypeStats[type] = (vanTypeStats[type] || 0) + 1;
        });
      }
      
      if (builder.services) {
        builder.services.forEach(service => {
          serviceStats[service] = (serviceStats[service] || 0) + 1;
        });
      }
    });

    return {
      ...stats,
      popularVanTypes: Object.entries(vanTypeStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      popularServices: Object.entries(serviceStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    };
  }

  /**
   * 🔧 Validate and fix database issues
   */
  async validateAndFix() {
    const validation = this.db.validateDatabase();
    
    if (validation.isValid) {
      console.log('✅ Database is valid - no issues found');
      return { fixed: 0, issues: [] };
    }

    console.log('⚠️ Database issues found:');
    validation.issues.forEach(issue => console.log(`  - ${issue}`));
    
    // Auto-fix what we can
    let fixedCount = 0;
    // Add auto-fix logic here as needed
    
    return { fixed: fixedCount, issues: validation.issues };
  }

  /**
   * 📋 List all builders in a state
   */
  async getBuildersByState(stateCode) {
    const { buildersByState } = this.db.loadDatabase();
    return buildersByState[stateCode.toUpperCase()] || [];
  }

  /**
   * 🗺️ List all states with builders
   */
  async getStatesWithBuilders() {
    const { states } = this.db.loadDatabase();
    return states.filter(state => state.builderCount > 0);
  }

  /**
   * 📱 Update builder contact information
   */
  async updateContact(builderId, { phone, email, website, address }) {
    const updates = {};
    if (phone) updates.phone = phone;
    if (email) updates.email = email;
    if (website) updates.website = website;
    if (address) updates.address = address;
    
    return this.updateBuilder(builderId, updates);
  }

  /**
   * 🛠️ Update builder services
   */
  async updateServices(builderId, services) {
    return this.updateBuilder(builderId, { services });
  }

  /**
   * 🚐 Update van types
   */
  async updateVanTypes(builderId, vanTypes) {
    return this.updateBuilder(builderId, { vanTypes });
  }

  /**
   * 💰 Update pricing information
   */
  async updatePricing(builderId, priceRange) {
    return this.updateBuilder(builderId, { priceRange });
  }

  /**
   * 📍 Update location information
   */
  async updateLocation(builderId, { city, state, zip, lat, lng }) {
    const updates = {
      location: {
        city,
        state: state.toUpperCase(),
        zip,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    };
    
    return this.updateBuilder(builderId, updates);
  }
}

// Export for programmatic use
module.exports = BuilderAPI;

// CLI Interface for testing
if (require.main === module) {
  const api = new BuilderAPI();
  const command = process.argv[2];
  
  (async () => {
    try {
      switch (command) {
        case 'add':
          // Example: node builderAPI.js add "Test Builder" "123 Main St" "555-1234" "test@example.com" "Test City" "NJ" "12345"
          const [, , , name, address, phone, email, city, state, zip] = process.argv;
          if (!name || !address || !phone || !email || !city || !state || !zip) {
            console.log('Usage: node builderAPI.js add <name> <address> <phone> <email> <city> <state> <zip>');
            process.exit(1);
          }
          await api.addBuilder({ name, address, phone, email, city, state, zip });
          break;
          
        case 'find':
          const searchParams = {};
          for (let i = 3; i < process.argv.length; i += 2) {
            const key = process.argv[i].replace('--', '');
            const value = process.argv[i + 1];
            searchParams[key] = value;
          }
          const results = await api.findBuilders(searchParams);
          console.log(`🔍 Found ${results.length} builders:`);
          results.forEach(builder => {
            console.log(`  - ${builder.name} (${builder.location.city}, ${builder.location.state})`);
          });
          break;
          
        case 'stats':
          const stats = await api.getStatistics();
          console.log('📊 Database Statistics:');
          console.log(JSON.stringify(stats, null, 2));
          break;
          
        case 'states':
          const states = await api.getStatesWithBuilders();
          console.log('🗺️ States with builders:');
          states.forEach(state => {
            console.log(`  - ${state.name} (${state.code}): ${state.builderCount} builders`);
          });
          break;
          
        default:
          console.log(`
🚀 CAMPER VAN BUILDERS - PROGRAMMATIC API

Usage:
  node builderAPI.js add <name> <address> <phone> <email> <city> <state> <zip>
  node builderAPI.js find --state NJ --service "Custom Builds"
  node builderAPI.js stats
  node builderAPI.js states

Examples:
  node builderAPI.js add "New Builder" "123 Main St" "555-1234" "info@newbuilder.com" "Princeton" "NJ" "08540"
  node builderAPI.js find --state NJ
  node builderAPI.js find --vanType Sprinter
          `);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  })();
}
