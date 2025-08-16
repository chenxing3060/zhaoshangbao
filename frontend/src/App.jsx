import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Matcher from './components/Matcher';
import Bidding from './components/Bidding';
import LocationFinder from './components/LocationFinder';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import './App.css';

const App = () => {
  const navItems = [
    { id: 'home', path: '/', icon: '🏠', label: '首页' },
    { id: 'dashboard', path: '/dashboard', icon: '📊', label: '我的工作台' },
    { id: 'matcher', path: '/matcher', icon: '🎯', label: '智能匹配' },
    { id: 'bidding', path: '/bidding', icon: '💰', label: '铺位竞标' },
    { id: 'locationFinder', path: '/finder', icon: '🔍', label: '品牌选址' },
    { id: 'heatmap', path: '/heatmap', icon: '🗺️', label: '区域热力分析' },
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
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  end={item.path === '/'} // Ensures only home is active on root
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matcher" element={<Matcher />} />
          <Route path="/bidding" element={<Bidding />} />
          <Route path="/finder" element={<LocationFinder />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;