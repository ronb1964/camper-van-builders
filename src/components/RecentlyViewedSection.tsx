import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Rating,
  Button,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Builder } from '../types';

interface RecentlyViewedSectionProps {
  recentlyViewed: Builder[];
  onViewDetails: (builder: Builder) => void;
  onClearAll: () => void;
}

const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  recentlyViewed,
  onViewDetails,
  onClearAll
}) => {
  const theme = useTheme();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'primary.main',
            fontWeight: 600
          }}
        >
          <HistoryIcon sx={{ mr: 1 }} /> Recently Viewed
        </Typography>
        {recentlyViewed.length > 0 && (
          <Button 
            startIcon={<ClearAllIcon />} 
            onClick={onClearAll}
            size="small"
            color="secondary"
          >
            Clear All
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {recentlyViewed.map((builder) => (
          <Box key={builder.id} sx={{ width: { xs: '100%', sm: '47%', md: '31%', lg: '19%' } }}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardActionArea onClick={() => onViewDetails(builder)}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 120,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main
                  }}
                >
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {builder.name.split(' ').map(word => word[0]).join('')}
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" component="div" noWrap sx={{ mb: 1, fontSize: '1rem' }}>
                    {builder.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={builder.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({builder.reviewCount})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {builder.location.city}, {builder.location.state}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {builder.priceRange && (
                      <Chip 
                        label={`$${builder.priceRange.min.toLocaleString()} - $${builder.priceRange.max.toLocaleString()}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentlyViewedSection;
