# 🗄️ CAMPER VAN BUILDERS - PROGRAMMATIC DATABASE MANAGEMENT

## 🎯 **Overview**

This system provides **programmatic control** over the Camper Van Builders database without requiring manual Google Sheets editing. You can now add, update, remove, and manage builders through code, scripts, or a web interface.

## 🚀 **Key Features**

- ✅ **Direct JSON Management** - No Google Sheets dependency for updates
- ✅ **Automatic Backups** - Every change creates a backup
- ✅ **Data Validation** - Ensures database integrity
- ✅ **Multiple Interfaces** - CLI, API, and Web UI
- ✅ **State Management** - Automatic state-based organization
- ✅ **Search & Filter** - Powerful query capabilities

## 📁 **File Structure**

```
scripts/
├── databaseManager.js    # Core database management class
├── builderAPI.js        # High-level API for common operations
├── webManager.js        # Web interface for database management
└── README.md           # This documentation

backups/data/           # Automatic backups (created automatically)
public/data/           # Live JSON database files
├── builders.json      # All builders
├── builders-by-state.json # Organized by state
└── states.json        # State information
```

## 🛠️ **Usage Methods**

### **Method 1: Command Line Interface**

#### Database Statistics
```bash
node scripts/databaseManager.js stats
```

#### Search Builders
```bash
node scripts/databaseManager.js search "New Jersey"
node scripts/databaseManager.js search "Sprinter"
```

#### Validate Database
```bash
node scripts/databaseManager.js validate
```

#### Create Manual Backup
```bash
node scripts/databaseManager.js backup
```

### **Method 2: High-Level API**

#### Add a New Builder
```bash
node scripts/builderAPI.js add "New Builder Name" "123 Main St" "555-1234" "info@builder.com" "Princeton" "NJ" "08540"
```

#### Search with Filters
```bash
node scripts/builderAPI.js find --state NJ
node scripts/builderAPI.js find --vanType Sprinter
node scripts/builderAPI.js find --service "Custom Builds"
```

#### Get Statistics
```bash
node scripts/builderAPI.js stats
```

#### List States
```bash
node scripts/builderAPI.js states
```

### **Method 3: Web Interface**

#### Start Web Manager
```bash
node scripts/webManager.js
```

Then visit: **http://localhost:3001/admin**

**Features:**
- 📊 Real-time database statistics
- 🔍 Interactive search interface
- ➕ Add new builders through web form
- 🔧 Database validation tools
- 🛡️ One-click backup creation

### **Method 4: Programmatic API (Node.js)**

```javascript
const BuilderAPI = require('./scripts/builderAPI');
const api = new BuilderAPI();

// Add a new builder
const id = await api.addBuilder({
  name: "Amazing Van Conversions",
  address: "456 Van Street",
  phone: "555-VAN-CONV",
  email: "info@amazingvans.com",
  city: "Princeton",
  state: "NJ",
  zip: "08540",
  description: "Premium van conversions...",
  vanTypes: ["Sprinter", "Transit"],
  services: ["Custom Builds", "Electrical", "Plumbing"]
});

// Update builder
await api.updateBuilder(id, {
  phone: "555-NEW-PHONE",
  website: "https://amazingvans.com"
});

// Search builders
const results = await api.findBuilders({
  state: "NJ",
  vanType: "Sprinter"
});

// Remove builder
await api.removeBuilder(id);
```

## 📊 **Current Database Status**

- **Total Builders:** 79
- **States Covered:** 50 (all US states)
- **Top States:** New Jersey (13), Arizona (5), California (5)
- **Data Source:** JSON files (generated from Google Sheets)

## 🛡️ **Backup & Safety**

### **Automatic Backups**
- Every database change creates a timestamped backup
- Backups stored in `backups/data/[timestamp]/`
- Includes all JSON files (builders, states, organization)

### **Manual Backups**
```bash
node scripts/databaseManager.js backup
```

### **Restore from Backup**
```bash
# Copy backup files back to public/data/
cp backups/data/[timestamp]/* public/data/
```

## 🔧 **Data Validation**

The system validates:
- ✅ **Required fields** - name, address, phone, email, location
- ✅ **Unique IDs** - No duplicate builder IDs
- ✅ **State consistency** - Builders properly organized by state
- ✅ **Data integrity** - All references are valid

Run validation:
```bash
node scripts/databaseManager.js validate
```

## 📝 **Adding New Builders**

### **Required Fields:**
- `name` - Builder business name
- `address` - Full street address
- `phone` - Contact phone number
- `email` - Contact email address
- `city` - City name
- `state` - 2-letter state code (e.g., "NJ")
- `zip` - ZIP code

### **Optional Fields:**
- `website` - Business website URL
- `description` - Business description
- `vanTypes` - Array of van types (e.g., ["Sprinter", "Transit"])
- `services` - Array of services (e.g., ["Custom Builds", "Electrical"])
- `amenities` - Array of amenities offered
- `priceRange` - Object with min/max pricing
- `leadTime` - Estimated lead time
- `socialMedia` - Object with social media URLs
- `certifications` - Array of certifications

## 🔍 **Search Capabilities**

Search by:
- **Name** - Builder business name
- **Location** - City, state, or region
- **Services** - What they offer
- **Van Types** - Vehicle types they work with
- **Combined queries** - Multiple criteria

## 🌐 **Web Interface Features**

Access at: **http://localhost:3001/admin**

- 📊 **Dashboard** - Real-time statistics and metrics
- 🔍 **Search** - Interactive builder search
- ➕ **Add Builder** - Web form for new builders
- ✏️ **Edit** - Update existing builder information
- 🗑️ **Remove** - Delete builders with confirmation
- 🔧 **Validate** - Check database integrity
- 🛡️ **Backup** - Create manual backups

## 🚨 **Important Notes**

1. **No Google Sheets Dependency** - Updates happen directly to JSON files
2. **Automatic Backups** - Every change is backed up automatically
3. **State Synchronization** - Changes automatically update state organization
4. **ID Management** - Unique IDs are automatically generated
5. **Data Validation** - All changes are validated before saving

## 🎯 **Next Steps**

You can now:
1. **Add new builders** without touching Google Sheets
2. **Update contact information** programmatically
3. **Remove outdated builders** safely
4. **Search and filter** the database efficiently
5. **Validate data integrity** regularly
6. **Create backups** before major changes

The system is ready for programmatic management while maintaining all the safety and reliability of your current setup!
