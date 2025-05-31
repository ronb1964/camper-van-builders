import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { Builder, PricingTier } from '../types';

// Helper functions for mock data
// Using Review and PricingTier interfaces from types.ts
const generateReviews = (count: number, averageRating: number): any[] => {
  const reviews: any[] = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: i + 1,
      author: `User${i + 1}`,
      rating: parseFloat((Math.random() * 1 + (averageRating - 0.5)).toFixed(1)),
      comment: 'Great service and quality work!',
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  }
  return reviews;
};

const generatePricingTiers = (basePrice: number): PricingTier[] => {
  return [
    {
      name: 'Basic',
      price: Math.round(basePrice * 0.8),
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

const TestNewJersey: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [builder, setBuilder] = useState<Builder | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      // Create Humble Road builder data directly
      const humbleRoad: Builder = {
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
        reviews: generateReviews(8, 4.9) as any[],
        vanTypes: ['Sprinter', 'Transit', 'Promaster', 'Promaster City'],
        priceRange: { min: 38000, max: 215000 },
        pricingTiers: generatePricingTiers(85000),
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
      };
      
      setBuilder(humbleRoad);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New Jersey Builder Test
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : builder ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {builder.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {builder.description}
          </Typography>
          <Typography variant="body2">
            Location: {builder.location.city}, {builder.location.state}
          </Typography>
          <Typography variant="body2">
            Phone: {builder.phone}
          </Typography>
          <Typography variant="body2">
            Website: <a href={builder.website} target="_blank" rel="noopener noreferrer">{builder.website}</a>
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Van Types:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {builder.vanTypes?.map((type) => (
                <Chip key={type} label={type} />
              ))}
            </Box>
          </Box>
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No builder found
        </Typography>
      )}
    </Box>
  );
};

// Custom Chip component for simplicity
const Chip: React.FC<{ label: string }> = ({ label }) => (
  <Box
    sx={{
      display: 'inline-block',
      bgcolor: 'primary.main',
      color: 'white',
      px: 1,
      py: 0.5,
      borderRadius: 1,
      fontSize: '0.8rem',
    }}
  >
    {label}
  </Box>
);

export default TestNewJersey;
