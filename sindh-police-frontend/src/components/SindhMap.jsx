import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const SindhMap = ({ darkMode }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Fix for default marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    // Initialize map only once
    if (!mapRef.current || mapRef.current._leaflet_id) return;

    const map = L.map(mapRef.current, {
      center: [26.2965, 68.1302], // Center of Sindh
      zoom: 7,
      zoomControl: false
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add Sindh boundary (simplified coordinates)
    const sindhBoundary = L.polygon([
      [28.5, 66.5], // Northwest
      [28.0, 68.5], // Northeast
      [24.5, 70.0], // Southeast
      [24.0, 67.0], // Southwest
      [28.5, 66.5]  // Close polygon
    ], {
      color: darkMode ? '#3388ff' : '#2563eb',
      weight: 2,
      fillColor: darkMode ? '#3388ff' : '#3b82f6',
      fillOpacity: 0.2
    }).addTo(map);

    // Add district markers
    const districts = [
      { id: 1, name: 'Karachi', position: [24.8607, 67.0011] },
      { id: 2, name: 'Hyderabad', position: [25.3969, 68.3778] },
      { id: 3, name: 'Sukkur', position: [27.7136, 68.8486] },
      { id: 4, name: 'Mirpur Khas', position: [25.5269, 69.0111] },
      { id: 5, name: 'Larkana', position: [27.5600, 68.2264] },
    ];

    districts.forEach(district => {
      L.marker(district.position, {
        title: district.name
      }).addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [darkMode]);

  return (
    <div 
      ref={mapRef} 
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '0.5rem',
        zIndex: 1
      }}
    />
  );
};

export default SindhMap;