import React, { useState, useEffect } from 'react';
import './App.css';

// Component Imports
import Home from './components/Home';
import DetectionDashboard from './components/DetectionDashboard';
import DetailedAnalysis from './components/DetailedAnalysis';
import PropagationGraph from './components/PropagationGraph';
import ConfidenceBreakdown from './components/ConfidenceBreakdown';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import AblationStudy from './components/AblationStudy';
import RobustnessTesting from './components/RobustnessTesting';
import InterpretabilityMap from './components/InterpretabilityMap';
import ExportReporting from './components/ExportReporting';
import { ToastContainer } from './components/Toast';

// Icons
import {
  HomeIcon,
  DashboardIcon,
  GraphIcon,
  InfoIcon,
  ComparisonIcon,
  RobustnessIcon,
  AblationIcon,
  HeatmapIcon,
  ExportIcon
} from './components/Icons';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'workspace'
  const [workspacePage, setWorkspacePage] = useState('detect'); // 'detect' | 'detailed' | 'graph' | 'confidence' | 'compare' | 'ablation' | 'robustness' | 'heatmap' | 'export'
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadDemoPayload, setLoadDemoPayload] = useState(false);
  const [toasts, setToasts] = useState([]);

  const triggerToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Callback to handle navigation from Home landing
  const handleHomeNavigate = (page, options = {}) => {
    if (page === 'dashboard') {
      setActiveTab('workspace');
      setWorkspacePage('detect');
      if (options.loadDemo) {
        setLoadDemoPayload(true);
      }
    }
  };

  // Reset demo loader once processed
  useEffect(() => {
    if (loadDemoPayload) {
      // Small timeout to let dashboard render first
      const t = setTimeout(() => {
        setLoadDemoPayload(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [loadDemoPayload]);

  const handleNavbarClick = (tab) => {
    if (tab === 'home') {
      setActiveTab('home');
    } else if (tab === 'detect') {
      setActiveTab('workspace');
      setWorkspacePage('detect');
    } else if (tab === 'demo') {
      setActiveTab('workspace');
      setWorkspacePage('detect');
      setLoadDemoPayload(true);
      triggerToast('info', 'Loading Syrian refugees fake news demo...');
    } else if (tab === 'info') {
      setActiveTab('workspace');
      setWorkspacePage('ablation');
    }
  };

  const renderWorkspacePage = () => {
    switch (workspacePage) {
      case 'detect':
        return (
          <DetectionDashboard 
            onNavigate={(page) => setWorkspacePage(page)}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            triggerToast={triggerToast}
            loadDemoPayload={loadDemoPayload}
          />
        );
      case 'detailed':
        return (
          <DetailedAnalysis 
            onNavigate={(page) => setWorkspacePage(page)}
            analysisResult={analysisResult}
          />
        );
      case 'graph':
        return (
          <PropagationGraph 
            onNavigate={(page) => setWorkspacePage(page)}
            analysisResult={analysisResult}
          />
        );
      case 'confidence':
        return (
          <ConfidenceBreakdown 
            onNavigate={(page) => setWorkspacePage(page)}
            analysisResult={analysisResult}
          />
        );
      case 'compare':
        return (
          <ComparativeAnalysis 
            onNavigate={(page) => setWorkspacePage(page)}
          />
        );
      case 'ablation':
        return (
          <AblationStudy 
            onNavigate={(page) => setWorkspacePage(page)}
          />
        );
      case 'robustness':
        return (
          <RobustnessTesting 
            onNavigate={(page) => setWorkspacePage(page)}
            triggerToast={triggerToast}
          />
        );
      case 'heatmap':
        return (
          <InterpretabilityMap 
            onNavigate={(page) => setWorkspacePage(page)}
          />
        );
      case 'export':
        return (
          <ExportReporting 
            onNavigate={(page) => setWorkspacePage(page)}
            triggerToast={triggerToast}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Main Top Navigation Bar */}
      <header className="app-navbar">
        <div className="navbar-logo-row cursor-pointer" onClick={() => handleNavbarClick('home')}>
          <div className="navbar-logo-icon"></div>
          <div>
            <h2>NEGT Analyzer</h2>
            <p>Fake News Denoising GNN</p>
          </div>
        </div>
        
        <nav className="navbar-nav-links">
          <button 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => handleNavbarClick('home')}
          >
            Home
          </button>
          <button 
            className={activeTab === 'workspace' && (workspacePage === 'detect') ? 'active' : ''} 
            onClick={() => handleNavbarClick('detect')}
          >
            Detect News
          </button>
          <button 
            onClick={() => handleNavbarClick('demo')}
          >
            View Demo
          </button>
          <button 
            className={activeTab === 'workspace' && workspacePage === 'ablation' ? 'active' : ''} 
            onClick={() => handleNavbarClick('info')}
          >
            How It Works
          </button>
        </nav>
      </header>

      {/* Main Work Area */}
      {activeTab === 'home' ? (
        <main className="app-main-workspace">
          <Home onNavigate={handleHomeNavigate} />
        </main>
      ) : (
        <div className="app-workspace-shell">
          {/* Left Navigation Sidebar */}
          <aside className="app-sidebar">
            <div className="sidebar-menu-stack">
              <button 
                className={`sidebar-menu-btn ${workspacePage === 'detect' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('detect')}
              >
                <DashboardIcon className="w-5 h-5" />
                <span>Detect News</span>
              </button>
              
              <button 
                className={`sidebar-menu-btn ${workspacePage === 'detailed' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('detailed')}
              >
                <InfoIcon className="w-5 h-5" />
                <span>Detailed Analysis</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'graph' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('graph')}
              >
                <GraphIcon className="w-5 h-5" />
                <span>Propagation Graph</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'confidence' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('confidence')}
              >
                <InfoIcon className="w-5 h-5" />
                <span>Confidence Breakdown</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'compare' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('compare')}
              >
                <ComparisonIcon className="w-5 h-5" />
                <span>Compare Articles</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'ablation' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('ablation')}
              >
                <AblationIcon className="w-5 h-5" />
                <span>Ablation Studies</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'robustness' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('robustness')}
              >
                <RobustnessIcon className="w-5 h-5" />
                <span>Robustness Tests</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'heatmap' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('heatmap')}
              >
                <HeatmapIcon className="w-5 h-5" />
                <span>Attention Heatmap</span>
              </button>

              <button 
                className={`sidebar-menu-btn ${workspacePage === 'export' ? 'active' : ''}`}
                onClick={() => setWorkspacePage('export')}
              >
                <ExportIcon className="w-5 h-5" />
                <span>Export Report</span>
              </button>
            </div>

            {/* Profile footer section */}
            <div className="sidebar-footer-profile">
              <div className="profile-avatar">NE</div>
              <div className="profile-info">
                <span className="name">Verification Node</span>
                <span className="role">Host Operator</span>
              </div>
            </div>
          </aside>

          {/* Active Workspace View Panel */}
          <main className="app-main-workspace">
            {renderWorkspacePage()}
          </main>
        </div>
      )}

      {/* Floating Alert Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
