import React, { useState } from 'react';

export default function DetailedAnalysis({ onNavigate, analysisResult }) {
  const [activeTab, setActiveTab] = useState('propagation');

  const handleTabClick = (tabId, elementId) => {
    setActiveTab(tabId);
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Fallback defaults if no analysis has been executed yet
  const result = analysisResult || {
    verdict: 'REAL',
    confidence: 92.4,
    date: 'July 4, 2026',
    processingTime: '2.3 seconds',
    model: 'NEGT v1.2',
    stats: {
      nodes: 156,
      edges: 234,
      words: 1245,
      sources: 3,
      mentions: 23
    }
  };

  const isFake = result.verdict === 'FAKE';
  const isUncertain = result.verdict === 'UNCERTAIN';

  return (
    <div className="detailed-analysis-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard')}>Detect News</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Detailed Analysis</span>
      </div>

      {/* SECTION A: Summary Card (Top) */}
      <div className="summary-card-panel glass-panel">
        <div className="summary-card-header">
          <span className="report-title-label">AI VERIFICATION ANALYSIS REPORT</span>
          <h2>"Trump Syrian Refugees Claims" &amp; Cascade Patterns</h2>
        </div>
        
        <div className="summary-card-grid">
          <div className="summary-col">
            <span className="label">Verification Verdict</span>
            <div className={`summary-verdict-badge ${result.verdict.toLowerCase()}`}>
              <span className="dot"></span>
              {result.verdict === 'REAL' ? 'LIKELY REAL' : result.verdict === 'FAKE' ? 'LIKELY FAKE' : 'UNCERTAIN'}
              <span className="conf">({result.confidence}% Conf.)</span>
            </div>
          </div>
          
          <div className="summary-col">
            <span className="label">Analysis Timestamp</span>
            <span className="val">{result.date}</span>
          </div>

          <div className="summary-col">
            <span className="label">Processing Duration</span>
            <span className="val">{result.processingTime}</span>
          </div>

          <div className="summary-col">
            <span className="label">Inference Model</span>
            <span className="val">{result.model}</span>
          </div>
        </div>
      </div>

      {/* SECTION B: Scrollable Unified Results */}
      <div className="tabbed-results-panel glass-panel">
        {/* Tab Anchor Headers */}
        <div className="tab-headers-row sticky-tab-headers">
          <button 
            className={`tab-btn ${activeTab === 'propagation' ? 'active' : ''}`}
            onClick={() => handleTabClick('propagation', 'propagation-section')}
          >
            📊 Propagation Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'noise' ? 'active' : ''}`}
            onClick={() => handleTabClick('noise', 'noise-section')}
          >
            🔍 Noise Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attribution' ? 'active' : ''}`}
            onClick={() => handleTabClick('attribution', 'attribution-section')}
          >
            🎯 Feature Attribution
          </button>
          <button 
            className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => handleTabClick('metrics', 'metrics-section')}
          >
            📋 Detailed Metrics
          </button>
        </div>

        {/* Tab Body - Stacked Sections */}
        <div className="tab-content-body scrollable-content-body">
          
          {/* SECTION 1: Propagation Analytics */}
          <div id="propagation-section" className="tab-pane propagation-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>📊 Propagation Analytics</h3>
              <p className="text-secondary text-xs mt-1">GNN propagation cascade dynamics and news authenticity timelines.</p>
            </div>
            
            <div className="charts-grid-layout mt-6">
              {/* 1. Engagement Timeline Line Chart */}
              <div className="chart-card-sub glass-panel">
                <h4>Engagement Timeline (Line Chart)</h4>
                <p className="chart-subtitle">Cascade propagation frequency over first 48 hours</p>
                <div className="svg-chart-container">
                  <svg viewBox="0 0 400 200" width="100%" height="150" className="svg-element">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="40" y1="70" x2="380" y2="70" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="40" y1="120" x2="380" y2="120" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="#1e293b" />
                    <line x1="40" y1="20" x2="40" y2="170" stroke="#1e293b" />

                    {/* X Axis Labels */}
                    <text x="40" y="188" fill="var(--text-muted)" fontSize="9">0h</text>
                    <text x="125" y="188" fill="var(--text-muted)" fontSize="9">12h</text>
                    <text x="210" y="188" fill="var(--text-muted)" fontSize="9">24h</text>
                    <text x="295" y="188" fill="var(--text-muted)" fontSize="9">36h</text>
                    <text x="380" y="188" fill="var(--text-muted)" fontSize="9">48h</text>

                    {/* Y Axis Labels */}
                    <text x="10" y="23" fill="var(--text-muted)" fontSize="9">1.2k</text>
                    <text x="10" y="73" fill="var(--text-muted)" fontSize="9">800</text>
                    <text x="10" y="123" fill="var(--text-muted)" fontSize="9">400</text>
                    <text x="10" y="173" fill="var(--text-muted)" fontSize="9">0</text>

                    {/* Confidence Band (Area) */}
                    {isFake ? (
                      <path d="M 40 170 Q 70 80, 100 30 T 150 90 T 250 140 T 380 160 L 380 170 Z" fill="rgba(216, 90, 48, 0.15)" />
                    ) : (
                      <path d="M 40 170 Q 100 150, 180 110 T 280 80 T 380 50 L 380 170 Z" fill="rgba(29, 158, 117, 0.15)" />
                    )}

                    {/* Graph Line */}
                    {isFake ? (
                      <path 
                        d="M 40 170 Q 70 80, 100 30 T 150 90 T 250 140 T 380 160" 
                        fill="none" 
                        stroke="var(--accent-coral)" 
                        strokeWidth="3.5" 
                      />
                    ) : (
                      <path 
                        d="M 40 170 Q 100 150, 180 110 T 280 80 T 380 50" 
                        fill="none" 
                        stroke="var(--secondary-teal)" 
                        strokeWidth="3.5" 
                      />
                    )}

                    {/* Anchor point */}
                    {isFake ? (
                      <circle cx="100" cy="30" r="5" fill="var(--accent-coral)" />
                    ) : (
                      <circle cx="280" cy="80" r="5" fill="var(--secondary-teal)" />
                    )}
                  </svg>
                </div>
                <p className="chart-footer-text">
                  {isFake ? "⚠️ Abnormal spike velocity indicates bot automation." : "✓ Steady growth indicating organic peer sharing."}
                </p>
              </div>

               {/* 2. Source Distribution Donut Chart */}
              <div className="chart-card-sub glass-panel">
                <h4>Source Domain Referencing (Donut Chart)</h4>
                <p className="chart-subtitle">Domain categories ratios</p>
                <div className="donut-chart-layout">
                  <div className="donut-graphic">
                    <svg viewBox="0 0 100 100" width="100" height="100">
                      {isFake ? (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2d9cf" strokeWidth="10" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4CAF50" strokeWidth="10" strokeDasharray="35 251" strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0D6EFD" strokeWidth="10" strokeDasharray="155 251" strokeDashoffset="-35" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F44336" strokeWidth="10" strokeDasharray="61 251" strokeDashoffset="-190" />
                        </>
                      ) : (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2d9cf" strokeWidth="10" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4CAF50" strokeWidth="10" strokeDasharray="160 251" strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0D6EFD" strokeWidth="10" strokeDasharray="63 251" strokeDashoffset="-160" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F44336" strokeWidth="10" strokeDasharray="28 251" strokeDashoffset="-223" />
                        </>
                      )}
                      <circle cx="50" cy="50" r="32" fill="#fff" />
                      <text x="50" y="53" textAnchor="middle" fill="#1e293b" fontSize="6.5" fontWeight="bold">
                        {isFake ? "Bot Heavy" : "Credible"}
                      </text>
                    </svg>
                  </div>
                  <div className="donut-legend">
                    <div className="legend-item">
                      <span className="dot" style={{backgroundColor: '#4CAF50'}}></span>
                      <span className="lbl">Verified Press</span>
                      <span className="val">{isFake ? '14%' : '64%'}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot" style={{backgroundColor: '#0D6EFD'}}></span>
                      <span className="lbl">Social Nets</span>
                      <span className="val">{isFake ? '62%' : '25%'}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot" style={{backgroundColor: '#F44336'}}></span>
                      <span className="lbl">Blogs / Other</span>
                      <span className="val">{isFake ? '24%' : '11%'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Cascade Depth & Breadth Bar Chart */}
              <div className="chart-card-sub glass-panel">
                <h4>Cascade Depth & Breadth (Bar Chart)</h4>
                <p className="chart-subtitle">Cascade propagation metrics</p>
                <div className="bar-chart-visual mt-4">
                  <svg viewBox="0 0 200 100" width="100%" height="90">
                    {/* Hops */}
                    <text x="10" y="25" fill="#475569" fontSize="8" fontWeight="bold">Max Hops</text>
                    <rect x="70" y="16" width={isFake ? "80" : "100"} height="12" fill="#0D6EFD" rx="3" />
                    <text x={isFake ? "155" : "175"} y="25" fill="#1e293b" fontSize="8" fontWeight="bold">{isFake ? '4' : '5'}</text>

                    {/* Average Breadth */}
                    <text x="10" y="50" fill="#475569" fontSize="8" fontWeight="bold">Avg Breadth</text>
                    <rect x="70" y="41" width={isFake ? "120" : "40"} height="12" fill="#FF9800" rx="3" />
                    <text x={isFake ? "195" : "115"} y="50" fill="#1e293b" fontSize="8" fontWeight="bold">{isFake ? '11.2' : '3.6'}</text>

                    {/* Virality */}
                    <text x="10" y="75" fill="#475569" fontSize="8" fontWeight="bold">Virality Score</text>
                    <rect x="70" y="66" width={isFake ? "95" : "30"} height="12" fill="#00A8E8" rx="3" />
                    <text x={isFake ? "170" : "105"} y="75" fill="#1e293b" fontSize="8" fontWeight="bold">{isFake ? '8.4' : '2.1'}</text>
                  </svg>
                </div>
              </div>

              {/* 4. Emotional Distribution Stacked Bar */}
              <div className="chart-card-sub glass-panel">
                <h4>User Emotional Distribution (Stacked Bar)</h4>
                <p className="chart-subtitle">Aggregate emotional response ratios</p>
                <div className="stacked-bar-container mt-6">
                  <div className="stacked-bar-track" style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: isFake ? '58%' : '12%', backgroundColor: '#F44336', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>
                      {isFake ? '58%' : '12%'}
                    </div>
                    <div style={{ width: isFake ? '34%' : '24%', backgroundColor: '#FF9800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>
                      {isFake ? '34%' : '24%'}
                    </div>
                    <div style={{ width: isFake ? '8%' : '64%', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>
                      {isFake ? '8%' : '64%'}
                    </div>
                  </div>
                  <div className="stacked-bar-legend mt-4" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569' }}>
                    <span>🔴 Angry/Hostile</span>
                    <span>🟡 Skeptical</span>
                    <span>🟢 Trusting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" style={{ borderTop: '1px solid #e8dfd5' }}></div>

          {/* SECTION 2: Noise Analysis */}
          <div id="noise-section" className="tab-pane noise-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>🔍 Information Bottleneck Denoising Analysis</h3>
              <p className="text-secondary text-xs mt-1">NEGT isolates user accounts and propagation links that carry no news-verifying value.</p>
            </div>

            <div className="noise-metrics-grid mt-6">
              {/* Radial Gauge for Noise Filtering Score */}
              <div className="noise-metric-card glass-panel highlight-teal" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2d9cf" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4CAF50" strokeWidth="8" strokeDasharray={isFake ? "223 251" : "246 251"} strokeLinecap="round" transform="rotate(-90 50 50)" />
                    <text x="50" y="55" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">
                      {isFake ? '89%' : '98%'}
                    </text>
                  </svg>
                </div>
                <div>
                  <span className="score-label" style={{ fontSize: '15px', fontWeight: 'bold' }}>GIB Noise Filtering Score</span>
                  <p className="score-desc" style={{ marginTop: '4px' }}>Percentage of irrelevant social noise filtered by the Graph Information Bottleneck.</p>
                </div>
              </div>

              {/* Small Bar Chart for patterns */}
              <div className="noise-metric-card glass-panel" style={{ gridColumn: 'span 2' }}>
                <h4>Suspicious Patterns & Bot Activity Summary</h4>
                <div style={{ marginTop: '12px' }}>
                  {/* Suspicious Patterns */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
                    <span>Suspicious Patterns Detected</span>
                    <span style={{ fontWeight: 'bold' }}>{isFake ? '7' : '1'}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2d9cf', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: isFake ? '70%' : '10%', height: '100%', backgroundColor: '#F44336' }}></div>
                  </div>

                  {/* Bot Activity Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
                    <span>Bot-like Activity Rating</span>
                    <span style={{ fontWeight: 'bold' }}>{isFake ? '42%' : '4%'}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2d9cf', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: isFake ? '42%' : '4%', height: '100%', backgroundColor: '#FF9800' }}></div>
                  </div>

                  {/* Anomalous Links */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
                    <span>Anomalous Links / Clickbaits</span>
                    <span style={{ fontWeight: 'bold' }}>{isFake ? '3' : '0'}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2d9cf', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: isFake ? '60%' : '0%', height: '100%', backgroundColor: '#0D6EFD' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="noise-insight-panel glass-panel mt-6">
              <h4>Information Bottleneck Denoising Mechanism</h4>
              <p>
                Standard GNNs are highly susceptible to "structural noise" – thousands of random retweeters 
                drowning out the early credibility patterns. Our model introduces a **Graph Information Bottleneck** 
                that regularizes representation learning. It compresses the input graph structures, pruning irrelevant 
                nodes (with up to 89% precision) and leaving a high-fidelity diagnostic backbone.
              </p>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" style={{ borderTop: '1px solid #1e293b' }}></div>

          {/* SECTION 3: Feature Attribution */}
          <div id="attribution-section" className="tab-pane attribution-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>🎯 Model Feature Attribution Breakdown</h3>
              <p className="text-secondary text-xs mt-1">Weight contribution of different GNN structural signals toward the final verdict classification.</p>
            </div>

            <div className="chart-card-sub glass-panel mt-6" style={{ padding: '20px' }}>
              <h4>GNN Structural Weights Rank (Horizontal Bar Chart)</h4>
              <p className="chart-subtitle">Prioritized signals for cascade classification</p>
              <div className="svg-chart-container mt-4">
                <svg viewBox="0 0 400 160" width="100%" height="160" className="svg-element">
                  {/* Bar 1: Early User Credibility */}
                  <text x="10" y="25" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">Early User Credibility</text>
                  <rect x="140" y="14" width={isFake ? "92" : "116"} height="16" fill="#0D6EFD" rx="4" />
                  <text x={isFake ? "242" : "266"} y="26" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">{isFake ? '23%' : '29%'}</text>

                  {/* Bar 2: Source Domain Trust */}
                  <text x="10" y="60" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">Source Domain Trust</text>
                  <rect x="140" y="49" width={isFake ? "76" : "140"} height="16" fill="#00A8E8" rx="4" />
                  <text x={isFake ? "226" : "290"} y="61" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">{isFake ? '19%' : '35%'}</text>

                  {/* Bar 3: Engagement Velocity */}
                  <text x="10" y="95" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">Engagement Velocity</text>
                  <rect x="140" y="84" width={isFake ? "72" : "32"} height="16" fill="#FF9800" rx="4" />
                  <text x={isFake ? "222" : "182"} y="96" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">{isFake ? '18%' : '8%'}</text>

                  {/* Bar 4: Propagation Diversity */}
                  <text x="10" y="130" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">Propagation Diversity</text>
                  <rect x="140" y="119" width={isFake ? "60" : "72"} height="16" fill="#4CAF50" rx="4" />
                  <text x={isFake ? "210" : "222"} y="131" fill="var(--text-primary)" fontSize="9.5" fontWeight="bold">{isFake ? '15%' : '18%'}</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" style={{ borderTop: '1px solid #e8dfd5' }}></div>

          {/* SECTION 4: Detailed Metrics */}
          <div id="metrics-section" className="tab-pane metrics-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>📋 Technical Performance Evaluation Metrics</h3>
              <p className="text-secondary text-xs mt-1">Operational benchmark scores for model evaluation.</p>
            </div>

            <div className="chart-card-sub glass-panel mt-6" style={{ padding: '20px' }}>
              <h4>Model Score vs. Benchmark Avg. (Grouped Bar Chart)</h4>
              <p className="chart-subtitle">Comparative performance against standard GNN baselines</p>
              <div className="svg-chart-container mt-4">
                <svg viewBox="0 0 500 220" width="100%" height="220" className="svg-element">
                  {/* Legend */}
                  <rect x="300" y="10" width="12" height="12" fill="#0D6EFD" rx="2" />
                  <text x="318" y="20" fill="var(--text-primary)" fontSize="9" fontWeight="bold">NEGT Model Score</text>
                  <rect x="410" y="10" width="12" height="12" fill="#8392a5" rx="2" />
                  <text x="428" y="20" fill="var(--text-primary)" fontSize="9" fontWeight="bold">Benchmark Avg.</text>

                  {/* Metric 1: Accuracy */}
                  <text x="10" y="50" fill="var(--text-primary)" fontSize="10" fontWeight="bold">Classification Accuracy</text>
                  <rect x="180" y="38" width="188" height="10" fill="#0D6EFD" rx="2" />
                  <rect x="180" y="50" width="170" height="10" fill="#8392a5" rx="2" />
                  <text x="380" y="47" fill="#0D6EFD" fontSize="9" fontWeight="bold">94.2%</text>
                  <text x="380" y="59" fill="#8392a5" fontSize="9">85.1%</text>

                  {/* Metric 2: Noise Robustness */}
                  <text x="10" y="95" fill="var(--text-primary)" fontSize="10" fontWeight="bold">Noise Robustness (GIB)</text>
                  <rect x="180" y="83" width="174" height="10" fill="#0D6EFD" rx="2" />
                  <rect x="180" y="95" width="104" height="10" fill="#8392a5" rx="2" />
                  <text x="380" y="92" fill="#0D6EFD" fontSize="9" fontWeight="bold">8.7/10</text>
                  <text x="380" y="104" fill="#8392a5" fontSize="9">5.2/10</text>

                  {/* Metric 3: Interpretability */}
                  <text x="10" y="140" fill="var(--text-primary)" fontSize="10" fontWeight="bold">Interpretability Score</text>
                  <rect x="180" y="128" width="182" height="10" fill="#0D6EFD" rx="2" />
                  <rect x="180" y="140" width="120" height="10" fill="#8392a5" rx="2" />
                  <text x="380" y="137" fill="#0D6EFD" fontSize="9" fontWeight="bold">9.1/10</text>
                  <text x="380" y="149" fill="#8392a5" fontSize="9">6.0/10</text>

                  {/* Metric 4: Inference Efficiency */}
                  <text x="10" y="185" fill="var(--text-primary)" fontSize="10" fontWeight="bold">Inference Speed (Efficiency)</text>
                  <rect x="180" y="173" width="184" height="10" fill="#0D6EFD" rx="2" />
                  <rect x="180" y="185" width="100" height="10" fill="#8392a5" rx="2" />
                  <text x="380" y="182" fill="#0D6EFD" fontSize="9" fontWeight="bold">0.8s (Fast)</text>
                  <text x="380" y="194" fill="#8392a5" fontSize="9">1.6s (Slow)</text>
                </svg>
              </div>
            </div>

            <table className="technical-metrics-table mt-6">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Model Score</th>
                  <th>Benchmark Avg.</th>
                  <th>Assessment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-name">Classification Accuracy</td>
                  <td className="val color-real">94.2%</td>
                  <td>85.1%</td>
                  <td>Excellent (+9.1% gain)</td>
                </tr>
                <tr>
                  <td className="metric-name">Noise Robustness (GIB)</td>
                  <td className="val color-real">8.7/10</td>
                  <td>5.2/10</td>
                  <td>Highly Resistant to Perturbation</td>
                </tr>
                <tr>
                  <td className="metric-name">Interpretability Score</td>
                  <td className="val color-real">9.1/10</td>
                  <td>6.0/10</td>
                  <td>Explainable Node Attention</td>
                </tr>
                <tr>
                  <td className="metric-name">Inference Latency</td>
                  <td className="val color-real">0.8s</td>
                  <td>1.6s</td>
                  <td>Low overhead, highly optimized</td>
                </tr>
              </tbody>
            </table>

            <div className="metrics-notes-box glass-panel mt-6">
              <h5>Model Hyperparameters:</h5>
              <p className="text-secondary text-xs">
                Layers: 4 transformer blocks | Heads: 8 divided partitions | GIB Bottleneck Ratio: 0.15 | Noise Scale: 0.05
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
