#!/usr/bin/env node

// Script to identify which Google Cloud project your API key belongs to
require('dotenv').config();

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

console.log('🔍 Checking which Google Cloud project your API key belongs to...');
console.log('🔑 API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 6)}` : 'Missing');

async function checkAPIKeyProject() {
  if (!API_KEY) {
    console.error('❌ No API key found in environment variables');
    return;
  }

  try {
    // Try to make a simple request that will show us the project info in the error
    const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/test?key=${API_KEY}`;
    const response = await fetch(testUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText);
      
      if (errorData.error && errorData.error.details) {
        const projectInfo = errorData.error.details.find(detail => 
          detail.metadata && detail.metadata.consumer
        );
        
        if (projectInfo) {
          const projectId = projectInfo.metadata.consumer.replace('projects/', '');
          console.log('📋 Your API key belongs to project ID:', projectId);
          
          // Check if Sheets API is enabled for this project
          if (errorData.error.message.includes('Google Sheets API has not been used')) {
            console.log('❌ Google Sheets API is NOT enabled for this project');
            console.log('🔧 Enable it here:', `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectId}`);
          } else if (errorData.error.message.includes('SERVICE_DISABLED')) {
            console.log('❌ Google Sheets API is disabled for this project');
            console.log('🔧 Enable it here:', `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectId}`);
          } else {
            console.log('✅ Google Sheets API appears to be enabled');
          }
        }
      }
      
      console.log('\n📊 Full error details:');
      console.log(JSON.stringify(errorData, null, 2));
    }
    
  } catch (error) {
    console.error('🚨 Error checking API key:', error.message);
  }
}

async function listYourProjects() {
  console.log('\n🏗️ To see all your Google Cloud projects:');
  console.log('1. Go to: https://console.cloud.google.com/');
  console.log('2. Click the project dropdown at the top');
  console.log('3. You should see both "My First Project" and "Camper-van-builders"');
  console.log('\n💡 Recommendations:');
  console.log('Option A: Enable Google Sheets API for your current project (973513302562)');
  console.log('Option B: Create a new API key from the "Camper-van-builders" project');
  console.log('Option C: Use the "Camper-van-builders" project and enable Sheets API there');
}

checkAPIKeyProject().then(() => {
  listYourProjects();
});
