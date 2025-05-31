import React, { memo } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
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
  DirectionsCar
} from '@mui/icons-material';
import { Builder } from '../types';

interface BuilderCardProps {
  builder: Builder;
  onViewDetails: (builder: Builder) => void;
}

const BuilderCard: React.FC<BuilderCardProps> = ({ 
  builder, 
  onViewDetails
}) => {
  const theme = useTheme();
  const {
    name,
    address,
    phone,
    email,
    website,
    description,
    vanTypes = [],
    location,
    distanceFromZip
  } = builder;

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Card Media */}
        {builder.gallery?.[0] ? (
          <CardMedia
            component="img"
            height="160"
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
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontSize: '1.4rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease-in-out',
              textAlign: 'center',
              px: 2,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
              }
            }}
          >
            {name}
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 1 }}>
          <Box sx={{ mb: 1.5 }}>
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
              mb: 1.5, 
              color: 'text.secondary',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: 1.4,
              height: '2.8em'
            }}
          >
            {description}
          </Typography>

          <Box sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
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

        <Box sx={{ p: 1.5, pt: 0, mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onViewDetails(builder)}
            sx={{
              py: 0.8,
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
