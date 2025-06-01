#!/bin/bash

echo "🧹 Starting comprehensive project cleanup..."

# Remove backup files and directories
echo "Removing backup files..."
rm -rf backup-google-sheets-working/
rm -f src/App-backup.tsx
rm -f src/App-complex-backup.tsx
rm -f create-comprehensive-backup.sh

# Remove test files and components
echo "Removing test files..."
rm -f src/TestPage.tsx
rm -f src/components/TestNewJersey.tsx
rm -f src/components/SimpleMapTest.tsx
rm -f src/App.test.tsx
rm -f src/setupTests.ts

# Remove debug and development files
echo "Removing debug files..."
rm -f browser-test.html
rm -f debug-console-logs.html
rm -f debug-gallery-steps.html
rm -f photo-update-guide.html
rm -f test-gallery-in-browser.html
rm -f scripts/debugCurrentData.js
rm -f scripts/testCurrentSheet.js
rm -f scripts/testSetup.js

# Remove unnecessary public files
echo "Removing unnecessary public files..."
rm -f public/real-data-app.html
rm -f public/real-data.html
rm -f public/test-embed-api.html
rm -f public/test-markers.html
rm -f public/images/camper-van-original.html
rm -rf public/images/temp/

# Remove CSV data files (keeping only the main one)
echo "Removing redundant CSV files..."
rm -f builders_data_part*.csv
rm -f 50-states-builders.csv
# Keep all_builders.csv and public/all_builders.csv as they might be used

# Remove unused scripts
echo "Removing unused scripts..."
rm -f RESTORE_GOOGLE_SHEETS.sh

# Remove empty favicon
echo "Fixing favicon..."
rm -f public/favicon-32x32.png

echo "✅ Cleanup complete!"
echo "📊 Project size reduced significantly"
echo "🚀 Ready for mobile compliance audit"
