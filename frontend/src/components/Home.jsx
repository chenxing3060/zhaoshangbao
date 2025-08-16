import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>欢迎使用招商宝</h1>
        <p className="subtitle">由北京艺科新境公司倾力打造，您的一站式智能选址与商业决策平台。</p>
      </header>
      
      <main className="home-main-content">
        <section className="intro-section">
          <h2>什么是招商宝？</h2>
          <p>
            招商宝利用大数据与人工智能技术，为连锁品牌、商业地产及创业者提供精准的铺位匹配、市场分析与竞品洞察。我们致力于简化商业决策流程，助您轻松锁定黄金铺位，抢占市场先机。
          </p>
        </section>
        
        <section className="features-section">
          <h2>核心功能模块</h2>
          <div className="features-grid">
            <Link to="/matcher" className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>智能匹配</h3>
              <p>根据您的品牌定位与需求，从海量铺源中精准匹配最佳选择。</p>
            </Link>
            <Link to="/finder" className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>品牌选址</h3>
              <p>在地图上直观浏览、筛选和对比不同铺位，快速找到理想位置。</p>
            </Link>
            <Link to="/bidding" className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>铺位竞标</h3>
              <p>参与热门铺位的实时竞价，透明、公正地获取心仪的商业空间。</p>
            </Link>
            <Link to="/heatmap" className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>区域热力分析</h3>
              <p>通过人流、消费、竞品等多维度热力图，洞察区域市场潜力。</p>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="home-footer">
        <p>&copy; 2025 北京艺科新境公司. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;