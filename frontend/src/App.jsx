import React, { useState } from 'react';
import Matcher from './components/Matcher';
import Bidding from './components/Bidding';
import LocationFinder from './components/LocationFinder';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap'; // Import Heatmap
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'matcher':
        return <Matcher />;
      case 'bidding':
        return <Bidding />;
      case 'locationFinder':
        return <LocationFinder />;
      case 'heatmap':
        return <Heatmap />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: '我的工作台' },
    { id: 'matcher', icon: '🎯', label: '智能匹配' },
    { id: 'bidding', icon: '💰', label: '铺位竞标' },
    { id: 'locationFinder', icon: '🔍', label: '品牌选址' },
    { id: 'heatmap', icon: '🗺️', label: '区域热力分析' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <h1>招商宝</h1>
          <span>商业地产智慧引擎</span>
        </div>
        <nav className="main-nav">
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <a
                  href="#"
                  className={activeTab === item.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
