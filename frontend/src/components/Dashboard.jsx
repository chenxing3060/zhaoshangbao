import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// 模拟数据
const statsData = [
  { title: '待处理任务', value: '12', change: '+5%', changeType: 'increase', icon: '📋' },
  { title: '跟进中品牌', value: '89', change: '+12', changeType: 'increase', icon: '🏷️' },
  { title: '本月签约', value: '8', change: '-15%', changeType: 'decrease', icon: '✍️' },
  { title: '铺位空置率', value: '6.8%', change: '+0.5%', changeType: 'decrease', icon: '🏢' },
];

const chartData = [
  { name: '一月', '已签约': 4, '高意向': 10 },
  { name: '二月', '已签约': 3, '高意向': 15 },
  { name: '三月', '已签约': 5, '高意向': 12 },
  { name: '四月', '已签约': 7, '高意向': 20 },
  { name: '五月', '已签约': 6, '高意向': 18 },
  { name: '六月', '已签约': 8, '高意向': 25 },
];

const activityData = [
  { user: '王经理', action: '更新了 "城市之心购物中心" 的招商状态', time: '2小时前' },
  { user: 'AI助手', action: '为您生成了 "潮流文创园" 的匹配报告', time: '5小时前' },
  { user: '李招商', action: '添加了新品牌 "元気森林" 到品牌库', time: '昨天' },
  { user: '系统', action: '铺位 "A-101" 的竞标已于1小时后开始', time: '昨天' },
];

const Dashboard = ({ setActiveTab }) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>我的工作台</h2>
        <p>早上好！祝您今天工作顺利，硕果累累。</p>
      </header>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h4>{stat.title}</h4>
              <p className="stat-value">{stat.value}</p>
              <span className={`stat-change ${stat.changeType}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        {/* Chart Section */}
        <div className="chart-card card">
          <h3>近6个月招商进度</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="高意向" fill="#8884d8" />
              <Bar dataKey="已签约" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="activity-card card">
          <h3>近期动态</h3>
          <ul className="activity-feed">
            {activityData.map((item, index) => (
              <li key={index} className="activity-item">
                <div className="activity-meta">
                  <strong>{item.user}</strong>
                  <span className="activity-time">{item.time}</span>
                </div>
                <p className="activity-action">{item.action}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;