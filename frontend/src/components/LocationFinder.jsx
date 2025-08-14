import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationFinder.css';
import ReportPreview from './ReportPreview';
import CompetitionMap from './CompetitionMap';
import GuideTooltip from './GuideTooltip';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationFinder = () => {
  const [filters, setFilters] = useState({ city: '杭州', area_min: 50, rent_max: 800, type: '餐饮' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([30.2741, 120.1551]); // Default to Hangzhou
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showCompetition, setShowCompetition] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();
    fetch(`/api/locations/search?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        // 为每个位置添加坐标信息（实际项目中应该从后端获取真实坐标）
        const locationsWithCoordinates = data.map(loc => ({
          ...loc,
          coordinates: loc.city === '杭州' 
            ? [30.2741 + (Math.random() - 0.5) * 0.05, 120.1551 + (Math.random() - 0.5) * 0.05] 
            : [31.2988 + (Math.random() - 0.5) * 0.05, 120.5853 + (Math.random() - 0.5) * 0.05] // 苏州坐标
        }));
        setResults(locationsWithCoordinates);
        if (locationsWithCoordinates.length > 0) {
          setMapCenter(locationsWithCoordinates[0].coordinates);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error searching locations:', error);
        setLoading(false);
      });
  };
  
  // Initial search on component mount
  useEffect(() => {
    handleSearch(new Event('submit'));
  }, []);

  const handleViewReport = (location) => {
    setSelectedLocation(location);
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  const handleSwitchToCompetition = () => {
    setShowReport(false);
    setShowCompetition(true);
  };

  const handleCloseCompetition = () => {
    setShowCompetition(false);
  };

  return (
    <div className="location-finder-layout">
      {/* 引导提示 */}
      <GuideTooltip 
        storageKey="locationFinder_guide_seen"
        title="品牌选址助手"
        text="欢迎使用品牌选址助手！在左侧设置您的筛选条件，在地图上查看匹配的铺位，点击标记可以查看详细信息和分析报告。"
      />

      {/* 左侧面板：筛选器 */}
      <div className="filter-panel">
        <h3>品牌选址</h3>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>城市</label>
            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label>最小面积 (m²)</label>
            <input type="number" name="area_min" value={filters.area_min} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label>最高租金 (元/m²)</label>
            <input type="number" name="rent_max" value={filters.rent_max} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label>业态</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">所有</option>
              <option value="餐饮">餐饮</option>
              <option value="零售">零售</option>
              <option value="娱乐">娱乐</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="search-button">
            {loading ? '搜索中...' : '搜索铺位'}
          </button>
        </form>

        {/* 搜索结果统计 */}
        {!loading && results.length > 0 && (
          <div className="results-summary">
            <p>找到 <strong>{results.length}</strong> 个符合条件的铺位</p>
          </div>
        )}
      </div>

      {/* 右侧面板：地图 */}
      <div className="map-panel">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} key={mapCenter.toString()}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {results.map(loc => (
            <Marker key={loc.id} position={loc.coordinates}>
              <Popup>
                <div className="map-popup">
                  <h4>{loc.name}</h4>
                  <p>{loc.address}</p>
                  <p><strong>面积:</strong> {loc.area} m² | <strong>租金:</strong> ¥{loc.rent}/m²</p>
                  <button className="popup-button" onClick={() => handleViewReport(loc)}>查看分析报告</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* 加载状态 */}
        {loading && (
          <div className="map-loading-overlay">
            <div className="spinner"></div>
            <p>正在搜索最佳铺位...</p>
          </div>
        )}
      </div>

      {/* 分析报告模态框 */}
      {showReport && (
        <ReportPreview 
          location={selectedLocation} 
          onClose={handleCloseReport}
          onSwitchToCompetition={handleSwitchToCompetition}
        />
      )}

      {/* 竞品分析地图模态框 */}
      {showCompetition && (
        <CompetitionMap 
          location={selectedLocation} 
          onClose={handleCloseCompetition}
        />
      )}
    </div>
  );
};

export default LocationFinder;
