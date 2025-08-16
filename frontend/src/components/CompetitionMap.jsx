import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './CompetitionMap.css';

// Mock data for competitors, now with coordinate offsets
const MOCK_COMPETITORS = [
  { name: '喜茶', offset: [0.001, -0.001] },
  { name: '星巴克', offset: [-0.0005, 0.0015] },
  { name: 'Manner', offset: [0.0015, 0.0008] },
];

const CompetitionMap = ({ location, onClose }) => {
  if (!location || !location.coordinates) return null;

  const competitorsWithCoords = MOCK_COMPETITORS.map(comp => ({
    name: comp.name,
    coordinates: [
      location.coordinates[0] + comp.offset[0],
      location.coordinates[1] + comp.offset[1]
    ]
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content competition-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>周边竞品分析: {location.name}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="competition-map-container">
            <MapContainer center={location.coordinates} zoom={16} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {/* Target Location Marker */}
              <Marker position={location.coordinates}>
                <Popup>您选择的铺位: <br /> {location.name}</Popup>
              </Marker>
              {/* Competitor Markers */}
              {competitorsWithCoords.map((comp, index) => (
                <Marker key={index} position={comp.coordinates}>
                  <Popup>{comp.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionMap;