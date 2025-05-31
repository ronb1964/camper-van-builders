import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  CircularProgress,
  Tabs,
  Tab,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  Snackbar,
  Alert,
  createTheme,
  PaletteMode,
  Paper
} from '@mui/material';
import { getGoogleMapsApiKey } from './utils/apiUtils';
import { scrollToElement } from './utils/scrollUtils';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import { 
  StateSelector, 
  BuilderCard, 
  BuilderModal,
  ThemeToggle,
  BackToTop,
  RecentlyViewedSection,
  SkeletonLoader,
} from './components';
import GoogleSheetBuildersList from './components/GoogleSheetBuildersList';
import SecureImage from './components/SecureImage';
import SecureMarker from './components/SecureMarker';
import { Location } from './types';
import { 
  useThemeMode, 
  useRecentlyViewed,
  useScrollToResults
} from './hooks';
import { jsonDataService } from './services/jsonDataService';
import { Builder } from './services/googleSheetsService';

const createHumbleRoadBuilder = (): Builder => ({
  id: 'nj-1',
  name: 'Humble Road',
  address: 'Brick, NJ 08723',
  phone: '(732) 555-1234',
  email: 'georgemauro@humbleroad.tv',
  website: 'https://www.humbleroad.tv',
  location: { lat: 40.0583, lng: -74.1371, city: 'Brick', state: 'NJ', zip: '08723' },
  description: 'Custom tailored camper vans built by George Mauro. Specializing in luxury conversions for full-timers and extended living in comfort. From micro-campers to full-size luxury vans.',
  rating: 4.9,
  reviewCount: 87,
  reviews: [],
  vanTypes: ['Sprinter', 'Transit', 'Promaster', 'Promaster City'],
  priceRange: { min: 38000, max: 215000 },
  pricingTiers: [],
  amenities: ['Solar Power', 'Kitchen', 'Shower', 'Toilet', 'Heating', 'Air Conditioning', 'Custom Storage'],
  services: ['Custom Builds', 'Electrical', 'Plumbing', 'Design Consultation'],
  certifications: [],
  yearsInBusiness: 5,
  leadTime: '4-8 months',
  socialMedia: {
    youtube: 'HumbleRoad',
    facebook: 'HumbleRoadLLC',
  },
  gallery: [
    'https://images.squarespace-cdn.com/content/v1/5d7f95ea7d3be50012ad8e2d/1626285444291-DSCF9146.jpg',
    'https://images.squarespace-cdn.com/content/v1/5d7f95ea7d3be50012ad8e2d/1626285444291-DSCF9147.jpg',
    'https://images.squarespace-cdn.com/content/v1/5d7f95ea7d3be50012ad8e2d/1626285444291-DSCF9148.jpg',
  ],
});

const MOCK_BUILDERS: Record<string, Builder[]> = {
  "California": [
    {
      id: 'ca-1',
      name: 'Vanlife Customs',
      address: '123 Van Street, Los Angeles, CA 90001',
      phone: '(555) 123-4567',
      email: 'info@vanlifecustoms.com',
      website: 'https://vanlifecustoms.com',
      location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', zip: '90001' },
      description: 'Custom van conversions with luxury finishes. Specializing in high-end Mercedes Sprinter builds.',
      rating: 4.8,
      reviewCount: 124,
      reviews: [],
      vanTypes: ['Sprinter', 'Transit', 'Promaster'],
      priceRange: { min: 35000, max: 120000 },
      pricingTiers: [],
      amenities: ['Solar Power', 'Kitchen', 'Bathroom', 'Heating', 'Air Conditioning'],
      services: ['Custom Builds', 'Mechanical Work', 'Electrical', 'Plumbing'],
      certifications: ['RVIA Certified', 'EPA Certified'],
      yearsInBusiness: 8,
      leadTime: '3-6 months',
      socialMedia: {
        instagram: 'vanlifecustoms',
        facebook: 'vanlifecustoms',
        youtube: 'vanlifecustoms',
      },
      gallery: [
        'https://example.com/van1.jpg',
        'https://example.com/van2.jpg',
        'https://example.com/van3.jpg',
      ],
    },
  ],
};

const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#4A90E2',
      dark: '#357ABD',
      light: '#7BB2F0',
    },
    secondary: {
      main: '#E8F4FD',
      dark: '#B8DCF2',
      light: '#F5F9FE',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#F8FAFC',
      paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#FFFFFF' : '#1A202C',
      secondary: mode === 'dark' ? '#B0B0B0' : '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

const App = () => {
  // Load Google Maps API with secure key handling
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: getGoogleMapsApiKey(),
  });

  // Use custom hooks
  const { mode, toggleThemeMode } = useThemeMode();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const scrollToResults = useScrollToResults();

  // State management - start with no state selected for clean home screen
  const [selectedState, setSelectedState] = useState<string>('');
  const [buildersByState, setBuildersByState] = useState<Record<string, Builder[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.0583, lng: -74.4057 }); // Default to NJ center
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [activeTab, setActiveTab] = useState(0);

  // Add Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  
  // Fetch builders by state
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all builders from JSON data service
        const allBuilders = await jsonDataService.getBuilders();
        
        // Organize builders by state
        const buildersByStateData: Record<string, Builder[]> = {};
        allBuilders.forEach(builder => {
          const state = builder.location.state;
          if (!buildersByStateData[state]) {
            buildersByStateData[state] = [];
          }
          buildersByStateData[state].push(builder);
        });
        
        setBuildersByState(buildersByStateData);
      } catch (err) {
        console.error('🚨 Error fetching builders:', err);
        setError('Failed to fetch builders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuilders();
  }, []);  // Only run on component mount to avoid re-fetching when state changes

  // Handle state selection
  const handleStateSelect = useCallback((state: string) => {
    console.log('State selected:', state);
    setSelectedState(state);
    scrollToResults();
    
    // Update map center based on the new selected state
    if (buildersByState[state] && buildersByState[state].length > 0) {
      const builders = buildersByState[state];
      const totalLat = builders.reduce((sum, b) => sum + b.location.lat, 0);
      const totalLng = builders.reduce((sum, b) => sum + b.location.lng, 0);
      
      setMapCenter({
        lat: totalLat / builders.length,
        lng: totalLng / builders.length
      });
      
      console.log(`🗺️ Map center updated for ${state}: ${totalLat / builders.length}, ${totalLng / builders.length}`);
    } else if (state === 'New Jersey') {
      // Default center for New Jersey if no builders found
      setMapCenter({
        lat: 40.0583,
        lng: -74.4057
      });
    }
  }, [buildersByState, scrollToResults]);

  // Handle builder modal
  const handleViewDetails = useCallback((builder: Builder) => {
    setSelectedBuilder(builder);
    setIsModalOpen(true);
    addToRecentlyViewed(builder);
  }, [addToRecentlyViewed]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBuilder(null);
  }, []);

  // Handle tab changes
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Create theme based on current mode
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Show loading state for Google Maps
  if (loadError) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            Error loading Google Maps. Please check your internet connection and try again.
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  if (!isLoaded) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="50vh"
            textAlign="center"
          >
            <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              Loading Van Builders Directory...
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: 'text.secondary',
                maxWidth: '600px',
                px: 2
              }}
            >
              Connecting you with the best camper van conversion specialists across the United States. 
              Your adventure starts here!
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}>
              <Typography variant="body2">
                🚐 Discover • 🔨 Connect • 🌟 Build Your Dream
              </Typography>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src="./images/camper-van-original.jpg" 
              alt="Camper Van" 
              style={{ 
                height: 40, 
                marginRight: 10,
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Camper Van Builders
          </Typography>
          <ThemeToggle toggleTheme={toggleThemeMode} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 2, mb: 6 }}>
        {/* Hero Section with Main Graphic */}
        <Box 
          sx={{
            background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
            color: 'white',
            py: 8,
            mb: 6,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ maxWidth: { xs: '100%', md: '55%' }, textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    color: 'white',
                    mb: 2,
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Find Your Perfect Camper Van Builder
                </Typography>
                <Typography 
                  variant="h5" 
                  component="p" 
                  sx={{ 
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  Discover top-rated van conversion specialists across the United States
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  maxWidth: { xs: '80%', md: '40%' }, 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <img 
                  src="./images/camper-van-original.jpg" 
                  alt="Camper Van Illustration" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: 16,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    overflow: 'hidden'
                  }} 
                />
              </Box>
            </Box>
          </Container>
        </Box>
        
        {/* State Selector */}
        <StateSelector 
          onSelectState={handleStateSelect}
        />
        
        {selectedState && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
              <Typography variant="h4" component="h3">
                Builders in {selectedState}
              </Typography>
              
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ 
                  mb: 4,
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: '4px 4px 0 0',
                  },
                }}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ViewListIcon />
                      <span>List View</span>
                    </Box>
                  } 
                  sx={{ py: 2, fontSize: '1rem' }}
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapIcon />
                      <span>Map View</span>
                    </Box>
                  } 
                  sx={{ py: 2, fontSize: '1rem' }}
                />
              </Tabs>
            </Box>
            
            {/* Tab Content */}
            {activeTab === 0 ? (
              // List View
              <GoogleSheetBuildersList 
                selectedState={selectedState}
                onBuilderSelect={handleViewDetails}
              />
            ) : (
              // Map View
              <Box sx={{ height: '600px', borderRadius: 2, overflow: 'hidden' }}>
                <GoogleMap
                  key={`${mapCenter.lat}-${mapCenter.lng}`}
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
                  zoom={8}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {/* Render map markers for each builder in the selected state */}
                  {buildersByState[selectedState]?.map((builder) => (
                    <Marker
                      key={builder.id}
                      position={{ lat: builder.location.lat, lng: builder.location.lng }}
                      title={builder.name}
                      onClick={() => handleViewDetails(builder)}
                      icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new window.google.maps.Size(15, 15)
                      }}
                    />
                  ))}
                  
                  {buildersByState[selectedState]?.length > 0 && (
                    <InfoWindow
                      position={{ lat: mapCenter.lat + 0.05, lng: mapCenter.lng }}
                    >
                      <div>
                        <Typography variant="body2" fontWeight="bold">
                          {buildersByState[selectedState].length} builders found in {selectedState}
                        </Typography>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </Box>
            )}
          </Box>
        )}
      </Container>
      
      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <Container maxWidth="xl" sx={{ mt: 6, mb: 8 }}>
          <RecentlyViewedSection 
            recentlyViewed={recentlyViewed} 
            onViewDetails={handleViewDetails} 
            onClearAll={() => {
              localStorage.removeItem('recentlyViewed');
              window.location.reload();
            }} 
          />
        </Container>
      )}

      {/* Back to Top Button */}
      <BackToTop />

      {/* Welcome Card */}
      <Container maxWidth="xl" sx={{ mt: 6, mb: 8 }}>
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #2c3e50 0%, #3f51b5 100%)',
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 2, 
              fontWeight: 700,
              color: 'white',
              position: 'relative',
              zIndex: 1
            }}
          >
            Welcome to the Camper Van Builders Directory
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              position: 'relative',
              zIndex: 1
            }}
          >
            We're here to help you find the perfect partner for your van conversion journey. 
            Whether you're dreaming of weekend adventures or full-time van life, our directory 
            connects you with experienced builders who can bring your vision to life.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
            mt: 4,
            position: 'relative',
            zIndex: 1
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#64b5f6', fontWeight: 'bold' }}>
                {Object.values(buildersByState).reduce((acc, builders) => acc + builders.length, 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Builders Listed
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#64b5f6', fontWeight: 'bold' }}>
                50
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                States Covered
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#64b5f6', fontWeight: 'bold' }}>
                100%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Free to Use
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 4,
              color: 'rgba(255, 255, 255, 0.8)',
              fontStyle: 'italic'
            }}
          >
            🚐 Start your journey today - Select a state above to explore builders in your area
          </Typography>
        </Paper>
      </Container>

      {/* Builder Modal */}
      {selectedBuilder && (
        <BuilderModal
          builder={selectedBuilder}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
