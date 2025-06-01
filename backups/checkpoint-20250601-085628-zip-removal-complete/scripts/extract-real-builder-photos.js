/**
 * Extract real photos from builder websites and update Google Sheets
 */

const { google } = require('googleapis');
const fetch = require('node-fetch');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// Builder websites to scrape for photos
const BUILDER_SITES = {
  'VanDoIt': {
    url: 'https://vandoit.com/about-us/photos/',
    searchPatterns: [
      /https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi,
      /\/wp-content\/uploads\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    ]
  },
  'Humble Road': {
    url: 'https://www.humbleroad.tv/van01',
    searchPatterns: [
      /https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi,
      /\/images\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    ]
  },
  'Ready.Set.Van': {
    url: 'https://www.readysetvan.com/gramercy',
    searchPatterns: [
      /https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi,
      /\/assets\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    ]
  }
};

async function extractPhotosFromWebsite(builderName, siteInfo) {
  try {
    console.log(`🔍 Extracting photos from ${builderName} website...`);
    console.log(`   URL: ${siteInfo.url}`);
    
    const response = await fetch(siteInfo.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`   Downloaded ${html.length} characters of HTML`);
    
    // Extract image URLs using patterns
    const foundImages = new Set();
    
    siteInfo.searchPatterns.forEach(pattern => {
      const matches = html.match(pattern) || [];
      matches.forEach(match => {
        // Clean up the URL
        let cleanUrl = match.replace(/['"]/g, '');
        
        // Make relative URLs absolute
        if (cleanUrl.startsWith('/')) {
          const baseUrl = new URL(siteInfo.url).origin;
          cleanUrl = baseUrl + cleanUrl;
        }
        
        // Filter for likely van conversion photos (avoid logos, icons, etc.)
        if (cleanUrl.includes('van') || 
            cleanUrl.includes('conversion') || 
            cleanUrl.includes('interior') || 
            cleanUrl.includes('build') ||
            cleanUrl.match(/\d{4}/) || // Year in filename
            cleanUrl.length > 50) { // Longer URLs likely to be actual photos
          foundImages.add(cleanUrl);
        }
      });
    });
    
    const imageArray = Array.from(foundImages).slice(0, 3); // Take first 3 images
    console.log(`   Found ${imageArray.length} potential van photos:`);
    imageArray.forEach((img, i) => console.log(`     ${i + 1}. ${img}`));
    
    return imageArray;
    
  } catch (error) {
    console.error(`❌ Error extracting photos from ${builderName}: ${error.message}`);
    return [];
  }
}

async function updateGoogleSheetsWithRealPhotos() {
  try {
    console.log('🔧 Setting up Google Sheets API...');
    
    // Parse credentials from temp file
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    // Create JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('📊 Reading current builder data...');
    
    // Read current data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const rows = response.data.values;
    console.log(`📋 Found ${rows.length} rows of data`);
    
    // Extract photos for each builder
    const updates = [];
    
    for (const [builderName, siteInfo] of Object.entries(BUILDER_SITES)) {
      console.log(`\n🎯 Processing ${builderName}...`);
      
      // Extract photos from website
      const photos = await extractPhotosFromWebsite(builderName, siteInfo);
      
      if (photos.length > 0) {
        // Find the row for this builder
        const rowIndex = rows.findIndex(row => row[1] === builderName);
        
        if (rowIndex > 0) { // Skip header row
          const photoUrls = photos.slice(0, 2).join(', '); // Take first 2 photos
          console.log(`✅ Preparing update for ${builderName} (Row ${rowIndex + 1})`);
          console.log(`   Photos: ${photoUrls}`);
          
          updates.push({
            range: `${SHEET_NAME}!L${rowIndex + 1}`,
            values: [[photoUrls]]
          });
        } else {
          console.log(`❌ Could not find ${builderName} in sheet`);
        }
      } else {
        console.log(`⚠️ No photos found for ${builderName}`);
      }
      
      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    if (updates.length === 0) {
      console.log('\n❌ No photo updates to apply');
      return;
    }
    
    console.log(`\n🚀 Applying ${updates.length} photo updates to Google Sheets...`);
    
    // Apply all updates
    const updateResponse = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log(`✅ Successfully updated ${updateResponse.data.totalUpdatedCells} cells!`);
    
    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const verifyRows = verifyResponse.data.values;
    Object.keys(BUILDER_SITES).forEach(builderName => {
      const builderRow = verifyRows.find(row => row[1] === builderName);
      if (builderRow && builderRow[11]) {
        console.log(`✅ ${builderName}: Updated with real photos`);
        console.log(`   URLs: ${builderRow[11].substring(0, 100)}...`);
      }
    });
    
    console.log('\n🎉 Real builder photos successfully extracted and updated!');
    console.log('   Refresh your React app to see the actual builder photos.');
    
  } catch (error) {
    console.error('❌ Error updating with real photos:', error.message);
  }
}

console.log('📸 Starting real builder photo extraction...\n');
updateGoogleSheetsWithRealPhotos();
