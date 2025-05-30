import { Builder, Location, Review, PricingTier } from '../types';

/**
 * Fetches builder data from a Google Sheets document
 * @param sheetId The ID of the Google Sheets document
 * @param apiKey Google API key with Sheets API enabled
 * @returns Promise that resolves to an array of Builder objects
 */
export const fetchBuildersFromSheet = async (
  sheetId: string,
  apiKey: string = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
): Promise<Record<string, Builder[]>> => {
  // Enhanced logging for debugging
  console.log('🔍 Fetching builders from Google Sheet');
  console.log('📄 Sheet ID:', sheetId);
  console.log('🔑 API Key status:', apiKey ? `Available (${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)})` : 'Missing');
  
  // Force using mock data if no API key is provided
  if (!apiKey || apiKey === 'MISSING_API_KEY' || apiKey === 'YOUR_API_KEY_HERE') {
    console.error('❌ Valid Google Maps API key is required for Google Sheets integration');
    throw new Error('Missing or invalid API key');
  }
  
  try {
    // Extract sheet ID from URL if full URL is provided
    const extractedSheetId = sheetId.includes('spreadsheets/d/') 
      ? sheetId.split('spreadsheets/d/')[1].split('/')[0]
      : sheetId;
    
    // Fetch the sheet data - using the correct sheet name 'van'
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${extractedSheetId}/values/van?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Based on our analysis, the data format is:
    // Row 0: [] (empty)
    // Row 1: ['```'] (markdown marker)
    // Row 2: ['Company Name', 'Location', 'Description'] (actual headers)
    // Row 3+: Actual data rows
    
    if (rows.length < 4) { // Need at least empty row, markdown marker, headers, and one data row
      throw new Error('Sheet has insufficient data');
    }
    
    // Row 2 contains the actual headers
    const headers = rows[2];
    console.log('Using headers:', headers);
    
    // Group builders by state
    const buildersByState: Record<string, Builder[]> = {};
    
    // Process each row (start from row 3, which is the first data row)
    for (let i = 3; i < rows.length; i++) {
      const row = rows[i];
      if (!row.length) continue; // Skip empty rows
      
      // Create a simple builder object based on the format we observed
      const builder: Builder = {
        id: `nj-${i-2}`, // Generate an ID based on row index
        name: row[0] || 'Unknown Builder', // Company Name
        address: row[1] || 'New Jersey', // Location
        description: row[2] || '', // Description
        location: {
          lat: 40.0583, // Default to central NJ coordinates
          lng: -74.1371,
          city: 'Brick',
          state: 'New Jersey',
          zip: '08723'
        },
        phone: '(732) 555-1234', // Default phone
        email: 'info@example.com', // Default email
        website: 'https://example.com',
        rating: 4.5, // Default rating
        reviewCount: 10, // Default review count
        reviews: [],
        vanTypes: ['Sprinter', 'Transit', 'Promaster'], // Default van types
        priceRange: { min: 35000, max: 120000 }, // Default price range
        pricingTiers: generatePricingTiersForBuilder({ priceRange: { min: 35000, max: 120000 } } as Builder),
        amenities: ['Solar Power', 'Kitchen', 'Bathroom'], // Default amenities
        services: ['Custom Builds', 'Electrical', 'Plumbing'], // Default services
        yearsInBusiness: 5, // Default years in business
        leadTime: '3-6 months' // Default lead time
      };
      
      // Extract city/state from location field (format: "City, State")
      if (row[1]) {
        const locationParts = row[1].split(',');
        if (locationParts.length >= 2) {
          builder.location.city = locationParts[0].trim();
          builder.location.state = locationParts[1].trim();
        }
      }
      
      // Group by state (use 'New Jersey' as default if not specified)
      const state = 'New Jersey';
      if (!buildersByState[state]) {
        buildersByState[state] = [];
      }
      buildersByState[state].push(builder);
    }
    
    // Log the number of builders found
    console.log('Builders found:', Object.keys(buildersByState).map(state => 
      `${state}: ${buildersByState[state].length} builders`
    ).join(', '));
    
    // If no builders were found, throw an error
    if (Object.keys(buildersByState).length === 0) {
      throw new Error('No builders found in the sheet');
    }
    
    return buildersByState;
  } catch (error) {
    console.error('Error fetching builders from Google Sheet:', error);
    throw error;
  }
};

/**
 * Parses a row from the Google Sheet into a Builder object
 * @param row The row data from the sheet
 * @param headers The header row from the sheet
 * @returns A Builder object
 */
const parseBuilderFromRow = (row: any[], headers: string[]): Builder => {
  // Create an object mapping headers to values
  const rowData: Record<string, any> = {};
  headers.forEach((header, index) => {
    if (index < row.length) {
      rowData[header] = row[index];
    } else {
      rowData[header] = ''; // Default for missing values
    }
  });
  
  // Parse location
  const location: Location = {
    lat: parseFloat(rowData['Latitude'] || '0'),
    lng: parseFloat(rowData['Longitude'] || '0'),
    city: rowData['City'] || '',
    state: rowData['State'] || '',
    zip: rowData['Zip'] || ''
  };
  
  // Parse price range
  const priceRange = {
    min: parseInt(rowData['PriceMin'] || '0', 10),
    max: parseInt(rowData['PriceMax'] || '0', 10)
  };
  
  // Parse arrays
  const vanTypes = rowData['VanTypes'] ? rowData['VanTypes'].split(',').map((t: string) => t.trim()) : [];
  const amenities = rowData['Amenities'] ? rowData['Amenities'].split(',').map((a: string) => a.trim()) : [];
  const services = rowData['Services'] ? rowData['Services'].split(',').map((s: string) => s.trim()) : [];
  const certifications = rowData['Certifications'] ? rowData['Certifications'].split(',').map((c: string) => c.trim()) : [];
  
  // Parse social media
  const socialMedia = {
    facebook: rowData['Facebook'] || '',
    instagram: rowData['Instagram'] || '',
    youtube: rowData['YouTube'] || '',
    pinterest: rowData['Pinterest'] || '',
    tiktok: rowData['TikTok'] || ''
  };
  
  // Parse gallery
  const gallery = rowData['Gallery'] ? rowData['Gallery'].split(',').map((url: string) => url.trim()) : [];
  
  // Create builder object
  const builder: Builder = {
    id: rowData['ID'] || `${rowData['State']}-${Date.now()}`,
    name: rowData['Name'] || '',
    address: rowData['Address'] || '',
    phone: rowData['Phone'] || '',
    email: rowData['Email'] || '',
    website: rowData['Website'] || '',
    location,
    description: rowData['Description'] || '',
    rating: parseFloat(rowData['Rating'] || '0'),
    reviewCount: parseInt(rowData['ReviewCount'] || '0', 10),
    reviews: [], // Reviews would need to be in a separate sheet or handled separately
    vanTypes,
    priceRange,
    amenities,
    services,
    certifications,
    yearsInBusiness: parseInt(rowData['YearsInBusiness'] || '0', 10),
    socialMedia,
    gallery,
    leadTime: rowData['LeadTime'] || ''
  };
  
  return builder;
};

/**
 * Generates sample pricing tiers for a builder based on their price range
 * @param builder The builder to generate pricing tiers for
 * @returns An array of PricingTier objects
 */
export const generatePricingTiersForBuilder = (builder: Builder): PricingTier[] => {
  if (!builder.priceRange) return [];
  
  const basePrice = Math.floor((builder.priceRange.min + builder.priceRange.max) / 2);
  
  return [
    {
      name: 'Basic',
      price: Math.round(basePrice * 0.7),
      description: 'Essential features for your van conversion',
      features: [
        'Basic insulation',
        'Standard bed platform',
        'Basic electrical system',
        'Minimal storage',
      ],
    },
    {
      name: 'Standard',
      price: basePrice,
      description: 'Most popular choice for van life',
      features: [
        'Premium insulation',
        'Custom cabinetry',
        'Solar power system',
        'Kitchenette',
        'Water system',
      ],
    },
    {
      name: 'Premium',
      price: Math.round(basePrice * 1.3),
      description: 'Luxury conversion with all the amenities',
      features: [
        'High-end finishes',
        'Full kitchen with appliances',
        'Bathroom with shower',
        'Advanced electrical system',
        'Custom storage solutions',
      ],
    },
  ];
};
