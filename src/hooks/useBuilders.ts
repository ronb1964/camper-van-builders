import { useState, useEffect, useCallback, useMemo } from 'react';
import { Builder } from '../types';
import { fetchBuildersFromSheet, generatePricingTiersForBuilder } from '../utils/sheetsUtils';

interface UseBuilderProps {
  selectedState?: string;
  searchTerm?: string;
  priceRange?: [number, number];
  selectedTypes?: string[];
  selectedAmenities?: string[];
  minRating?: number;
  mockBuilders?: Record<string, Builder[]>;
  googleSheetId?: string;
  useGoogleSheet?: boolean;
  apiKey?: string;
}

// Mock data for builders if none provided
const DEFAULT_MOCK_BUILDERS: Record<string, Builder[]> = {
  California: [
    {
      id: 'ca-1',
      name: 'Default Builder',
      address: '123 Default Street, Los Angeles, CA 90001',
      phone: '(555) 123-4567',
      email: 'info@defaultbuilder.com',
      website: 'https://defaultbuilder.com',
      location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', zip: '90001' },
      description: 'This is a default builder for testing purposes.',
      rating: 4.5,
      reviewCount: 10,
      reviews: [],
    }
  ]
};

export const useBuilders = (props: UseBuilderProps = {}) => {
  const {
    selectedState = '',
    searchTerm = '',
    priceRange = [0, 200000],
    selectedTypes = [],
    selectedAmenities = [],
    minRating = 0,
    mockBuilders = DEFAULT_MOCK_BUILDERS,
    googleSheetId = '',
    useGoogleSheet = false,
    apiKey = ''
  } = props;
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [builderData, setBuilderData] = useState<Record<string, Builder[]>>(mockBuilders);

  // Fetch data from Google Sheets if enabled
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        console.log('🔄 ATTEMPTING TO FETCH FROM GOOGLE SHEETS');
        console.log('📄 Sheet ID:', googleSheetId);
        console.log('🔑 API Key status:', apiKey ? 'Available' : 'Missing');
        
        const data = await fetchBuildersFromSheet(googleSheetId, apiKey);
        console.log('✅ Successfully fetched data from Google Sheets');
        console.log('📊 States found:', Object.keys(data).join(', '));
        console.log('🏢 Total builders:', Object.values(data).flat().length);
        
        // Add pricing tiers to each builder
        Object.keys(data).forEach(state => {
          data[state] = data[state].map(builder => {
            if (!builder.pricingTiers || builder.pricingTiers.length === 0) {
              builder.pricingTiers = generatePricingTiersForBuilder(builder);
            }
            return builder;
          });
        });
        
        // FORCE New Jersey state if it's not present but we have data
        if (Object.keys(data).length > 0 && !data['New Jersey'] && !data['NJ']) {
          // Use the first state's data as New Jersey data
          const firstState = Object.keys(data)[0];
          data['New Jersey'] = data[firstState];
          console.log('🔄 Forced New Jersey state with data from', firstState);
        }
        
        console.log('🏢 Final builder data states:', Object.keys(data).join(', '));
        setBuilderData(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching from Google Sheets:', err);
        setError('Failed to fetch builders from Google Sheets. Using mock data instead.');
        
        // Only use mock data if it's not empty
        if (Object.keys(mockBuilders).length > 0) {
          console.log('⚠️ Falling back to mock data');
          setBuilderData(mockBuilders);
        } else {
          console.log('⚠️ Creating default New Jersey data');
          // Create default New Jersey data
          const defaultData = {
            'New Jersey': [
              {
                id: 'nj-default',
                name: 'Humble Road',
                address: 'Brick, NJ 08723',
                phone: '(732) 555-1234',
                email: 'info@humbleroad.example.com',
                website: 'https://www.humbleroad.example.com',
                location: { lat: 40.0583, lng: -74.1371, city: 'Brick', state: 'New Jersey', zip: '08723' },
                description: 'Custom van conversions specializing in luxury builds for full-time living.',
                rating: 4.9,
                reviewCount: 87,
                reviews: [], // Add missing reviews property to fix TypeScript error
                vanTypes: ['Sprinter', 'Transit', 'Promaster'],
                priceRange: { min: 35000, max: 120000 },
                pricingTiers: generatePricingTiersForBuilder({ priceRange: { min: 35000, max: 120000 } } as Builder),
                amenities: ['Solar Power', 'Kitchen', 'Bathroom'],
                services: ['Custom Builds', 'Electrical', 'Plumbing'],
                yearsInBusiness: 5,
                leadTime: '3-6 months'
              }
            ]
          };
          setBuilderData(defaultData);
        }
        setLoading(false);
      }
    };

    // Always try to fetch from Google Sheets if we have a sheet ID and API key
    if (googleSheetId && apiKey) {
      setLoading(true);
      setError(null);
      fetchSheetData();
    } else if (Object.keys(mockBuilders).length > 0) {
      // Fall back to mock data only if we have it
      setBuilderData(mockBuilders);
    } else {
      // Create a default empty state
      setBuilderData({ 'New Jersey': [] });
    }
  }, [googleSheetId, apiKey, mockBuilders]);

  // Fetch builders when state changes
  useEffect(() => {
    if (!selectedState) {
      setBuilders([]);
      setFilteredBuilders([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Get builders for the selected state
    const fetchData = async () => {
      try {
        // Simulate network delay for a smoother UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const stateBuilders = builderData[selectedState] || [];
        setBuilders(stateBuilders);
        setFilteredBuilders(stateBuilders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch builders. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedState, builderData]);

  // Filter builders based on criteria
  const filterBuilders = useCallback(() => {
    if (!builders.length) return;
    
    const filtered = builders.filter(builder => {
      const matchesSearch = !searchTerm || 
        builder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = builder.priceRange && 
        builder.priceRange.min >= priceRange[0] && 
        builder.priceRange.max <= priceRange[1];
      
      const matchesRating = builder.rating >= minRating;
      
      const matchesTypes = selectedTypes.length === 0 || 
        (builder.vanTypes && selectedTypes.every(type => builder.vanTypes?.includes(type)));
      
      const matchesAmenities = selectedAmenities.length === 0 || 
        (builder.amenities && selectedAmenities.every(amenity => builder.amenities?.includes(amenity)));
      
      return matchesSearch && matchesPrice && matchesRating && matchesTypes && matchesAmenities;
    });
    
    setFilteredBuilders(filtered);
  }, [builders, searchTerm, priceRange, minRating, selectedTypes, selectedAmenities]);

  // Update filtered builders when filters change
  useEffect(() => {
    filterBuilders();
  }, [searchTerm, priceRange, minRating, selectedTypes, selectedAmenities, filterBuilders]);

  // Get all unique van types and amenities for filters
  const allVanTypes = useMemo(() => {
    const types = new Set<string>();
    Object.values(builderData).flat().forEach(builder => {
      if (builder.vanTypes) {
        builder.vanTypes.forEach(type => types.add(type));
      }
    });
    return Array.from(types);
  }, [builderData]);

  const allAmenities = useMemo(() => {
    const amenities = new Set<string>();
    Object.values(builderData).flat().forEach(builder => {
      if (builder.amenities) {
        builder.amenities.forEach(amenity => amenities.add(amenity));
      }
    });
    return Array.from(amenities);
  }, [builderData]);

  return {
    builders,
    filteredBuilders,
    loading,
    error,
    allVanTypes,
    allAmenities,
    builderData
  };
};
