#!/usr/bin/env node

/**
 * 🗄️ CAMPER VAN BUILDERS - PROGRAMMATIC DATABASE MANAGER
 * 
 * This script allows programmatic management of the builder database
 * through direct JSON file manipulation. No Google Sheets dependency required.
 * 
 * Features:
 * - Add new builders
 * - Update existing builders
 * - Remove builders
 * - Search and filter builders
 * - Validate data integrity
 * - Automatic backup creation
 * - State-based organization
 */

const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.dataDir = path.join(__dirname, '../public/data');
    this.buildersFile = path.join(this.dataDir, 'builders.json');
    this.buildersByStateFile = path.join(this.dataDir, 'builders-by-state.json');
    this.statesFile = path.join(this.dataDir, 'states.json');
    this.backupDir = path.join(__dirname, '../backups/data');
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 📖 Load current database
   */
  loadDatabase() {
    try {
      const builders = JSON.parse(fs.readFileSync(this.buildersFile, 'utf8'));
      const buildersByState = JSON.parse(fs.readFileSync(this.buildersByStateFile, 'utf8'));
      const states = JSON.parse(fs.readFileSync(this.statesFile, 'utf8'));
      
      return { builders, buildersByState, states };
    } catch (error) {
      console.error('❌ Error loading database:', error.message);
      throw error;
    }
  }

  /**
   * 💾 Save database with automatic backup
   */
  saveDatabase(builders, buildersByState, states) {
    try {
      // Create backup first
      this.createBackup();
      
      // Save updated data
      fs.writeFileSync(this.buildersFile, JSON.stringify(builders, null, 2));
      fs.writeFileSync(this.buildersByStateFile, JSON.stringify(buildersByState, null, 2));
      fs.writeFileSync(this.statesFile, JSON.stringify(states, null, 2));
      
      console.log('✅ Database saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving database:', error.message);
      throw error;
    }
  }

  /**
   * 🛡️ Create automatic backup
   */
  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSubDir = path.join(this.backupDir, timestamp);
    
    if (!fs.existsSync(backupSubDir)) {
      fs.mkdirSync(backupSubDir, { recursive: true });
    }
    
    // Copy current files to backup
    fs.copyFileSync(this.buildersFile, path.join(backupSubDir, 'builders.json'));
    fs.copyFileSync(this.buildersByStateFile, path.join(backupSubDir, 'builders-by-state.json'));
    fs.copyFileSync(this.statesFile, path.join(backupSubDir, 'states.json'));
    
    console.log(`🛡️ Backup created: ${timestamp}`);
  }

  /**
   * ➕ Add new builder
   */
  addBuilder(builderData) {
    const { builders, buildersByState, states } = this.loadDatabase();
    
    // Validate required fields
    const required = ['name', 'address', 'phone', 'email', 'location'];
    for (const field of required) {
      if (!builderData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Generate unique ID
    const maxId = Math.max(...builders.map(b => parseInt(b.id) || 0));
    builderData.id = (maxId + 1).toString();
    
    // Add to builders array
    builders.push(builderData);
    
    // Add to state-based organization
    const state = builderData.location.state;
    if (!buildersByState[state]) {
      buildersByState[state] = [];
    }
    buildersByState[state].push(builderData);
    
    // Update states list if new state
    if (!states.find(s => s.code === state)) {
      states.push({
        code: state,
        name: this.getStateName(state),
        builderCount: 1
      });
    } else {
      const stateObj = states.find(s => s.code === state);
      stateObj.builderCount = buildersByState[state].length;
    }
    
    this.saveDatabase(builders, buildersByState, states);
    console.log(`✅ Added builder: ${builderData.name} (ID: ${builderData.id})`);
    return builderData.id;
  }

  /**
   * ✏️ Update existing builder
   */
  updateBuilder(builderId, updates) {
    const { builders, buildersByState, states } = this.loadDatabase();
    
    // Find builder
    const builderIndex = builders.findIndex(b => b.id === builderId);
    if (builderIndex === -1) {
      throw new Error(`Builder not found: ${builderId}`);
    }
    
    const oldBuilder = builders[builderIndex];
    const oldState = oldBuilder.location.state;
    
    // Update builder
    builders[builderIndex] = { ...oldBuilder, ...updates, id: builderId };
    const updatedBuilder = builders[builderIndex];
    const newState = updatedBuilder.location.state;
    
    // Update state-based organization if state changed
    if (oldState !== newState) {
      // Remove from old state
      buildersByState[oldState] = buildersByState[oldState].filter(b => b.id !== builderId);
      
      // Add to new state
      if (!buildersByState[newState]) {
        buildersByState[newState] = [];
      }
      buildersByState[newState].push(updatedBuilder);
      
      // Update state counts
      const oldStateObj = states.find(s => s.code === oldState);
      if (oldStateObj) {
        oldStateObj.builderCount = buildersByState[oldState].length;
      }
      
      const newStateObj = states.find(s => s.code === newState);
      if (newStateObj) {
        newStateObj.builderCount = buildersByState[newState].length;
      }
    } else {
      // Update in same state
      const stateBuilderIndex = buildersByState[newState].findIndex(b => b.id === builderId);
      if (stateBuilderIndex !== -1) {
        buildersByState[newState][stateBuilderIndex] = updatedBuilder;
      }
    }
    
    this.saveDatabase(builders, buildersByState, states);
    console.log(`✅ Updated builder: ${updatedBuilder.name} (ID: ${builderId})`);
    return updatedBuilder;
  }

  /**
   * 🗑️ Remove builder
   */
  removeBuilder(builderId) {
    const { builders, buildersByState, states } = this.loadDatabase();
    
    // Find builder
    const builderIndex = builders.findIndex(b => b.id === builderId);
    if (builderIndex === -1) {
      throw new Error(`Builder not found: ${builderId}`);
    }
    
    const builder = builders[builderIndex];
    const state = builder.location.state;
    
    // Remove from builders array
    builders.splice(builderIndex, 1);
    
    // Remove from state-based organization
    buildersByState[state] = buildersByState[state].filter(b => b.id !== builderId);
    
    // Update state count
    const stateObj = states.find(s => s.code === state);
    if (stateObj) {
      stateObj.builderCount = buildersByState[state].length;
    }
    
    this.saveDatabase(builders, buildersByState, states);
    console.log(`✅ Removed builder: ${builder.name} (ID: ${builderId})`);
    return builder;
  }

  /**
   * 🔍 Search builders
   */
  searchBuilders(query) {
    const { builders } = this.loadDatabase();
    const searchTerm = query.toLowerCase();
    
    return builders.filter(builder => 
      builder.name.toLowerCase().includes(searchTerm) ||
      builder.location.city.toLowerCase().includes(searchTerm) ||
      builder.location.state.toLowerCase().includes(searchTerm) ||
      (builder.services && builder.services.some(s => s.toLowerCase().includes(searchTerm))) ||
      (builder.vanTypes && builder.vanTypes.some(v => v.toLowerCase().includes(searchTerm)))
    );
  }

  /**
   * 📊 Get database statistics
   */
  getStats() {
    const { builders, buildersByState, states } = this.loadDatabase();
    
    return {
      totalBuilders: builders.length,
      statesWithBuilders: Object.keys(buildersByState).length,
      totalStates: states.length,
      buildersByState: Object.entries(buildersByState).map(([state, builders]) => ({
        state,
        count: builders.length
      })).sort((a, b) => b.count - a.count)
    };
  }

  /**
   * 🔧 Validate database integrity
   */
  validateDatabase() {
    const { builders, buildersByState, states } = this.loadDatabase();
    const issues = [];
    
    // Check for duplicate IDs
    const ids = builders.map(b => b.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      issues.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
    }
    
    // Check state consistency
    for (const [state, stateBuilders] of Object.entries(buildersByState)) {
      const mainBuilders = builders.filter(b => b.location.state === state);
      if (stateBuilders.length !== mainBuilders.length) {
        issues.push(`State ${state}: Inconsistent builder count (${stateBuilders.length} vs ${mainBuilders.length})`);
      }
    }
    
    // Check required fields
    builders.forEach(builder => {
      const required = ['id', 'name', 'address', 'phone', 'email', 'location'];
      required.forEach(field => {
        if (!builder[field]) {
          issues.push(`Builder ${builder.id}: Missing ${field}`);
        }
      });
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 🗺️ Get state name from code
   */
  getStateName(code) {
    const stateNames = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
      'DC': 'District of Columbia'
    };
    return stateNames[code] || code;
  }
}

// CLI Interface
if (require.main === module) {
  const db = new DatabaseManager();
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'stats':
        console.log('📊 Database Statistics:');
        console.log(JSON.stringify(db.getStats(), null, 2));
        break;
        
      case 'validate':
        console.log('🔧 Validating database...');
        const validation = db.validateDatabase();
        if (validation.isValid) {
          console.log('✅ Database is valid');
        } else {
          console.log('❌ Database has issues:');
          validation.issues.forEach(issue => console.log(`  - ${issue}`));
        }
        break;
        
      case 'search':
        const query = process.argv[3];
        if (!query) {
          console.log('Usage: node databaseManager.js search <query>');
          process.exit(1);
        }
        const results = db.searchBuilders(query);
        console.log(`🔍 Found ${results.length} builders matching "${query}":`);
        results.forEach(builder => {
          console.log(`  - ${builder.name} (${builder.location.city}, ${builder.location.state})`);
        });
        break;
        
      case 'backup':
        db.createBackup();
        break;
        
      default:
        console.log(`
🗄️ CAMPER VAN BUILDERS - DATABASE MANAGER

Usage:
  node databaseManager.js stats      - Show database statistics
  node databaseManager.js validate   - Validate database integrity
  node databaseManager.js search <query> - Search builders
  node databaseManager.js backup     - Create manual backup

Examples:
  node databaseManager.js search "New Jersey"
  node databaseManager.js search "Sprinter"
  node databaseManager.js stats
        `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = DatabaseManager;
