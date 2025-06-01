/**
 * Extract 4-8 high-quality photos per builder from their websites
 */

const { google } = require('googleapis');
const fetch = require('node-fetch');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// Enhanced builder sites with more comprehensive photo extraction
const BUILDER_SITES = {
  'VanDoIt': {
    urls: [
      'https://vandoit.com/about-us/photos/',
      'https://vandoit.com/gallery/',
      'https://vandoit.com/builds/'
    ],
    searchPatterns: [
      /https:\/\/vandoit\.com\/wp-content\/uploads\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi,
      /\/wp-content\/uploads\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    ],
    excludePatterns: [
      /favicon/i,
      /logo/i,
      /icon/i,
      /32x32/i,
      /192x192/i,
      /cropped/i
    ]
  },
  'Humble Road': {
    urls: [
      'https://www.humbleroad.tv/van01',
      'https://www.humbleroad.tv/gallery',
      'https://www.humbleroad.tv/builds'
    ],
    searchPatterns: [
      /https:\/\/images\.squarespace-cdn\.com\/content\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    ],
    excludePatterns: [
      /logo/i,
      /favicon/i,
      /icon/i,
      /thumb/i
    ]
  },
  'Ready.Set.Van': {
    urls: [
      'https://www.readysetvan.com/gramercy',
      'https://www.readysetvan.com/builds',
      'https://www.readysetvan.com/gallery'
    ],
    searchPatterns: [
      /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    ],
    excludePatterns: [
      /logo/i,
      /favicon/i,
      /icon/i,
      /RSV_logo/i,
      /Untitled/i
    ]
  }
};

async function extractPhotosFromMultiplePages(builderName, siteInfo) {
  const allPhotos = new Set();
  
  console.log(`🔍 Extracting photos from ${builderName} (${siteInfo.urls.length} pages)...`);
  
  for (const url of siteInfo.urls) {
    try {
      console.log(`   📄 Checking: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      if (!response.ok) {
        console.log(`   ⚠️ ${url} returned ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      console.log(`   📥 Downloaded ${html.length} characters`);
      
      // Extract images using patterns
      siteInfo.searchPatterns.forEach(pattern => {
        const matches = html.match(pattern) || [];
        matches.forEach(match => {
          let cleanUrl = match.replace(/['"]/g, '');
          
          // Make relative URLs absolute
          if (cleanUrl.startsWith('/')) {
            const baseUrl = new URL(url).origin;
            cleanUrl = baseUrl + cleanUrl;
          }
          
          // Check if URL should be excluded
          const shouldExclude = siteInfo.excludePatterns.some(excludePattern => 
            excludePattern.test(cleanUrl)
          );
          
          if (!shouldExclude) {
            allPhotos.add(cleanUrl);
          }
        });
      });
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.log(`   ❌ Error fetching ${url}: ${error.message}`);
    }
  }
  
  const photoArray = Array.from(allPhotos);
  console.log(`   ✅ Found ${photoArray.length} unique photos`);
  
  // Return 4-8 photos, prioritizing larger/higher quality images
  const selectedPhotos = photoArray
    .filter(url => !url.includes('thumb') && !url.includes('small'))
    .slice(0, 8);
  
  console.log(`   🎯 Selected ${selectedPhotos.length} photos for gallery`);
  selectedPhotos.forEach((photo, i) => {
    console.log(`     ${i + 1}. ${photo.substring(photo.lastIndexOf('/') + 1)}`);
  });
  
  return selectedPhotos;
}

async function updateGoogleSheetsWithMorePhotos() {
  try {
    console.log('🔧 Setting up Google Sheets API...');
    
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('📊 Reading current builder data...');
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const rows = response.data.values;
    console.log(`📋 Found ${rows.length} rows of data`);
    
    const updates = [];
    
    for (const [builderName, siteInfo] of Object.entries(BUILDER_SITES)) {
      console.log(`\n🎯 Processing ${builderName}...`);
      
      // Extract photos from multiple pages
      const photos = await extractPhotosFromMultiplePages(builderName, siteInfo);
      
      if (photos.length >= 4) {
        // Find the row for this builder
        const rowIndex = rows.findIndex(row => row[1] === builderName);
        
        if (rowIndex > 0) {
          const photoUrls = photos.join(', ');
          console.log(`✅ Preparing update for ${builderName} (Row ${rowIndex + 1})`);
          console.log(`   ${photos.length} photos ready for gallery`);
          
          updates.push({
            range: `${SHEET_NAME}!L${rowIndex + 1}`,
            values: [[photoUrls]]
          });
        } else {
          console.log(`❌ Could not find ${builderName} in sheet`);
        }
      } else {
        console.log(`⚠️ Only found ${photos.length} photos for ${builderName} (minimum 4 required)`);
      }
    }
    
    if (updates.length === 0) {
      console.log('\n❌ No photo updates to apply');
      return;
    }
    
    console.log(`\n🚀 Applying ${updates.length} photo updates to Google Sheets...`);
    
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
        const photoCount = builderRow[11].split(',').length;
        console.log(`✅ ${builderName}: ${photoCount} photos updated`);
      }
    });
    
    console.log('\n🎉 Enhanced photo galleries successfully updated!');
    console.log('   Each builder now has 4-8 high-quality photos');
    console.log('   Refresh your React app to see the expanded galleries');
    
  } catch (error) {
    console.error('❌ Error updating with more photos:', error.message);
  }
}

console.log('📸 Starting enhanced photo extraction (4-8 photos per builder)...\n');
updateGoogleSheetsWithMorePhotos();
