# 🤖 Builder Data Enrichment Tool

## What This Does
This tool automatically researches your camper van builders using Google Places API and enhances the data with AI. It will find:

- ✅ **Verified addresses** (for accurate map markers)
- ✅ **Phone numbers & websites**
- ✅ **Business hours & ratings**
- ✅ **Customer reviews**
- ✅ **Exact coordinates** (latitude/longitude)

## 🚀 Quick Start (Beginner-Friendly!)

### Step 1: Install Required Packages
```bash
cd /home/ron/Dev/Test/camper-van-builders
npm install axios dotenv
```

### Step 2: Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Places API**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### Step 3: Set Up Your API Key
Create a `.env` file in your project root:
```bash
# Add this to your .env file
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

### Step 4: Add Your Builder Names
Edit `scripts/enrichBuilderData.js` and replace the sample data with your actual builders:

```javascript
const BUILDERS_TO_RESEARCH = [
  { name: "Your Builder Name 1", state: "New Jersey" },
  { name: "Your Builder Name 2", state: "New Jersey" },
  // Add all your builders here...
];
```

### Step 5: Run the Tool
```bash
node scripts/enrichBuilderData.js
```

## 📊 What You'll Get

The tool will output enriched data like this:
```json
{
  "name": "Sequoia + Salt",
  "address": "123 Main St, Brick, NJ 08723",
  "phone": "(732) 555-1234",
  "website": "https://sequoiaandsalt.com",
  "latitude": 40.0583,
  "longitude": -74.1371,
  "rating": 4.8,
  "reviewCount": 25,
  "recentReviews": [...]
}
```

## 🔄 Next Steps

1. **Copy the output** to your Google Sheets
2. **Add new columns** for the enriched data
3. **Update your app** to use the new coordinates
4. **See all markers** appear on your map!

## 🆘 Need Help?

If you get stuck:
1. Check that your API key is correct
2. Make sure you've enabled the Places API
3. Verify your builder names are spelled correctly
4. Check the console for error messages

## 💡 Pro Tips

- The tool waits 1 second between API calls to be respectful
- It searches for "Builder Name + camper van conversion + State"
- You can modify the search query in the code if needed
- Start with 2-3 builders to test, then add more
