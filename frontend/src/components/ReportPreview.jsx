import React from 'react';
import './ReportPreview.css';

const ReportPreview = ({ location, onClose, onSwitchToCompetition }) => {
  if (!location) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>选址分析报告</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <h3>{location.name}</h3>
          <p className="report-address">{location.city}, {location.district}, {location.address}</p>
          
          <div className="report-section">
            <h4>核心数据概览</h4>
            <div className="report-grid">
              <div><strong>面积</strong><p>{location.area} m²</p></div>
              <div><strong>月租金</strong><p>¥{location.rent} / m²</p></div>
              <div><strong>适合业态</strong><p>{location.suitable_for.join(', ')}</p></div>
            </div>
          </div>

          <div className="report-section">
            <h4>周边客群分析 (模拟)</h4>
            <div className="report-grid">
              <div><strong>人口密度</strong><p>高</p></div>
              <div><strong>消费能力</strong><p>中高</p></div>
              <div><strong>主要客群</strong><p>年轻白领, 核心家庭</p></div>
            </div>
          </div>

          <div className="report-section">
            <h4>交通与竞品 (模拟)</h4>
            <p><strong>交通便利性:</strong> 临近地铁1号线，周边500米内有3个公交站，交通便捷。</p>
            <p><strong>周边竞品:</strong> 1公里范围内有2家同类型头部品牌，竞争中等。</p>
            <button onClick={onSwitchToCompetition} className="competition-button">
              在地图上查看周边竞品
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <p>报告由“招商宝”AI引擎生成</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;