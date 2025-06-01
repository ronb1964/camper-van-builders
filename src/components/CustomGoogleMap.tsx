import React, { useEffect, useRef } from 'react';
import { getGoogleMapsApiKey } from '../utils/apiUtils';
import { Builder } from '../services/googleSheetsService';

interface CustomGoogleMapProps {
  builders: Builder[];
  center: { lat: number; lng: number };
  zoom?: number;
  fitBounds?: boolean;
  onMarkerClick: (builder: Builder) => void;
  isLoaded?: boolean;
}

const CustomGoogleMap: React.FC<CustomGoogleMapProps> = ({
  builders,
  center,
  zoom,
  fitBounds,
  onMarkerClick,
  isLoaded
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    console.log('🗺️ CustomGoogleMap useEffect triggered:', {
      hasMapRef: !!mapRef.current,
      isLoaded,
      windowGoogle: !!(window as any).google,
      windowGoogleMaps: !!((window as any).google && (window as any).google.maps),
      mapRefCurrent: mapRef.current,
      mapRefClientWidth: mapRef.current?.clientWidth,
      mapRefClientHeight: mapRef.current?.clientHeight,
      mapRefVisible: mapRef.current ? mapRef.current.offsetParent !== null : false
    });

    if (!mapRef.current || !isLoaded) {
      console.log('🗺️ Map init skipped:', { 
        hasMapRef: !!mapRef.current, 
        isLoaded,
        googleMapsAvailable: !!((window as any).google && (window as any).google.maps)
      });
      return;
    }

    // Check if container is visible
    if (mapRef.current.offsetParent === null) {
      console.log('🗺️ Map container not visible, delaying initialization');
      setTimeout(() => {
        if (mapRef.current && mapRef.current.offsetParent !== null) {
          console.log('🗺️ Container now visible, retrying map initialization');
        }
      }, 100);
      return;
    }

    console.log('🗺️ Initializing map with:', { center, zoom, mapRef: !!mapRef.current });

    try {
      // Add error event listeners before creating map
      (window as any).gm_authFailure = () => {
        console.error('🚨 Google Maps Authentication Failure - API key issue');
      };

      // Use exact same config as working SimpleMapTest
      mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
        zoom: zoom || 8, // Default zoom when undefined
        center: center,
        mapTypeId: 'roadmap'
      });

      console.log('🗺️ Custom map initialized successfully', mapInstanceRef.current);
      
      // Add error event listeners to the map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.addListener('tilesloaded', () => {
          console.log('🗺️ Map tiles loaded successfully');
        });

        mapInstanceRef.current.addListener('idle', () => {
          console.log('🗺️ Map idle - should be fully rendered');
        });
      }

      // Check for authentication errors
      if ((window as any).google.maps.event) {
        (window as any).google.maps.event.addDomListener(window, 'gm_authFailure', () => {
          console.error('🚨 Google Maps Authentication Failure detected');
        });
      }
      
      // Add idle event listener to ensure tiles load
      const idleListener = (window as any).google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        console.log('🗺️ Map idle event fired - tiles should be loaded');
        (window as any).google.maps.event.removeListener(idleListener);
      });
      
      // Force map resize and refresh multiple times to ensure proper rendering
      const forceMapRefresh = () => {
        if (mapInstanceRef.current) {
          (window as any).google.maps.event.trigger(mapInstanceRef.current, 'resize');
          mapInstanceRef.current.setCenter(center);
          console.log('🗺️ Map resize and center refresh triggered');
        }
      };
      
      // Try forcing satellite view first, then back to roadmap to trigger tile loading
      const forceMapTypeRefresh = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setMapTypeId('satellite');
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setMapTypeId('roadmap');
              console.log('🗺️ Map type cycled to force tile loading');
            }
          }, 100);
        }
      };
      
      // Try multiple times with different delays
      setTimeout(forceMapRefresh, 50);
      setTimeout(forceMapTypeRefresh, 200);
      setTimeout(forceMapRefresh, 500);
      
    } catch (error) {
      console.error('🚨 Map initialization error:', error);
    }
  }, [center, zoom, isLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each builder
    builders.forEach((builder, index) => {
      // Add offset for overlapping markers
      const offsetLat = builder.location.lat + (index * 0.005);
      const offsetLng = builder.location.lng + (index * 0.005);

      const marker = new (window as any).google.maps.Marker({
        position: { lat: offsetLat, lng: offsetLng },
        map: mapInstanceRef.current,
        title: `${builder.name} - ${builder.location.city}, ${builder.location.state}`,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new (window as any).google.maps.Size(32, 32),
          anchor: new (window as any).google.maps.Point(16, 32)
        }
      });

      marker.addListener('click', () => {
        onMarkerClick(builder);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if fitBounds is enabled
    if (fitBounds && builders.length > 0 && mapInstanceRef.current) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      
      builders.forEach((builder, index) => {
        // Use the same offset as markers
        const offsetLat = builder.location.lat + (index * 0.005);
        const offsetLng = builder.location.lng + (index * 0.005);
        bounds.extend({ lat: offsetLat, lng: offsetLng });
      });
      
      mapInstanceRef.current.fitBounds(bounds);
      
      // Add some padding around the bounds
      setTimeout(() => {
        if (mapInstanceRef.current) {
          const currentZoom = mapInstanceRef.current.getZoom();
          if (currentZoom && currentZoom > 12) {
            // If zoom is too high, limit it to 12 for better overview
            mapInstanceRef.current.setZoom(12);
          }
        }
      }, 100);
    }

    // Add info window showing builder count
    if (builders.length > 0 && mapInstanceRef.current) {
      const infoWindow = new (window as any).google.maps.InfoWindow({
        position: center,
        content: `
          <div style="padding: 8px; text-align: center;">
            <div style="font-weight: bold; color: #1976d2; margin-bottom: 4px;">
              ${builders.length} builders found
            </div>
            <div style="font-size: 12px; color: #666;">
              Click markers for details
            </div>
          </div>
        `,
        pixelOffset: new (window as any).google.maps.Size(0, -50)
      });
      
      infoWindow.open(mapInstanceRef.current);
      
      // Close info window after 3 seconds
      setTimeout(() => {
        infoWindow.close();
      }, 3000);
    }

    console.log(`🗺️ Added ${builders.length} markers to custom map`);
  }, [builders, onMarkerClick, center, fitBounds, isLoaded]);

  if (!isLoaded) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div>Waiting for Google Maps to load...</div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#e5e5e5',
        border: '2px solid #ccc',
        position: 'relative'
      }} 
    />
  );
};

export default CustomGoogleMap;
