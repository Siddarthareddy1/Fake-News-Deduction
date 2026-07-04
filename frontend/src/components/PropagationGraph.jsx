import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, ZoomInIcon, ZoomOutIcon, ResetIcon } from './Icons';

export default function PropagationGraph({ onNavigate, analysisResult }) {
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [filter, setFilter] = useState('all'); // 'all' | 'real' | 'bots' | 'noise'
  const [hopLimit, setHopLimit] = useState(4); // 0, 1, 2, 3, 4 (4 is 3+)
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(4);
  const [selectedInspectorNode, setSelectedInspectorNode] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);

  const containerRef = useRef(null);

  // Default graph structure if no analysis exists
  const defaultNodes = [
    { id: 0, label: 'Source Post', type: 'source', x: 250, y: 60, depth: 0, time: 0, handle: '@original_post', reach: '24K', desc: 'Article alleging Syria border breach' },
    { id: 1, label: 'User @alpha', type: 'user', x: 120, y: 140, depth: 1, time: 2, handle: '@alpha_news', reach: '12K', desc: 'Retweet with text: Check this out.' },
    { id: 2, label: 'User @beta', type: 'user', x: 250, y: 140, depth: 1, time: 5, handle: '@beta_patriot', reach: '50K', desc: 'Verified profile retweeting link.' },
    { id: 3, label: 'User @gamma', type: 'user', x: 380, y: 140, depth: 1, time: 8, handle: '@gamma_feed', reach: '2K', desc: 'Standard retweet.' },
    { id: 4, label: 'Bot @spam_ring', type: 'bot', x: 50, y: 220, depth: 2, time: 10, handle: '@spam_bot_1', reach: '100', desc: 'Repeated links in under 1 second.' },
    { id: 5, label: 'User @delta', type: 'user', x: 150, y: 220, depth: 2, time: 14, handle: '@delta_observer', reach: '8.4K', desc: 'Expresses skepticism in comment.' },
    { id: 6, label: 'User @epsilon', type: 'user', x: 210, y: 220, depth: 2, time: 18, handle: '@ep_facts', reach: '150', desc: 'Retweet of beta.' },
    { id: 7, label: 'Bot @promo_ads', type: 'bot', x: 290, y: 220, depth: 2, time: 22, handle: '@promo_spammer', reach: '20', desc: 'Clickbait link redirecting to ad network.' },
    { id: 8, label: 'User @zeta', type: 'user', x: 350, y: 220, depth: 2, time: 26, handle: '@zeta_reports', reach: '4K', desc: 'Organic reader engagement.' },
    { id: 9, label: 'Bot @bot_acc', type: 'bot', x: 450, y: 220, depth: 2, time: 30, handle: '@autoshare_bot', reach: '10', desc: 'Automated sharing feed.' },
    { id: 10, label: 'User @theta', type: 'user', x: 120, y: 310, depth: 3, time: 35, handle: '@theta_verify', reach: '900', desc: 'Fact checker querying sources.' },
    { id: 11, label: 'User @iota', type: 'user', x: 180, y: 310, depth: 3, time: 42, handle: '@iota_stream', reach: '1.2K', desc: 'Sub-retweet.' },
    { id: 12, label: 'User @kappa', type: 'user', x: 350, y: 310, depth: 3, time: 48, handle: '@kappa_prime', reach: '6K', desc: 'Deep tier reader comment.' },
    { id: 13, label: 'User @lambda', type: 'user', x: 350, y: 380, depth: 4, time: 55, handle: '@lambda_final', reach: '300', desc: 'Cascade end node.' }
  ];

  const defaultEdges = [
    { from: 0, to: 1, isNoisy: false },
    { from: 0, to: 2, isNoisy: false },
    { from: 0, to: 3, isNoisy: false },
    { from: 1, to: 4, isNoisy: true },
    { from: 1, to: 5, isNoisy: false },
    { from: 2, to: 6, isNoisy: false },
    { from: 2, to: 7, isNoisy: true },
    { from: 3, to: 8, isNoisy: false },
    { from: 3, to: 9, isNoisy: true },
    { from: 5, to: 10, isNoisy: false },
    { from: 5, to: 11, isNoisy: false },
    { from: 8, to: 12, isNoisy: false },
    { from: 12, to: 13, isNoisy: false }
  ];

  const nodes = analysisResult ? analysisResult.nodes.map((n, i) => ({
    ...n,
    depth: i === 0 ? 0 : i < 4 ? 1 : i < 8 ? 2 : 3,
    time: i * 5,
    handle: `@node_${n.id}`,
    reach: i === 0 ? '100K' : `${Math.floor(Math.random() * 50) + 1}K`,
    desc: n.label || 'Sharing event'
  })) : defaultNodes;

  const edges = analysisResult ? analysisResult.edges : defaultEdges;

  // Playback timer loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((t) => {
          if (t >= 4) {
            return 0; // Loop back
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Synchronize playbackTime with hopLimit when playing
  useEffect(() => {
    if (isPlaying) {
      setHopLimit(playbackTime);
    }
  }, [playbackTime, isPlaying]);

  // Zoom & Pan Mouse Handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle' || e.target.tagName === 'text') return; // ignore nodes
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom Helpers
  const zoomIn = () => setZoom(z => Math.min(z * 1.2, 4.0));
  const zoomOut = () => setZoom(z => Math.max(z / 1.2, 0.5));
  const resetZoom = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Filter application
  const filteredNodes = nodes.filter(node => {
    // 1. Hop limit filter
    if (node.depth > hopLimit) return false;
    
    // 2. Type filter
    if (filter === 'all') return true;
    if (filter === 'real' && (node.type === 'user' || node.type === 'source')) return true;
    if (filter === 'bots' && node.type === 'bot') return true;
    if (filter === 'noise' && node.type === 'bot') return true; // bots are marked as noise
    
    return false;
  });

  const filteredEdges = edges.filter(edge => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return false;
    if (fromNode.depth > hopLimit || toNode.depth > hopLimit) return false;

    if (filter === 'all') return true;
    if (filter === 'real') {
      return (fromNode.type === 'user' || fromNode.type === 'source') && 
             (toNode.type === 'user' || toNode.type === 'source');
    }
    if (filter === 'bots') {
      return fromNode.type === 'bot' || toNode.type === 'bot';
    }
    if (filter === 'noise') {
      return edge.isNoisy;
    }
    return false;
  });

  return (
    <div className="graph-fullscreen-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard')}>Detect News</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Propagation Graph</span>
      </div>

      <div className="graph-workspace-grid">
        {/* Graph Display Area */}
        <div className="graph-display-panel glass-panel">
          <div className="graph-panel-header">
            <div>
              <h3>🌐 News Propagation Network</h3>
              <p className="text-xs text-secondary mt-1">
                Visualizing Twitter news spread cascade. Drag to pan, scroll or buttons to zoom.
              </p>
            </div>
            
            {/* Legend */}
            <div className="legend-strip">
              <span className="legend-item"><span className="dot source"></span> Source</span>
              <span className="legend-item"><span className="dot user"></span> Verified/Real</span>
              <span className="legend-item"><span className="dot bot"></span> Bot/Suspicious</span>
              <span className="legend-item"><span className="dot noise-edge"></span> Noise Link</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div 
            className="canvas-interactive-wrapper"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Canvas controls */}
            <div className="canvas-tools">
              <button onClick={zoomIn} title="Zoom In"><ZoomInIcon className="w-5 h-5" /></button>
              <button onClick={zoomOut} title="Zoom Out"><ZoomOutIcon className="w-5 h-5" /></button>
              <button onClick={resetZoom} title="Reset Center"><ResetIcon className="w-5 h-5" /></button>
            </div>

            <svg viewBox="0 0 500 420" width="100%" height="100%" className="graph-svg-canvas">
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                
                {/* Edges */}
                {filteredEdges.map((edge, idx) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      className={`graph-edge ${edge.isNoisy ? 'noisy' : ''}`}
                      strokeDasharray={edge.isNoisy ? "3,3" : "0"}
                      opacity={edge.isNoisy ? 0.3 : 0.8}
                    />
                  );
                })}

                {/* Nodes */}
                {filteredNodes.map((node) => {
                  const isSelected = selectedInspectorNode && selectedInspectorNode.id === node.id;
                  
                  return (
                    <g 
                      key={node.id} 
                      className={`node-g-group ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedInspectorNode(node)}
                      onMouseEnter={() => setHoverNode(node)}
                      onMouseLeave={() => setHoverNode(null)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.type === 'source' ? 14 : node.type === 'bot' ? 9 : 8}
                        className={`graph-node ${node.type}`}
                        stroke={isSelected ? '#ffffff' : 'var(--bg-primary)'}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      
                      {/* Short text overlay */}
                      <text 
                        x={node.x} 
                        y={node.y - 12} 
                        fontSize="8" 
                        fontWeight="600" 
                        fill="var(--text-secondary)" 
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {node.handle}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Hover tooltip card */}
            {hoverNode && (
              <div 
                className="hover-card glass-panel"
                style={{
                  position: 'absolute',
                  left: `${hoverNode.x * zoom + pan.x + 10}px`,
                  top: `${hoverNode.y * zoom + pan.y - 50}px`
                }}
              >
                <div className="hover-card-header">
                  <span className={`node-badge ${hoverNode.type}`}>{hoverNode.type.toUpperCase()}</span>
                  <h4>ID: {hoverNode.id}</h4>
                </div>
                <p className="node-label-text">{hoverNode.handle}</p>
                <p className="node-desc">Reach: {hoverNode.reach}</p>
                <p className="node-depth">Time: +{hoverNode.time}m | Depth: {hoverNode.depth} Hops</p>
              </div>
            )}
          </div>

          {/* Timeline / Playback Controls at Bottom */}
          <div className="graph-playback-row">
            <div className="playback-buttons">
              <button 
                className={`btn-play-pause ${isPlaying ? 'active' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Play Cascade'}</span>
              </button>
            </div>
            
            <div className="timeline-slider-wrapper">
              <div className="slider-labels">
                <span className={hopLimit === 0 ? 'active' : ''}>Hop 0</span>
                <span className={hopLimit === 1 ? 'active' : ''}>Hop 1</span>
                <span className={hopLimit === 2 ? 'active' : ''}>Hop 2</span>
                <span className={hopLimit >= 3 ? 'active' : ''}>Hop 3+</span>
              </div>
              <input 
                type="range"
                min="0"
                max="4"
                value={hopLimit}
                onChange={(e) => {
                  setHopLimit(parseInt(e.target.value));
                  setIsPlaying(false); // stop playing if moved manually
                }}
                className="timeline-range-slider"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Info Panel / Inspector */}
        <div className="graph-sidebar-inspector glass-panel">
          <div className="inspector-header">
            <h4>🌐 Filter &amp; Node Inspector</h4>
          </div>
          
          <div className="inspector-body">
            {/* Filters */}
            <div className="filter-group-widget">
              <span className="widget-label">Node Categories</span>
              <div className="filter-buttons-grid">
                <button className={`btn-filter-toggle ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Nodes</button>
                <button className={`btn-filter-toggle ${filter === 'real' ? 'active' : ''}`} onClick={() => setFilter('real')}>Credible</button>
                <button className={`btn-filter-toggle ${filter === 'bots' ? 'active' : ''}`} onClick={() => setFilter('bots')}>Bots</button>
                <button className={`btn-filter-toggle ${filter === 'noise' ? 'active' : ''}`} onClick={() => setFilter('noise')}>Noise Links</button>
              </div>
            </div>

            <div className="inspector-divider"></div>

            {/* Selected Node Details */}
            {selectedInspectorNode ? (
              <div className="node-inspect-details animate-fade-in">
                <div className="badge-row">
                  <span className={`node-badge ${selectedInspectorNode.type}`}>{selectedInspectorNode.type.toUpperCase()}</span>
                  <span className="node-id">Node Reference #{selectedInspectorNode.id}</span>
                </div>
                
                <h3 className="node-profile-handle">{selectedInspectorNode.handle}</h3>
                
                <div className="profile-stats-grid">
                  <div className="profile-stat-box">
                    <span className="lbl">Audience Reach</span>
                    <span className="val">{selectedInspectorNode.reach}</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="lbl">Hop Distance</span>
                    <span className="val">{selectedInspectorNode.depth} Hops</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="lbl">Sharing Offset</span>
                    <span className="val">+{selectedInspectorNode.time} minutes</span>
                  </div>
                </div>

                <div className="profile-activity-log">
                  <h5>Cascade Action Log</h5>
                  <p className="activity-desc">{selectedInspectorNode.desc}</p>
                </div>
                
                <button className="btn-secondary w-full text-xs py-2 mt-4" onClick={() => setSelectedInspectorNode(null)}>
                  Clear Inspector Selection
                </button>
              </div>
            ) : (
              <div className="inspector-empty-placeholder">
                <div className="empty-graphic">✦</div>
                <p>Click any node in the propagation network to inspect account reach, hop distance, activity log, and sentiment values.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
