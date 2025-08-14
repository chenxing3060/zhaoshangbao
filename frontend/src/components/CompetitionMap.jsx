import React from 'react';
import './CompetitionMap.css';

// Mock data for competitors. In a real app, this would come from the backend.
const MOCK_COMPETITORS = [
  { name: '喜茶', x: 40, y: 35 },
  { name: '星巴克', x: 60, y: 45 },
  { name: 'Manner', x: 55, y: 65 },
];

const CompetitionMap = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content competition-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>周边竞品分析: {location.name}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="competition-map-container">
            <img src="https://raw.githubusercontent.com/Tencent-CodeBuddy/zhaoshangbao-asset/main/map-detail.png" alt="Detail Map" className="map-background" />
            <div className="map-pins-overlay">
              {/* Target Location Pin */}
              <div className="pin target-pin" style={{ top: '50%', left: '50%' }}>
                <span>您选择的铺位</span>
              </div>
              {/* Competitor Pins */}
              {MOCK_COMPETITORS.map((comp, index) => (
                <div key={index} className="pin competitor-pin" style={{ top: `${comp.y}%`, left: `${comp.x}%` }}>
                  <span>{comp.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionMap;