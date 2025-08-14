import React, { useState, useEffect } from 'react';
import './Matcher.css';

// 模拟业态数据
const allBusinessTypes = ["潮流服饰", "特色餐饮", "生活家居", "美妆护肤", "运动户外", "亲子教育", "数码科技", "文创艺术"];

const Matcher = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [matchCriteria, setMatchCriteria] = useState({
    rent: 500,
    types: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);

  useEffect(() => {
    // 初始加载项目列表
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to fetch projects:", err));
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setMatchCriteria({
      rent: project.rent_max,
      types: [project.target_audience], // 默认选中项目的目标客群
    });
    setMatchResults([]); // 清空旧结果
  };

  const handleCriteriaChange = (key, value) => {
    setMatchCriteria(prev => ({ ...prev, [key]: value }));
  };

  const toggleBusinessType = (type) => {
    const newTypes = matchCriteria.types.includes(type)
      ? matchCriteria.types.filter(t => t !== type)
      : [...matchCriteria.types, type];
    handleCriteriaChange('types', newTypes);
  };

  const handleMatch = () => {
    if (!selectedProject) return;
    setIsLoading(true);
    // 模拟API调用和AI计算延迟
    setTimeout(() => {
      fetch(`/api/match/${selectedProject.id}`)
        .then(res => res.json())
        .then(data => {
          // 模拟基于条件的过滤
          const filteredData = data.filter(brand => 
            brand.rent_budget >= matchCriteria.rent * 0.8 && // 预算不低于设定值的80%
            matchCriteria.types.some(type => brand.type.includes(type) || brand.reason.includes(type)) // 业态或原因匹配
          ).sort((a, b) => b.match_score - a.match_score);
          setMatchResults(filteredData);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch match results:", err);
          setIsLoading(false);
        });
    }, 1500); // 模拟1.5秒的AI计算时间
  };

  return (
    <div className="matcher-container">
      <div className="matcher-header">
        <h2>AI 智能匹配引擎</h2>
        <p>三步完成项目与品牌的精准匹配，发掘商业最大潜力。</p>
      </div>

      <div className="matcher-steps">
        {/* Step 1: Select Project */}
        <div className="step-card">
          <div className="step-header">
            <span className="step-number">1</span>
            <h3>选择目标项目</h3>
          </div>
          <div className="project-selection-list">
            {projects.map(p => (
              <div 
                key={p.id} 
                className={`project-item ${selectedProject?.id === p.id ? 'selected' : ''}`}
                onClick={() => handleSelectProject(p)}
              >
                <h4>{p.name}</h4>
                <p>{p.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Set Criteria */}
        {selectedProject && (
          <div className="step-card">
            <div className="step-header">
              <span className="step-number">2</span>
              <h3>设定匹配条件</h3>
            </div>
            <div className="criteria-form">
              <div className="form-group">
                <label>租金预算 (元/m²): <strong>{matchCriteria.rent}</strong></label>
                <input
                  type="range"
                  min={selectedProject.rent_min}
                  max={selectedProject.rent_max}
                  value={matchCriteria.rent}
                  onChange={(e) => handleCriteriaChange('rent', parseInt(e.target.value))}
                  className="rent-slider"
                />
              </div>
              <div className="form-group">
                <label>期望业态</label>
                <div className="business-types-selector">
                  {allBusinessTypes.map(type => (
                    <span 
                      key={type}
                      className={`type-tag ${matchCriteria.types.includes(type) ? 'selected' : ''}`}
                      onClick={() => toggleBusinessType(type)}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <button className="match-button" onClick={handleMatch} disabled={isLoading}>
                {isLoading ? 'AI匹配中...' : '开始智能匹配'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: View Results */}
        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>AI引擎正在从 <strong>1,382</strong> 个品牌中为您筛选最佳匹配...</p>
          </div>
        )}

        {!isLoading && matchResults.length > 0 && (
          <div className="step-card">
            <div className="step-header">
              <span className="step-number">3</span>
              <h3>智能匹配结果</h3>
            </div>
            <div className="results-grid">
              {matchResults.map(brand => (
                <div key={brand.id} className="brand-card">
                  <div className="brand-card-header">
                    <span className="brand-name">{brand.name}</span>
                    <div className="match-score-badge">
                      <span>匹配分</span>
                      <strong>{brand.match_score}</strong>
                    </div>
                  </div>
                  <p className="brand-details">{brand.type} | 预算: ¥{brand.rent_budget}/m² | 需求: {brand.area_needed}m²</p>
                  <div className="match-reasons">
                    <span className="reason-tag">{brand.reason}</span>
                    {brand.match_score > 85 && <span className="reason-tag highlight">租金匹配</span>}
                    {brand.match_score > 90 && <span className="reason-tag highlight">客群高度重合</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
         {!isLoading && matchResults.length === 0 && selectedProject && (
          <div className="no-results-found">
            <p>根据当前条件，暂未找到合适的品牌。请尝试放宽筛选条件。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matcher;
