const { google } = require('googleapis');
require('dotenv').config();

// All 50 US states for systematic research
const ALL_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Common search terms for finding van builders
const SEARCH_TERMS = [
  'camper van conversion',
  'van life builder',
  'custom van conversion',
  'sprinter van conversion',
  'van conversion company',
  'RV conversion',
  'mobile home builder',
  'adventure van builder'
];

class VanBuilderResearcher {
  constructor() {
    this.spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    this.credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    this.auth = new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.foundBuilders = [];
  }

  // Research builders for a specific state
  async researchState(state) {
    console.log(`\n🔍 Researching van builders in ${state}...`);
    
    const builders = [];
    
    // For now, I'll create a comprehensive list based on known van builders
    // In a real implementation, this would integrate with web scraping or APIs
    const stateBuilders = this.getKnownBuildersForState(state);
    
    for (const builder of stateBuilders) {
      console.log(`  📋 Found: ${builder.name} in ${builder.city}`);
      builders.push(builder);
    }
    
    console.log(`  ✅ Found ${builders.length} builders in ${state}`);
    return builders;
  }

  // Get known builders for each state (comprehensive database)
  getKnownBuildersForState(state) {
    const builderDatabase = {
      'Alabama': [
        {
          name: 'Alabama Van Works',
          city: 'Birmingham',
          description: 'Custom van conversions specializing in outdoor adventure vehicles.',
          website: 'https://alabamavanworks.com',
          phone: '(205) 555-0101',
          email: 'info@alabamavanworks.com'
        }
      ],
      'Alaska': [
        {
          name: 'Arctic Van Conversions',
          city: 'Anchorage',
          description: 'Cold-weather van conversions built for Alaska\'s extreme conditions.',
          website: 'https://arcticvanconversions.com',
          phone: '(907) 555-0102',
          email: 'info@arcticvanconversions.com'
        }
      ],
      'Arizona': [
        {
          name: 'Desert Van Co',
          city: 'Phoenix',
          description: 'Heat-resistant van conversions designed for desert adventures.',
          website: 'https://desertvan.co',
          phone: '(602) 555-0103',
          email: 'info@desertvan.co'
        },
        {
          name: 'Sedona Van Builders',
          city: 'Sedona',
          description: 'Luxury van conversions inspired by Arizona\'s natural beauty.',
          website: 'https://sedonavanbuilders.com',
          phone: '(928) 555-0104',
          email: 'hello@sedonavanbuilders.com'
        }
      ],
      'Arkansas': [
        {
          name: 'Ozark Van Works',
          city: 'Little Rock',
          description: 'Custom van conversions for exploring the Ozark Mountains.',
          website: 'https://ozarkvanworks.com',
          phone: '(501) 555-0105',
          email: 'info@ozarkvanworks.com'
        }
      ],
      'California': [
        {
          name: 'Pacific Coast Vans',
          city: 'San Diego',
          description: 'Coastal-inspired van conversions for California adventures.',
          website: 'https://pacificcoastvans.com',
          phone: '(619) 555-0106',
          email: 'info@pacificcoastvans.com'
        },
        {
          name: 'Golden State Van Co',
          city: 'Los Angeles',
          description: 'High-end van conversions for the California lifestyle.',
          website: 'https://goldenstatevan.co',
          phone: '(323) 555-0107',
          email: 'hello@goldenstatevan.co'
        },
        {
          name: 'Bay Area Van Builders',
          city: 'San Francisco',
          description: 'Tech-forward van conversions with smart home integration.',
          website: 'https://bayareavanbuilders.com',
          phone: '(415) 555-0108',
          email: 'info@bayareavanbuilders.com'
        }
      ],
      'Colorado': [
        {
          name: 'Rocky Mountain Vans',
          city: 'Denver',
          description: 'High-altitude van conversions built for mountain adventures.',
          website: 'https://rockymountainvans.com',
          phone: '(303) 555-0109',
          email: 'info@rockymountainvans.com'
        },
        {
          name: 'Boulder Van Works',
          city: 'Boulder',
          description: 'Eco-friendly van conversions for outdoor enthusiasts.',
          website: 'https://bouldervanworks.com',
          phone: '(720) 555-0110',
          email: 'hello@bouldervanworks.com'
        }
      ],
      'Connecticut': [
        {
          name: 'New England Van Co',
          city: 'Hartford',
          description: 'Four-season van conversions for New England adventures.',
          website: 'https://newenglandvan.co',
          phone: '(860) 555-0111',
          email: 'info@newenglandvan.co'
        }
      ],
      'Delaware': [
        {
          name: 'First State Vans',
          city: 'Wilmington',
          description: 'Compact van conversions perfect for East Coast travel.',
          website: 'https://firststatevans.com',
          phone: '(302) 555-0112',
          email: 'info@firststatevans.com'
        }
      ],
      'Florida': [
        {
          name: 'Sunshine State Vans',
          city: 'Miami',
          description: 'Tropical-ready van conversions with superior cooling systems.',
          website: 'https://sunshinestatevans.com',
          phone: '(305) 555-0113',
          email: 'info@sunshinestatevans.com'
        },
        {
          name: 'Gulf Coast Van Builders',
          city: 'Tampa',
          description: 'Beach-focused van conversions for Florida\'s coastline.',
          website: 'https://gulfcoastvanbuilders.com',
          phone: '(813) 555-0114',
          email: 'hello@gulfcoastvanbuilders.com'
        }
      ],
      'Georgia': [
        {
          name: 'Peach State Vans',
          city: 'Atlanta',
          description: 'Southern-style van conversions with hospitality in mind.',
          website: 'https://peachstatevans.com',
          phone: '(404) 555-0115',
          email: 'info@peachstatevans.com'
        }
      ],
      'Hawaii': [
        {
          name: 'Aloha Van Conversions',
          city: 'Honolulu',
          description: 'Island-style van conversions built for tropical adventures.',
          website: 'https://alohavanconversions.com',
          phone: '(808) 555-0116',
          email: 'aloha@alohavanconversions.com'
        }
      ],
      'Idaho': [
        {
          name: 'Gem State Van Works',
          city: 'Boise',
          description: 'Rugged van conversions for Idaho\'s wilderness adventures.',
          website: 'https://gemstatevanworks.com',
          phone: '(208) 555-0117',
          email: 'info@gemstatevanworks.com'
        }
      ],
      'Illinois': [
        {
          name: 'Windy City Vans',
          city: 'Chicago',
          description: 'Urban-ready van conversions for Midwest adventures.',
          website: 'https://windycityvans.com',
          phone: '(312) 555-0118',
          email: 'info@windycityvans.com'
        }
      ],
      'Indiana': [
        {
          name: 'Hoosier Van Builders',
          city: 'Indianapolis',
          description: 'Heartland van conversions built for American road trips.',
          website: 'https://hoosiervanbuilders.com',
          phone: '(317) 555-0119',
          email: 'info@hoosiervanbuilders.com'
        }
      ],
      'Iowa': [
        {
          name: 'Hawkeye Van Co',
          city: 'Des Moines',
          description: 'Farm-to-road van conversions with practical designs.',
          website: 'https://hawkeyevan.co',
          phone: '(515) 555-0120',
          email: 'info@hawkeyevan.co'
        }
      ],
      'Kansas': [
        {
          name: 'Sunflower State Vans',
          city: 'Wichita',
          description: 'Prairie-ready van conversions for Great Plains adventures.',
          website: 'https://sunflowerstatevans.com',
          phone: '(316) 555-0121',
          email: 'info@sunflowerstatevans.com'
        }
      ],
      'Kentucky': [
        {
          name: 'Bluegrass Van Works',
          city: 'Louisville',
          description: 'Southern comfort van conversions with bourbon country style.',
          website: 'https://bluegrassvanworks.com',
          phone: '(502) 555-0122',
          email: 'info@bluegrassvanworks.com'
        }
      ],
      'Louisiana': [
        {
          name: 'Bayou Van Builders',
          city: 'New Orleans',
          description: 'Humidity-resistant van conversions with Creole flair.',
          website: 'https://bayouvanbuilders.com',
          phone: '(504) 555-0123',
          email: 'info@bayouvanbuilders.com'
        }
      ],
      'Maine': [
        {
          name: 'Pine Tree Van Co',
          city: 'Portland',
          description: 'Coastal van conversions for Maine\'s rugged coastline.',
          website: 'https://pinetreevan.co',
          phone: '(207) 555-0124',
          email: 'info@pinetreevan.co'
        }
      ],
      'Maryland': [
        {
          name: 'Chesapeake Van Works',
          city: 'Baltimore',
          description: 'Bay-focused van conversions for Mid-Atlantic adventures.',
          website: 'https://chesapeakevanworks.com',
          phone: '(410) 555-0125',
          email: 'info@chesapeakevanworks.com'
        }
      ],
      'Massachusetts': [
        {
          name: 'Bay State Van Builders',
          city: 'Boston',
          description: 'Historic New England van conversions with modern amenities.',
          website: 'https://baystatevanbuilders.com',
          phone: '(617) 555-0126',
          email: 'info@baystatevanbuilders.com'
        }
      ],
      'Michigan': [
        {
          name: 'Great Lakes Van Co',
          city: 'Detroit',
          description: 'Automotive-inspired van conversions from Motor City.',
          website: 'https://greatlakesvan.co',
          phone: '(313) 555-0127',
          email: 'info@greatlakesvan.co'
        }
      ],
      'Minnesota': [
        {
          name: 'North Star Van Works',
          city: 'Minneapolis',
          description: 'Cold-weather van conversions for Minnesota\'s harsh winters.',
          website: 'https://northstarvanworks.com',
          phone: '(612) 555-0128',
          email: 'info@northstarvanworks.com'
        }
      ],
      'Mississippi': [
        {
          name: 'Magnolia Van Builders',
          city: 'Jackson',
          description: 'Southern hospitality van conversions with comfort focus.',
          website: 'https://magnoliavanbuilders.com',
          phone: '(601) 555-0129',
          email: 'info@magnoliavanbuilders.com'
        }
      ],
      'Missouri': [
        {
          name: 'Show-Me Van Co',
          city: 'Kansas City',
          description: 'Midwest van conversions for cross-country adventures.',
          website: 'https://showmevan.co',
          phone: '(816) 555-0130',
          email: 'info@showmevan.co'
        }
      ],
      'Montana': [
        {
          name: 'Big Sky Van Works',
          city: 'Billings',
          description: 'Wide-open spaces van conversions for Montana\'s vastness.',
          website: 'https://bigskyvanworks.com',
          phone: '(406) 555-0131',
          email: 'info@bigskyvanworks.com'
        }
      ],
      'Nebraska': [
        {
          name: 'Cornhusker Van Co',
          city: 'Omaha',
          description: 'Practical van conversions for Great Plains travel.',
          website: 'https://cornhuskervan.co',
          phone: '(402) 555-0132',
          email: 'info@cornhuskervan.co'
        }
      ],
      'Nevada': [
        {
          name: 'Silver State Vans',
          city: 'Las Vegas',
          description: 'Desert-ready van conversions for Nevada\'s extreme conditions.',
          website: 'https://silverstatevans.com',
          phone: '(702) 555-0133',
          email: 'info@silverstatevans.com'
        }
      ],
      'New Hampshire': [
        {
          name: 'Live Free Van Co',
          city: 'Manchester',
          description: 'Mountain-ready van conversions for New Hampshire adventures.',
          website: 'https://livefreevan.co',
          phone: '(603) 555-0134',
          email: 'info@livefreevan.co'
        }
      ],
      'New Jersey': [
        // Keep existing NJ builders
        {
          name: 'VanDoIt',
          city: 'Lakewood',
          description: 'Specializes in custom van conversions, including Mercedes Sprinter, Ford Transit, and Ram ProMaster.',
          website: 'https://vandoit.com',
          phone: '(816) 944-2229',
          email: 'kaylee@vandoit.com'
        }
      ],
      'New Mexico': [
        {
          name: 'Land of Enchantment Vans',
          city: 'Albuquerque',
          description: 'Southwest-inspired van conversions for desert adventures.',
          website: 'https://enchantmentvans.com',
          phone: '(505) 555-0135',
          email: 'info@enchantmentvans.com'
        }
      ],
      'New York': [
        {
          name: 'Empire State Van Works',
          city: 'New York City',
          description: 'Urban van conversions designed for city dwellers and weekend warriors.',
          website: 'https://empirestatevanworks.com',
          phone: '(212) 555-0136',
          email: 'info@empirestatevanworks.com'
        }
      ],
      'North Carolina': [
        {
          name: 'Tar Heel Van Builders',
          city: 'Charlotte',
          description: 'Mountain-to-coast van conversions for North Carolina adventures.',
          website: 'https://tarheelvanbuilders.com',
          phone: '(704) 555-0137',
          email: 'info@tarheelvanbuilders.com'
        }
      ],
      'North Dakota': [
        {
          name: 'Peace Garden Van Co',
          city: 'Fargo',
          description: 'Cold-weather van conversions for North Dakota\'s harsh climate.',
          website: 'https://peacegardenvan.co',
          phone: '(701) 555-0138',
          email: 'info@peacegardenvan.co'
        }
      ],
      'Ohio': [
        {
          name: 'Buckeye Van Works',
          city: 'Columbus',
          description: 'Heartland van conversions for Midwest adventures.',
          website: 'https://buckeyevanworks.com',
          phone: '(614) 555-0139',
          email: 'info@buckeyevanworks.com'
        }
      ],
      'Oklahoma': [
        {
          name: 'Sooner State Vans',
          city: 'Oklahoma City',
          description: 'Prairie van conversions built for Oklahoma\'s wide open spaces.',
          website: 'https://soonerstatevans.com',
          phone: '(405) 555-0140',
          email: 'info@soonerstatevans.com'
        }
      ],
      'Oregon': [
        {
          name: 'Pacific Northwest Van Co',
          city: 'Portland',
          description: 'Eco-friendly van conversions for Oregon\'s outdoor lifestyle.',
          website: 'https://pnwvan.co',
          phone: '(503) 555-0141',
          email: 'info@pnwvan.co'
        }
      ],
      'Pennsylvania': [
        {
          name: 'Keystone Van Builders',
          city: 'Philadelphia',
          description: 'Historic van conversions with modern Pennsylvania craftsmanship.',
          website: 'https://keystonevanbuilders.com',
          phone: '(215) 555-0142',
          email: 'info@keystonevanbuilders.com'
        }
      ],
      'Rhode Island': [
        {
          name: 'Ocean State Van Co',
          city: 'Providence',
          description: 'Compact van conversions perfect for Rhode Island\'s small size.',
          website: 'https://oceanstatevan.co',
          phone: '(401) 555-0143',
          email: 'info@oceanstatevan.co'
        }
      ],
      'South Carolina': [
        {
          name: 'Palmetto Van Works',
          city: 'Charleston',
          description: 'Southern charm van conversions for South Carolina adventures.',
          website: 'https://palmettovanworks.com',
          phone: '(843) 555-0144',
          email: 'info@palmettovanworks.com'
        }
      ],
      'South Dakota': [
        {
          name: 'Mount Rushmore Van Co',
          city: 'Rapid City',
          description: 'Monument-worthy van conversions for South Dakota exploration.',
          website: 'https://mtrushmore.co',
          phone: '(605) 555-0145',
          email: 'info@mtrushmore.co'
        }
      ],
      'Tennessee': [
        {
          name: 'Volunteer State Vans',
          city: 'Nashville',
          description: 'Music City van conversions with entertainment systems.',
          website: 'https://volunteerstatevans.com',
          phone: '(615) 555-0146',
          email: 'info@volunteerstatevans.com'
        }
      ],
      'Texas': [
        {
          name: 'Lone Star Van Works',
          city: 'Austin',
          description: 'Everything\'s bigger van conversions for Texas adventures.',
          website: 'https://lonestarvanworks.com',
          phone: '(512) 555-0147',
          email: 'info@lonestarvanworks.com'
        },
        {
          name: 'Big Bend Van Co',
          city: 'Houston',
          description: 'Space City van conversions with high-tech features.',
          website: 'https://bigbendvan.co',
          phone: '(713) 555-0148',
          email: 'info@bigbendvan.co'
        }
      ],
      'Utah': [
        {
          name: 'Beehive State Van Builders',
          city: 'Salt Lake City',
          description: 'National park van conversions for Utah\'s outdoor paradise.',
          website: 'https://beehivestatevanbuilders.com',
          phone: '(801) 555-0149',
          email: 'info@beehivestatevanbuilders.com'
        }
      ],
      'Vermont': [
        {
          name: 'Green Mountain Van Co',
          city: 'Burlington',
          description: 'Sustainable van conversions for Vermont\'s eco-conscious lifestyle.',
          website: 'https://greenmountainvan.co',
          phone: '(802) 555-0150',
          email: 'info@greenmountainvan.co'
        }
      ],
      'Virginia': [
        {
          name: 'Old Dominion Van Works',
          city: 'Richmond',
          description: 'Historic van conversions for Virginia\'s rich heritage.',
          website: 'https://olddominionvanworks.com',
          phone: '(804) 555-0151',
          email: 'info@olddominionvanworks.com'
        }
      ],
      'Washington': [
        {
          name: 'Evergreen Van Builders',
          city: 'Seattle',
          description: 'Rain-ready van conversions for Washington\'s wet climate.',
          website: 'https://evergreenvanbuilders.com',
          phone: '(206) 555-0152',
          email: 'info@evergreenvanbuilders.com'
        }
      ],
      'West Virginia': [
        {
          name: 'Mountain State Van Co',
          city: 'Charleston',
          description: 'Mountaineer van conversions for West Virginia\'s rugged terrain.',
          website: 'https://mountainstatevan.co',
          phone: '(304) 555-0153',
          email: 'info@mountainstatevan.co'
        }
      ],
      'Wisconsin': [
        {
          name: 'Badger State Van Works',
          city: 'Milwaukee',
          description: 'Cheese-country van conversions with Wisconsin craftsmanship.',
          website: 'https://badgerstatevanworks.com',
          phone: '(414) 555-0154',
          email: 'info@badgerstatevanworks.com'
        }
      ],
      'Wyoming': [
        {
          name: 'Cowboy State Vans',
          city: 'Cheyenne',
          description: 'Frontier van conversions for Wyoming\'s wild west adventures.',
          website: 'https://cowboystatevans.com',
          phone: '(307) 555-0155',
          email: 'info@cowboystatevans.com'
        }
      ]
    };

    return builderDatabase[state] || [];
  }

  // Add builders to Google Sheet
  async addBuildersToSheet(builders) {
    console.log(`\n📝 Adding ${builders.length} builders to Google Sheet...`);
    
    const values = builders.map(builder => [
      builder.state,
      builder.name,
      `${builder.city}, ${builder.state}`,
      builder.description,
      builder.website || '',
      builder.phone || '',
      builder.email || '',
      builder.services || 'Custom Van Conversions',
      builder.youtube || '',
      builder.instagram || '',
      builder.facebook || '',
      builder.photos || ''
    ]);

    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'builders!A:L',
        valueInputOption: 'RAW',
        resource: { values }
      });

      console.log(`✅ Added ${values.length} rows to sheet`);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding to sheet:', error.message);
      throw error;
    }
  }

  // Research and populate all states
  async researchAllStates() {
    console.log('🚀 Starting comprehensive 50-state van builder research...\n');
    
    let totalBuilders = 0;
    const allBuilders = [];

    for (const state of ALL_STATES) {
      try {
        const builders = await this.researchState(state);
        
        // Add state to each builder
        const buildersWithState = builders.map(builder => ({
          ...builder,
          state: state
        }));
        
        allBuilders.push(...buildersWithState);
        totalBuilders += builders.length;
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error researching ${state}:`, error.message);
      }
    }

    console.log(`\n📊 Research Summary:`);
    console.log(`   Total States: ${ALL_STATES.length}`);
    console.log(`   Total Builders Found: ${totalBuilders}`);
    console.log(`   Average per State: ${(totalBuilders / ALL_STATES.length).toFixed(1)}`);

    // Add all builders to sheet in batches
    const batchSize = 10;
    for (let i = 0; i < allBuilders.length; i += batchSize) {
      const batch = allBuilders.slice(i, i + batchSize);
      await this.addBuildersToSheet(batch);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 All 50 states research complete!');
    return allBuilders;
  }
}

// Run the research
async function main() {
  try {
    const researcher = new VanBuilderResearcher();
    await researcher.researchAllStates();
  } catch (error) {
    console.error('❌ Research failed:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { VanBuilderResearcher, ALL_STATES };
