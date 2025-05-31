import React, { useState, useEffect } from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Pinterest as PinterestIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  CalendarToday as CalendarIcon,
  Build as BuildIcon,
  EmojiEvents as CertIcon,
  PhotoCamera as GalleryIcon
} from '@mui/icons-material';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Builder, PricingTier } from '../types';

// Styled Components
const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 1000,
  maxHeight: '90vh',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    width: '95%',
    maxHeight: '95vh',
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowY: 'auto',
  flexGrow: 1,
}));

const GalleryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

interface BuilderModalProps {
  builder: Builder | null;
  open: boolean;
  onClose: () => void;
}

const BuilderModal: React.FC<BuilderModalProps> = ({ builder, open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (builder?.gallery?.[0]) {
      setMainImage(builder.gallery[0]);
    }
  }, [builder]);

  if (!builder) return null;

  const {
    name,
    address,
    phone,
    email,
    website,
    description,
    vanTypes = [],
    amenities = [],
    services = [],
    priceRange,
    pricingTiers = [],
    gallery = [],
    leadTime,
    socialMedia = {},
    location,
    certifications = []
  } = builder;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            <div>
              <Typography variant="body1" paragraph>{description}</Typography>
              
              <Box sx={{ mt: 2 }}>
                {leadTime && (
                  <Typography variant="body2" color="text.secondary">
                    <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Lead Time: {leadTime}
                  </Typography>
                )}
              </Box>
            </div>
            
            <div>
              <Typography variant="h6" gutterBottom>Van Types</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {vanTypes.map((type) => (
                  <Chip key={type} label={type} color="primary" variant="outlined" />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {amenities.map((amenity) => (
                  <Chip 
                    key={amenity} 
                    label={amenity} 
                    variant="outlined"
                    icon={<CheckIcon fontSize="small" />}
                  />
                ))}
              </Box>
            </div>
          </div>
        );

      case 1: // Pricing
        return (
          <Box>
            {priceRange && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Price Range</Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prices may vary based on customization options and features selected.
                </Typography>
              </Box>
            )}

            {pricingTiers.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>Pricing Tiers</Typography>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {pricingTiers.map((tier, index) => (
                    <div key={index}>
                      <Box
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: 3,
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <Typography variant="h6" gutterBottom>{tier.name}</Typography>
                        <Typography variant="h4" color="primary" gutterBottom>
                          ${tier.price.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {tier.description}
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="subtitle2" gutterBottom>Includes:</Typography>
                          <List dense disablePadding>
                            {tier.features.map((feature, i) => (
                              <ListItem key={i} disableGutters disablePadding sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={feature} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    </div>
                  ))}
                </div>
              </Box>
            )}
          </Box>
        );

      case 2: // Gallery
        return (
          <Box>
            {gallery.length > 0 ? (
              <Box>
                <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', height: 400 }}>
                  <img
                    src={mainImage}
                    alt={name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                  {gallery.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setMainImage(img)}
                      sx={{
                        cursor: 'pointer',
                        border: `2px solid ${mainImage === img ? 'primary.main' : 'transparent'}`,
                        borderRadius: 1,
                        overflow: 'hidden',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <img
                        src={img}
                        alt={`${name} - ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                }}
              >
                <GalleryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No gallery images available
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        style: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Fade in={open}>
        <ModalContent>
          <ModalHeader>
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
            <IconButton onClick={onClose} size="large">
              <CloseIcon />
            </IconButton>
          </ModalHeader>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Pricing" />
            <Tab label="Gallery" />
          </Tabs>

          <ModalBody>
            {renderTabContent()}
          </ModalBody>

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {phone && (
                <Button
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  component="a"
                  href={`tel:${phone}`}
                >
                  Call
                </Button>
              )}
              {email && (
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  component="a"
                  href={`mailto:${email}`}
                >
                  Email
                </Button>
              )}
              {website && (
                <Button
                  variant="outlined"
                  startIcon={<WebsiteIcon />}
                  component="a"
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialMedia?.facebook && (
                <IconButton
                  component="a"
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  <FacebookIcon />
                </IconButton>
              )}
              {socialMedia?.instagram && (
                <IconButton
                  component="a"
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  <InstagramIcon />
                </IconButton>
              )}
              {socialMedia?.youtube && (
                <IconButton
                  component="a"
                  href={socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  <YouTubeIcon />
                </IconButton>
              )}
              {socialMedia?.pinterest && (
                <IconButton
                  component="a"
                  href={socialMedia.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  <PinterestIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default BuilderModal;
