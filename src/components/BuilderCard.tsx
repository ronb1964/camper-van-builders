import React, { memo } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Rating, 
  Chip, 
  IconButton,
  Link,
  Tooltip,
  Badge,
  useTheme,
  alpha,
  Grow,
  Zoom
} from '@mui/material';
import { 
  LocationOn, 
  Phone, 
  Email, 
  Language, 
  FavoriteBorder, 
  Favorite,
  CompareArrows,
  Star,
  DirectionsCar
} from '@mui/icons-material';
import { Builder } from '../types';

interface BuilderCardProps {
  builder: Builder;
  onViewDetails: (builder: Builder) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (builder: Builder) => void;
  onAddToCompare?: (builder: Builder) => void;
  isInCompare?: boolean;
  compareCount?: number;
}

const BuilderCard: React.FC<BuilderCardProps> = ({ 
  builder, 
  onViewDetails, 
  isFavorite = false,
  onToggleFavorite,
  onAddToCompare,
  isInCompare = false,
  compareCount = 0
}) => {
  const theme = useTheme();
  const {
    name,
    address,
    phone,
    email,
    website,
    description,
    rating,
    reviewCount,
    vanTypes = [],
    priceRange,
    location,
    yearsInBusiness,
    distanceFromZip
  } = builder;

  // Create initials from builder name for the placeholder image
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 3);

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          '&::after': isInCompare ? {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 3,
            border: `2px solid ${theme.palette.primary.main}`,
            zIndex: -1,
            pointerEvents: 'none'
          } : {}
        }}
      >
        {/* Favorite Button */}
        {onToggleFavorite && (
          <IconButton
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onToggleFavorite(builder)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              '&:hover': {
                bgcolor: alpha(theme.palette.background.paper, 0.9),
              },
              transform: isFavorite ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: theme.palette.error.main }} />
            ) : (
              <FavoriteBorder sx={{ color: theme.palette.error.main }} />
            )}
          </IconButton>
        )}

        {/* Compare Button */}
        {onAddToCompare && (
          <Tooltip 
            title={isInCompare ? 'Already in comparison' : 'Add to comparison'}
            placement="top"
          >
            <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
              <IconButton
                aria-label="Add to comparison"
                onClick={() => !isInCompare && onAddToCompare(builder)}
                disabled={isInCompare}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                  },
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }
                }}
              >
                <Badge badgeContent={compareCount} color="secondary" 
                  sx={{ '& .MuiBadge-badge': { display: compareCount > 0 ? 'flex' : 'none' } }}
                >
                  <CompareArrows />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
        )}

        {/* Card Media */}
        {builder.gallery?.[0] ? (
          <CardMedia
            component="img"
            height="200"
            image={builder.gallery[0]}
            alt={name}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontSize: '2rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
              }
            }}
          >
            {initials}
          </Box>
        )}

        {/* Years in Business Badge */}
        {yearsInBusiness && (
          <Chip
            icon={<Star fontSize="small" />}
            label={`${yearsInBusiness} ${yearsInBusiness === 1 ? 'Year' : 'Years'}`}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 170,
              right: 16,
              fontWeight: 'bold',
              boxShadow: 2
            }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                ({reviewCount})
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <LocationOn color="action" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
              <Typography variant="body2" color="text.secondary">
                {location.city}, {location.state} {location.zip}
              </Typography>
            </Box>
            
            {/* Display distance information when available */}
            {distanceFromZip && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 0.5,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderRadius: 1,
                py: 0.5,
                px: 1,
                width: 'fit-content'
              }}>
                <DirectionsCar color="primary" fontSize="small" sx={{ mr: 1 }} />
                <Typography 
                  variant="body2" 
                  color="primary.main"
                  fontWeight="medium"
                >
                  {distanceFromZip.miles} {distanceFromZip.miles === 1 ? 'mile' : 'miles'} from {distanceFromZip.zipCode}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography 
            variant="body2" 
            paragraph 
            sx={{ 
              mb: 2, 
              color: 'text.secondary',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              lineHeight: 1.5,
              height: '4.5em'
            }}
          >
            {description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Van Types
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {vanTypes.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': { boxShadow: 1 },
                    transition: 'box-shadow 0.2s'
                  }}
                />
              ))}
            </Box>
          </Box>

          {priceRange && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Price Range
              </Typography>
              <Chip
                label={`$${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
            {phone && (
              <Tooltip title={phone}>
                <IconButton 
                  size="small" 
                  color="primary" 
                  aria-label="call"
                  component="a"
                  href={`tel:${phone}`}
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                >
                  <Phone fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {email && (
              <Tooltip title={email}>
                <IconButton 
                  size="small" 
                  color="primary" 
                  aria-label="email"
                  component="a"
                  href={`mailto:${email}`}
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                >
                  <Email fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {website && (
              <Tooltip title="Visit Website">
                <IconButton 
                  size="small" 
                  color="primary" 
                  aria-label="website"
                  component="a"
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                >
                  <Language fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>

        <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onViewDetails(builder)}
            sx={{
              py: 1,
              fontWeight: 'medium',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </Card>
    </Zoom>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(BuilderCard);
