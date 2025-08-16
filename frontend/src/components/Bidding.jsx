import React, { useState } from 'react';
import './Bidding.css';

// --- Hardcoded Mock Data for Demo ---
// This ensures the component is self-contained and avoids any issues with data fetching.
const MOCK_SPOTS = [
  {
    "id": 101,
    "name": "中庭黄金展位 A-1",
    "description": "位于市中心购物中心一楼中庭，人流量巨大，适合品牌快闪活动。",
    "area": 25,
    "starting_bid": 20000,
    "current_bid": 25000,
    "bid_increment": 1000,
    "image_url": "/images/spot_a1.jpg" // Path relative to the 'public' directory
  },
  {
    "id": 102,
    "name": "临街独立商铺 B-8",
    "description": "社区商业街入口处，展示面好，适合零售或轻餐饮。",
    "area": 80,
    "starting_bid": 15000,
    "current_bid": 15000,
    "bid_increment": 500,
    "image_url": "/images/spot_b8.jpg" // Path relative to the 'public' directory
  }
];

const generateMockHistory = (currentBid) => [
  { user: '用户_***34e', amount: currentBid, time: '刚刚' },
  { user: '用户_***8f2', amount: currentBid - 1000, time: '2分钟前' },
  { user: '用户_***a1c', amount: currentBid - 2500, time: '3分钟前' },
];
// --- End of Mock Data ---


const Bidding = () => {
  const [spots, setSpots] = useState(MOCK_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState(MOCK_SPOTS[0]);
  const [bidAmount, setBidAmount] = useState(selectedSpot.current_bid + selectedSpot.bid_increment);
  const [bidHistory, setBidHistory] = useState(generateMockHistory(selectedSpot.current_bid));

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
    setBidAmount(spot.current_bid + spot.bid_increment);
    setBidHistory(generateMockHistory(spot.current_bid));
  };

  const submitBid = () => {
    // This is a mock submission for the demo.
    if (!selectedSpot) return;

    if (bidAmount < selectedSpot.current_bid + selectedSpot.bid_increment) {
      alert(`出价必须高于当前价+加价幅度 (¥${selectedSpot.current_bid + selectedSpot.bid_increment})`);
      return;
    }
    
    alert(`成功为 "${selectedSpot.name}" 出价 ¥${bidAmount}！\n(这是一个演示操作)`);

    // Update UI optimistically
    const updatedSpot = { ...selectedSpot, current_bid: bidAmount };
    const updatedSpots = spots.map(s => s.id === selectedSpot.id ? updatedSpot : s);
    setSpots(updatedSpots);
    setSelectedSpot(updatedSpot);
    
    const newHistory = [{ user: '您', amount: bidAmount, time: '刚刚' }, ...bidHistory];
    setBidHistory(newHistory);

    setBidAmount(updatedSpot.current_bid + updatedSpot.bid_increment);
  };

  if (!selectedSpot) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="bidding-layout">
      {/* Left Panel: List of Biddable Spots */}
      <div className="bidding-list-panel">
        <div className="panel-header">
          <h3>竞标列表</h3>
        </div>
        <div className="spots-list">
          {spots.map(spot => (
            <div 
              key={spot.id} 
              className={`spot-summary-card ${selectedSpot.id === spot.id ? 'active' : ''}`}
              onClick={() => handleSelectSpot(spot)}
            >
              <img src={spot.image_url} alt={spot.name} />
              <div className="summary-info">
                <h4>{spot.name}</h4>
                <p>当前价: <strong>¥{spot.current_bid.toLocaleString()}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Bidding Details */}
      <div className="bidding-detail-panel">
        <div className="detail-header">
          <h2>{selectedSpot.name}</h2>
          <span className="bidding-status">竞价中</span>
        </div>
        <p className="detail-description">{selectedSpot.description}</p>
        <div className="detail-image-container">
          <img src={selectedSpot.image_url} alt={selectedSpot.name} />
        </div>
        
        <div className="bidding-main-content">
          <div className="bidding-info-card">
            <h4>铺位信息</h4>
            <p><strong>面积:</strong> {selectedSpot.area} m²</p>
            <p><strong>起拍价:</strong> ¥{selectedSpot.starting_bid.toLocaleString()}</p>
            <p><strong>加价幅度:</strong> ¥{selectedSpot.bid_increment.toLocaleString()}</p>
            <p><strong>结束时间:</strong> <span className="countdown">2小时 15分钟</span></p>
          </div>
          
          <div className="bidding-action-card">
            <div className="current-price-display">
              <label>当前最高价</label>
              <span>¥{selectedSpot.current_bid.toLocaleString()}</span>
            </div>
            <div className="bid-input-group">
              <input 
                type="number" 
                value={bidAmount}
                onChange={e => setBidAmount(Number(e.target.value))}
              />
              <button className="bid-button" onClick={submitBid}>出价</button>
            </div>
            <div className="quick-bid-buttons">
              <button onClick={() => setBidAmount(bidAmount + 100)}>+100</button>
              <button onClick={() => setBidAmount(bidAmount + 500)}>+500</button>
              <button onClick={() => setBidAmount(bidAmount + 1000)}>+1000</button>
            </div>
          </div>
        </div>

        <div className="bid-history-card">
          <h4>出价历史</h4>
          <ul className="bid-history-list">
            {bidHistory.map((bid, index) => (
              <li key={index} className={`bid-history-item ${bid.user === '您' ? 'my-bid' : ''}`}>
                <span>{bid.user}</span>
                <span className="history-amount">¥{bid.amount.toLocaleString()}</span>
                <span className="history-time">{bid.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bidding;