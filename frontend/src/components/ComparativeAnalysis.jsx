import React, { useState } from 'react';

export default function ComparativeAnalysis({ onNavigate }) {
  const [similarity, setSimilarity] = useState(34);

  const articleA = {
    title: "Tech Boom 2026: Quantum Computing Inception",
    verdict: "REAL",
    confidence: 89,
    risk: "LOW RISK",
    riskClass: "low",
    nodes: 234,
    edges: 456,
    trend: "Steady Growth ↗",
    sourceTrust: 92,
    engagement: "Organic Peer-to-Peer",
    summary: "Scholarly reports indicate major silicon breakthroughs in commercial quantum qubits. Propagation tracks mostly research institutions and verified scientific journalists."
  };

  const articleB = {
    title: "Tech Crisis: Quantum Breakout Destroys All Encryption",
    verdict: "FAKE",
    confidence: 76,
    risk: "HIGH RISK",
    riskClass: "high",
    nodes: 1230,
    edges: 3240,
    trend: "Viral Spike ⬆",
    sourceTrust: 34,
    engagement: "Automated Bot Clusters",
    summary: "Sensationalized claims shared on social channels stating all global bank passwords were leaked. Propagation graph reveals massive bot rings and instant clickbait redirects."
  };

  return (
    <div className="comparative-analysis-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard')}>Detect News</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Comparative Analysis</span>
      </div>

      <div className="comparative-header-panel glass-panel text-center">
        <h3>⚖️ Side-by-Side News Comparison</h3>
        <p className="section-desc max-w-xl mx-auto mt-2">
          Compare the propagation profiles, structural virality, and source credibility factors of two separate articles side-by-side.
        </p>
        
        {/* Similarity Score Card */}
        <div className="similarity-indicator-box mt-4">
          <span className="lbl text-xs text-muted block mb-1">Topics Semantic Similarity</span>
          <span className="val text-2xl font-bold color-teal">{similarity}%</span>
          <span className="desc text-xs text-secondary block mt-1">(Classified as distinct thematic categories)</span>
        </div>
      </div>

      <div className="comparative-grid-columns mt-6">
        {/* Article A Panel */}
        <div className="compare-column glass-panel">
          <div className="column-header text-teal-border">
            <span className="article-tag">ARTICLE A</span>
            <h4>{articleA.title}</h4>
          </div>
          
          <div className="column-body">
            <div className="verdict-banner real">
              <span className="verdict-label">VERDICT</span>
              <span className="verdict-val">REAL {articleA.confidence}%</span>
              <span className="verdict-sub">🟢 Likely Real</span>
            </div>

            <div className="metrics-list-stack mt-4">
              <div className="metric-item-row">
                <span className="label">Evaluation Risk</span>
                <span className="val color-real">{articleA.risk}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Graph Nodes</span>
                <span className="val">{articleA.nodes}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Graph Edges</span>
                <span className="val">{articleA.edges}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Propagation Trend</span>
                <span className="val color-real">{articleA.trend}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Source Domain Trust</span>
                <span className="val">{articleA.sourceTrust}%</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Primary Engagement</span>
                <span className="val text-secondary">{articleA.engagement}</span>
              </div>
            </div>

            <div className="compare-summary-box mt-6">
              <h5>Topological Profile Summary:</h5>
              <p>{articleA.summary}</p>
            </div>
          </div>
        </div>

        {/* Article B Panel */}
        <div className="compare-column glass-panel">
          <div className="column-header text-coral-border">
            <span className="article-tag fake">ARTICLE B</span>
            <h4>{articleB.title}</h4>
          </div>
          
          <div className="column-body">
            <div className="verdict-banner fake">
              <span className="verdict-label">VERDICT</span>
              <span className="verdict-val">FAKE {articleB.confidence}%</span>
              <span className="verdict-sub">🔴 Likely Fake</span>
            </div>

            <div className="metrics-list-stack mt-4">
              <div className="metric-item-row">
                <span className="label">Evaluation Risk</span>
                <span className="val color-fake">{articleB.risk}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Graph Nodes</span>
                <span className="val">{articleB.nodes}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Graph Edges</span>
                <span className="val">{articleB.edges}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Propagation Trend</span>
                <span className="val color-fake">{articleB.trend}</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Source Domain Trust</span>
                <span className="val">{articleB.sourceTrust}%</span>
              </div>
              <div className="metric-item-row">
                <span className="label">Primary Engagement</span>
                <span className="val text-secondary">{articleB.engagement}</span>
              </div>
            </div>

            <div className="compare-summary-box mt-6">
              <h5>Topological Profile Summary:</h5>
              <p>{articleB.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
