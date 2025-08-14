import React, { useState, useEffect } from 'react';
import './GuideTooltip.css';

const GuideTooltip = ({ storageKey, title, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has seen this tooltip before
    const hasSeen = localStorage.getItem(storageKey);
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleClose = () => {
    // Hide the tooltip and mark it as seen
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="guide-tooltip-overlay">
      <div className="guide-tooltip-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <button onClick={handleClose}>我知道了</button>
      </div>
    </div>
  );
};

export default GuideTooltip;