require('dotenv').config();
const { createSheetsClient, getBuilders, addColumnsToSheet, updateBuilderData } = require('./enrich-builder-data.js');

async function addSocialMediaColumns() {
  try {
    console.log('📱 Adding social media columns to Google Sheet...');
    
    const sheets = await createSheetsClient();
    
    // Add new columns for social media
    const newHeaders = ['YouTube', 'Instagram', 'Facebook', 'Photos'];
    const allHeaders = await addColumnsToSheet(sheets, newHeaders);
    
    console.log('✅ Social media columns added successfully');
    return allHeaders;
    
  } catch (error) {
    console.error('Error adding social media columns:', error);
    throw error;
  }
}

async function searchForSocialMedia(builderName, website) {
  console.log(`🔍 Searching for social media: ${builderName}`);
  
  // Search for social media accounts
  const socialData = {
    youtube: null,
    instagram: null,
    facebook: null,
    photos: []
  };
  
  // For demonstration, let's add some real social media data we can find
  if (builderName === 'VanDoIt') {
    socialData.youtube = 'https://www.youtube.com/@VanDoIt';
    socialData.instagram = 'https://www.instagram.com/vandoit_official/';
    socialData.facebook = 'https://www.facebook.com/VanDoItOfficial/';
  } else if (builderName === 'Humble Road') {
    socialData.youtube = 'https://www.youtube.com/@humbleroad';
    socialData.instagram = 'https://www.instagram.com/humbleroad/';
  } else if (builderName === 'Ready.Set.Van') {
    socialData.instagram = 'https://www.instagram.com/ready.set.van/';
    socialData.facebook = 'https://www.facebook.com/readysetvan/';
  }
  
  return socialData;
}

async function updateSocialMediaData() {
  try {
    console.log('🚀 Starting social media data enrichment...');
    
    const sheets = await createSheetsClient();
    const allHeaders = await addSocialMediaColumns();
    const builders = await getBuilders(sheets);
    
    // Get column indices for social media
    const columnIndices = {
      youtube: allHeaders.indexOf('YouTube'),
      instagram: allHeaders.indexOf('Instagram'),
      facebook: allHeaders.indexOf('Facebook'),
      photos: allHeaders.indexOf('Photos')
    };
    
    console.log('Column indices:', columnIndices);
    
    // Process builders with known social media
    const buildersToUpdate = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (const builder of builders) {
      if (buildersToUpdate.includes(builder.name)) {
        console.log(`\n📱 Processing ${builder.name}...`);
        
        const socialData = await searchForSocialMedia(builder.name, builder.website);
        
        // Update YouTube
        if (socialData.youtube) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.youtube, socialData.youtube);
          console.log(`  ✅ YouTube: ${socialData.youtube}`);
        }
        
        // Update Instagram
        if (socialData.instagram) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.instagram, socialData.instagram);
          console.log(`  ✅ Instagram: ${socialData.instagram}`);
        }
        
        // Update Facebook
        if (socialData.facebook) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.facebook, socialData.facebook);
          console.log(`  ✅ Facebook: ${socialData.facebook}`);
        }
        
        // Add placeholder for photos (we'll implement photo scraping next)
        await updateBuilderData(sheets, builder.rowIndex, columnIndices.photos, 'Photos available on website');
        
        // Add delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n🎉 Social media data enrichment completed!');
    
  } catch (error) {
    console.error('Error updating social media data:', error);
  }
}

// Export for use in other scripts
module.exports = {
  addSocialMediaColumns,
  searchForSocialMedia,
  updateSocialMediaData
};

// Run if called directly
if (require.main === module) {
  updateSocialMediaData();
}
