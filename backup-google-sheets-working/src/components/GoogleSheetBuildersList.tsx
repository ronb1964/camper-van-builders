import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import BuilderCard from './BuilderCard';
import { getBuilders, Builder } from '../services/googleSheetsService';

// Create styled components for our grid layout
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

// Props interface for the component
interface GoogleSheetBuildersListProps {
  selectedState?: string;
  onBuilderSelect?: (builder: Builder) => void;
}

// Default message for states without builder data
const DEFAULT_MESSAGE = "We don't have builder data for this state yet. Please select a different state to see builder data.";

// Main component that displays builders based on selected state
const GoogleSheetBuildersList: React.FC<GoogleSheetBuildersListProps> = ({ 
  selectedState = "New Jersey", 
  onBuilderSelect 
}) => {
  const [buildersByState, setBuildersByState] = useState<Record<string, Builder[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch builders data from the Google Sheet service
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 GoogleSheetBuildersList: Starting data fetch...');
        
        // Get all builders from Google Sheets
        const allBuilders = await getBuilders();
        console.log('📊 GoogleSheetBuildersList: Total builders fetched:', allBuilders.length);
        
        // Organize builders by state
        const buildersByStateMap: Record<string, Builder[]> = {};
        allBuilders.forEach(builder => {
          const state = builder.location.state;
          if (!buildersByStateMap[state]) {
            buildersByStateMap[state] = [];
          }
          buildersByStateMap[state].push(builder);
        });
        
        // Log detailed information about New Jersey builders
        if (buildersByStateMap['New Jersey']) {
          console.log('🔍 NEW JERSEY BUILDERS FOUND:', buildersByStateMap['New Jersey'].length);
          buildersByStateMap['New Jersey'].forEach((builder, index) => {
            console.log(`NJ Builder ${index + 1}:`, builder.name, builder.location.city);
          });
        } else {
          console.log('❌ NO NEW JERSEY BUILDERS FOUND');
        }
        
        console.log('📊 GoogleSheetBuildersList: States available:', Object.keys(buildersByStateMap));
        console.log('📊 GoogleSheetBuildersList: Selected state:', selectedState);
        console.log('📊 GoogleSheetBuildersList: Builders for selected state:', buildersByStateMap[selectedState]?.length || 0);
        
        setBuildersByState(buildersByStateMap);
        setError(null);
      } catch (err) {
        console.error('⚠️ GoogleSheetBuildersList: Error fetching data:', err);
        setError('Unable to load builder data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedState]);
  
  // Get builders for the selected state or an empty array if none exist
  const builders = buildersByState[selectedState] || [];
  
  console.log('🎯 GoogleSheetBuildersList: Current builders for display:', builders.length);

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: 'error.light', borderRadius: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {builders.length > 0 ? (
        <>
          <Typography variant="subtitle1" gutterBottom>
            {builders.length} builder{builders.length !== 1 ? 's' : ''} found
          </Typography>
          <GridContainer>
            {builders.map((builder) => (
              <BuilderCard 
                key={builder.id}
                builder={builder} 
                onViewDetails={onBuilderSelect || (() => {})} 
              />
            ))}
          </GridContainer>
        </>
      ) : (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            No Builders Found
          </Typography>
          <Typography variant="body1" paragraph>
            {DEFAULT_MESSAGE}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We're constantly adding new builder data to our database.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GoogleSheetBuildersList;
