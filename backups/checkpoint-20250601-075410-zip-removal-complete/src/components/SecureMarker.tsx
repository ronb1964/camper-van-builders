import React from 'react';
import { Marker } from '@react-google-maps/api';
import { isValidExternalUrl } from '../utils/apiUtils';

interface SecureMarkerProps {
  position: {
    lat: number;
    lng: number;
  };
  onClick?: () => void;
  iconUrl?: string;
  iconSize?: number;
}

/**
 * A secure wrapper for Google Maps Marker component
 * Validates icon URLs and provides fallbacks
 */
const SecureMarker: React.FC<SecureMarkerProps> = ({
  position,
  onClick,
  iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize = 30
}) => {
  // Default icon URL if the provided one is invalid
  const defaultIconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
  
  // Validate the icon URL
  const validatedIconUrl = isValidExternalUrl(iconUrl) ? iconUrl : defaultIconUrl;
  
  return (
    <Marker
      position={position}
      onClick={onClick}
      icon={{
        url: validatedIconUrl,
        scaledSize: new window.google.maps.Size(iconSize, iconSize)
      }}
    />
  );
};

export default SecureMarker;
