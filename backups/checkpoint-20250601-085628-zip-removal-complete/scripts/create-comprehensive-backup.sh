#!/bin/bash

# Comprehensive Site Backup Script
# Created: $(date)
# Purpose: Complete backup after zip code removal from builder cards

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups/checkpoint-${TIMESTAMP}-zip-removal-complete"

echo "🔄 Creating comprehensive backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Create backup info file
cat > "$BACKUP_DIR/BACKUP_INFO.md" << EOF
# Comprehensive Site Backup

**Created:** $(date)
**Backup ID:** checkpoint-${TIMESTAMP}-zip-removal-complete
**Purpose:** Complete backup after zip code removal from builder cards

## What's Included:
- All source code (src/, public/, server/)
- All data files (JSON, CSV, MD)
- All scripts and utilities
- Configuration files
- Documentation
- Node modules excluded (can be restored with npm install)

## Key State at Backup:
- Colorado builders: 5 verified authentic builders
- Fake "Rocky Mountain Vans" removed completely
- Zip codes removed from builder card display
- All gallery photos extracted and updated
- CSP policies updated for new image domains

## To Restore:
1. Copy contents back to project root
2. Run: npm install
3. Run: npm start

## Colorado Builders Status:
- The Vansmith (Boulder) - 0 gallery photos
- Titan Vans (Boulder) - 5 gallery photos  
- Boulder Campervans (Boulder) - 0 gallery photos
- Viking Van Customs (Littleton) - 2 gallery photos
- Flippin Vans (Denver) - 3 gallery photos

Builders with blank galleries tracked in: builders-with-blank-galleries.md
EOF

echo "📝 Created backup info file"

# Backup source code
echo "💾 Backing up source code..."
cp -r src/ "$BACKUP_DIR/"
cp -r public/ "$BACKUP_DIR/"
cp -r server/ "$BACKUP_DIR/" 2>/dev/null || echo "   ⚠️  No server directory found"

# Backup data files
echo "📊 Backing up data files..."
mkdir -p "$BACKUP_DIR/data-files"
cp public/data/*.json "$BACKUP_DIR/data-files/" 2>/dev/null || echo "   ⚠️  No JSON data files found"
cp *.csv "$BACKUP_DIR/data-files/" 2>/dev/null || echo "   ⚠️  No CSV files found"
cp *.md "$BACKUP_DIR/data-files/" 2>/dev/null || echo "   ⚠️  No markdown files found"

# Backup scripts and utilities
echo "🔧 Backing up scripts..."
mkdir -p "$BACKUP_DIR/scripts"
cp *.js "$BACKUP_DIR/scripts/" 2>/dev/null || echo "   ⚠️  No JS scripts found"
cp *.sh "$BACKUP_DIR/scripts/" 2>/dev/null || echo "   ⚠️  No shell scripts found"

# Backup configuration files
echo "⚙️  Backing up configuration..."
mkdir -p "$BACKUP_DIR/config"
cp package*.json "$BACKUP_DIR/config/" 2>/dev/null
cp tsconfig.json "$BACKUP_DIR/config/" 2>/dev/null
cp netlify.toml "$BACKUP_DIR/config/" 2>/dev/null
cp .env.example "$BACKUP_DIR/config/" 2>/dev/null
cp .eslintrc "$BACKUP_DIR/config/" 2>/dev/null
cp .gitignore "$BACKUP_DIR/config/" 2>/dev/null

# Backup important tracking files
echo "📋 Backing up tracking files..."
cp builders-with-blank-galleries.md "$BACKUP_DIR/" 2>/dev/null
cp "Van Builder Search Rules.md" "$BACKUP_DIR/" 2>/dev/null

# Create file inventory
echo "📄 Creating file inventory..."
find "$BACKUP_DIR" -type f | sort > "$BACKUP_DIR/FILE_INVENTORY.txt"

# Calculate backup size
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

echo ""
echo "✅ Comprehensive backup completed!"
echo "📁 Location: $BACKUP_DIR"
echo "📏 Size: $BACKUP_SIZE"
echo "📄 Files: $(find "$BACKUP_DIR" -type f | wc -l)"
echo ""
echo "🔍 Backup contents:"
ls -la "$BACKUP_DIR"
