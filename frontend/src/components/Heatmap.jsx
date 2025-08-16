import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import CustomHeatmapLayer from './CustomHeatmapLayer';
import 'leaflet/dist/leaflet.css';
import './Heatmap.css';

const Legend = ({ activeLayer }) => {
  const legends = {
    traffic: { title: '人流热力', low: '低', high: '高', gradient: 'linear-gradient(to right, #feebe2, #fbb4b9, #f768a1, #c51b8a, #7a0177)' },
    spendingPower: { title: '消费热力', low: '低', high: '高', gradient: 'linear-gradient(to right, #edf8fb, #b3cde3, #8c96c6, #8856a7, #810f7c)' },
    competition: { title: '竞品分布', low: '少', high: '多', gradient: 'linear-gradient(to right, #f2f0f7, #cbc9e2, #9e9ac8, #756bb1, #54278f)' },
  };
  const current = legends[activeLayer] || legends.traffic;
  return (
    <div className="legend-control">
      <h4>{current.title}</h4>
      <div className="legend-gradient" style={{ background: current.gradient }}></div>
      <div className="legend-labels">
        <span>{current.low}</span>
        <span>{current.high}</span>
      </div>
    </div>
  );
};

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [activeLayer, setActiveLayer] = useState('traffic'); // 'traffic', 'spendingPower', 'competition'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/heatmap')
      .then(res => res.json())
      .then(data => {
        // 转换数据格式，添加坐标信息
        const processedData = data.dataPoints.map(point => ({
          ...point,
          coordinates: [
            30.2741 + (Math.random() - 0.5) * 0.1, // 随机生成杭州附近的坐标
            120.1551 + (Math.random() - 0.5) * 0.1
          ],
          // 将文本格式的竞争度转换为数值
          competition: point.competition === "高" ? 80 : 
                      point.competition === "中" ? 50 : 
                      point.competition === "低" ? 20 : 0
        }));
        setHeatmapData(processedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch heatmap data:", err);
        setLoading(false);
      });
  }, []);

  const getLayerData = (layer) => {
    if (!heatmapData || heatmapData.length === 0) return [];
    return heatmapData.map(p => [p.coordinates[0], p.coordinates[1], p[layer]]);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>加载热力数据中...</p></div>;

  return (
    <div className="heatmap-page-container">
      <div className="heatmap-header">
        <h2>区域热力分析</h2>
        <p>通过多维度数据洞察市场格局，做出科学决策。</p>
      </div>
      <div className="heatmap-map-wrapper">
        <MapContainer center={[30.2741, 120.1551]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <CustomHeatmapLayer
            points={getLayerData(activeLayer)}
            radius={30}
            blur={20}
            max={activeLayer === 'traffic' ? 10000 : 100}
          />
        </MapContainer>
        <div className="heatmap-controls">
          <button onClick={() => setActiveLayer('traffic')} className={activeLayer === 'traffic' ? 'active' : ''}>人流热力</button>
          <button onClick={() => setActiveLayer('spendingPower')} className={activeLayer === 'spendingPower' ? 'active' : ''}>消费热力</button>
          <button onClick={() => setActiveLayer('competition')} className={activeLayer === 'competition' ? 'active' : ''}>竞品分布</button>
        </div>
        <Legend activeLayer={activeLayer} />
      </div>
    </div>
  );
};

export default Heatmap;
