import React from 'react';
import SindhMap from './SindhMap';

const MapViewer = () => {
  return (
    <div style={{ 
      width: '90%', 
      maxWidth: '1000px', 
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Sindh Map</h2>
      <SindhMap />
    </div>
  );
};

export default MapViewer;