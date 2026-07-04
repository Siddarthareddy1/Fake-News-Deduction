import React, { useState } from 'react';

export default function InterpretabilityMap({ onNavigate }) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const importanceRanking = [
    { id: 0, name: 'Source News (id=0)', handle: '@original_post', score: 9.6, fill: 'var(--accent-primary)', width: '96%' },
    { id: 5, name: 'User 5 (@credible)', handle: '@credible_user', score: 8.7, fill: 'var(--accent-secondary)', width: '87%' },
    { id: 12, name: 'User 12 (@verified)', handle: '@verified_news', score: 7.1, fill: 'var(--accent-secondary)', width: '71%' },
    { id: 23, name: 'User 23 (@bot)', handle: '@bot_account_1', score: 2.1, fill: 'var(--color-uncertain)', width: '21%' },
    { id: 7, name: 'User 7 (suspicious)', handle: '@clickbait_spammer', score: 0.8, fill: 'var(--color-fake)', width: '8%' }
  ];

  const networkAttention = {
    source: { x: 250, y: 50, label: "Source ★", score: 9.6 },
    children: [
      { id: 5, x: 130, y: 150, label: "User 5 (@credible)", weight: 9.2, type: 'user' },
      { id: 12, x: 250, y: 150, label: "User 12 (@verified)", weight: 8.7, type: 'user' },
      { id: 23, x: 370, y: 150, label: "User 23 (@bot)", weight: 2.1, type: 'bot' }
    ]
  };

  return (
    <div className="interpretability-heatmap-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Attention Interpretability</span>
      </div>

      <div className="interpretability-grid-layout">
        {/* Left Side: Importance Ranking */}
        <div className="heatmap-panel glass-panel">
          <div className="panel-header">
            <h3>🔥 Visual Attention Map - Key Nodes</h3>
            <p className="section-desc">Attention weights assigned by GNN self-attention layers</p>
          </div>

          <div className="importance-list mt-6">
            {importanceRanking.map((node) => (
              <div 
                key={node.id} 
                className={`importance-row-item ${hoveredNodeId === node.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <div className="importance-meta-labels">
                  <span className="name font-semibold">{node.name}</span>
                  <span className="score font-bold" style={{ color: node.fill }}>Score: {node.score}</span>
                </div>
                
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: node.width, 
                      backgroundColor: node.fill 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="study-insight-box mt-6">
            <span className="title font-semibold block text-xs">Model Interpretability:</span>
            <p className="text-secondary text-xs mt-1">
              Interpretability Score: **9.1/10**
            </p>
            <p className="text-secondary text-xs mt-2">
              ✓ **Insight**: The neural model focuses attention weights heavily on early-stage, 
              historically verified accounts (e.g. Source and User 5), while successfully ignoring 
              spam-like bot clusters.
            </p>
          </div>
        </div>

        {/* Right Side: Network Attention Weight Viz */}
        <div className="heatmap-panel glass-panel flex-col-center">
          <div className="panel-header w-full">
            <h3>🌐 Attention Network Visualization</h3>
            <p className="section-desc">Visualizing attention routing from the root news node</p>
          </div>

          <div className="network-viz-canvas-box mt-6 w-full">
            <svg viewBox="0 0 400 240" className="w-full h-56">
              {/* Lines from Source to Children */}
              {networkAttention.children.map((child) => {
                const isHovered = hoveredNodeId === child.id;
                
                return (
                  <g key={child.id}>
                    <line
                      x1={networkAttention.source.x}
                      y1={networkAttention.source.y}
                      x2={child.x}
                      y2={child.y}
                      stroke={child.type === 'bot' ? 'var(--color-fake)' : 'var(--accent-secondary)'}
                      strokeWidth={child.weight * 0.7}
                      opacity={isHovered ? 1.0 : 0.6}
                      className="transition-all"
                    />
                    
                    {/* Weight Text label positioned near middle of line */}
                    <rect 
                      x={(networkAttention.source.x + child.x) / 2 - 15}
                      y={(networkAttention.source.y + child.y) / 2 - 8}
                      width="30"
                      height="16"
                      rx="4"
                      fill="var(--bg-secondary)"
                      stroke="var(--border-muted)"
                      strokeWidth="1"
                    />
                    <text
                      x={(networkAttention.source.x + child.x) / 2}
                      y={(networkAttention.source.y + child.y) / 2 + 4}
                      fill="var(--text-primary)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {child.weight}
                    </text>
                  </g>
                );
              })}

              {/* Source Node */}
              <g>
                <circle
                  cx={networkAttention.source.x}
                  cy={networkAttention.source.y}
                  r="16"
                  fill="var(--bg-secondary)"
                  stroke="var(--accent-primary)"
                  strokeWidth="3"
                />
                <text
                  x={networkAttention.source.x}
                  y={networkAttention.source.y + 4}
                  fill="var(--text-primary)"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  SOURCE
                </text>
              </g>

              {/* Child Nodes */}
              {networkAttention.children.map((child) => {
                const isHovered = hoveredNodeId === child.id;
                
                return (
                  <g 
                    key={child.id}
                    onMouseEnter={() => setHoveredNodeId(child.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={child.x}
                      cy={child.y}
                      r="10"
                      fill={child.type === 'bot' ? 'var(--color-fake)' : 'var(--accent-secondary)'}
                      stroke={isHovered ? '#ffffff' : 'var(--bg-primary)'}
                      strokeWidth="2"
                    />
                    <text
                      x={child.x}
                      y={child.y + 22}
                      fill="var(--text-secondary)"
                      fontSize="8"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {child.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="w-full text-center text-xs text-muted mt-2">
            Nodes size and connection line thickness are relative to attention weights.
          </div>
        </div>
      </div>
    </div>
  );
}
