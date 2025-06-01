#!/bin/bash

echo "🚨 RESTORING TO GOOGLE SHEETS WORKING STATE 🚨"
echo "This will restore the fully working Google Sheets integration"
echo "with all 13 New Jersey builders and complete UI."
echo ""

read -p "Are you sure you want to restore? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Restoring from backup..."
    
    # Remove current src directory
    rm -rf src/
    
    # Restore from backup
    cp -r backup-google-sheets-working/src .
    cp backup-google-sheets-working/.env . 2>/dev/null || echo "No .env to restore"
    cp backup-google-sheets-working/package.json .
    cp backup-google-sheets-working/package-lock.json .
    
    echo "✅ Restoration complete!"
    echo "📋 Backup info:"
    cat backup-google-sheets-working/BACKUP_INFO.txt
    echo ""
    echo "🚀 Run 'npm start' to launch the restored Google Sheets version"
else
    echo "Restoration cancelled."
fi
