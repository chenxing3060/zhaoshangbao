import React, { useState, useEffect } from 'react';
import './Bidding.css';

// 模拟的出价历史数据
const generateMockHistory = (currentBid) => [
  { user: '用户_***34e', amount: currentBid, time: '刚刚' },
  { user: '用户_***8f2', amount: currentBid - 1000, time: '2分钟前' },
  { user: '用户_***a1c', amount: currentBid - 2500, time: '3分钟前' },
];

const Bidding = () => {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/bidding/spots')
      .then(res => res.json())
      .then(data => {
        setSpots(data);
        if (data.length > 0) {
          handleSelectSpot(data[0]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch spots", err);
        setError("加载竞标铺位失败，请稍后再试。");
      });
  }, []);

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
    setBidAmount(spot.current_bid + spot.bid_increment);
    setBidHistory(generateMockHistory(spot.current_bid));
  };

  const submitBid = () => {
    if (!selectedSpot) return;

    if (bidAmount < selectedSpot.current_bid + selectedSpot.bid_increment) {
      alert(`出价必须高于当前价+加价幅度 (¥${selectedSpot.current_bid + selectedSpot.bid_increment})`);
      return;
    }

    // 调用真实API
    fetch('/api/bidding/bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spot_id: selectedSpot.id,
        bid_amount: bidAmount
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // 更新UI
        const updatedSpot = { 
          ...selectedSpot, 
          current_bid: data.new_bid || bidAmount,
          premium_rate: ((data.new_bid - selectedSpot.starting_bid) / selectedSpot.starting_bid) * 100
        };
        const updatedSpots = spots.map(s => s.id === selectedSpot.id ? updatedSpot : s);
        setSpots(updatedSpots);
        setSelectedSpot(updatedSpot);
        
        // 更新出价历史
        const newHistory = [{ user: '您', amount: bidAmount, time: '刚刚' }, ...bidHistory];
        setBidHistory(newHistory);

        // 准备下一次出价
        setBidAmount(updatedSpot.current_bid + updatedSpot.bid_increment);
      } else {
        alert(data.message || '出价失败，请重试');
      }
    })
    .catch(err => {
      console.error("出价提交失败", err);
      alert("出价提交失败，请稍后再试");
    });
  };

  if (error) return <p className="error-message">{error}</p>;
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
