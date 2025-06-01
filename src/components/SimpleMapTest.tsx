import React, { useEffect, useRef } from 'react';

interface SimpleMapTestProps {
  isLoaded: boolean;
}

const SimpleMapTest: React.FC<SimpleMapTestProps> = ({ isLoaded }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🧪 SimpleMapTest - Starting test:', {
      isLoaded,
      hasMapRef: !!mapRef.current,
      windowGoogle: !!(window as any).google,
      windowGoogleMaps: !!((window as any).google && (window as any).google.maps)
    });

    if (!isLoaded || !mapRef.current) {
      console.log('🧪 SimpleMapTest - Skipping: not loaded or no ref');
      return;
    }

    try {
      console.log('🧪 SimpleMapTest - Creating map...');
      
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 33.5185892, lng: -86.8103567 }, // Birmingham, AL
        mapTypeId: 'roadmap'
      });

      console.log('🧪 SimpleMapTest - Map created successfully!', map);

      // Add a simple marker
      const marker = new (window as any).google.maps.Marker({
        position: { lat: 33.5185892, lng: -86.8103567 },
        map: map,
        title: 'Test Marker'
      });

      console.log('🧪 SimpleMapTest - Marker added!', marker);
      
    } catch (error) {
      console.error('🧪 SimpleMapTest - Error:', error);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Google Maps API...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Simple Map Test</h3>
      <div 
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          border: '2px solid #333',
          backgroundColor: '#f0f0f0'
        }}
      />
    </div>
  );
};

export default SimpleMapTest;
