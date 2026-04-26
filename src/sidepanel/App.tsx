import { useState } from 'react';
import { Github, Play, ArrowRight, Activity, Loader2, AlertCircle } from 'lucide-react';
import { useBlindspotStore } from '../store/useBlindspotStore';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const repoUrl = useBlindspotStore(state => state.repoUrl);
  const setRepoUrl = useBlindspotStore(state => state.setRepoUrl);
  const scanStatus = useBlindspotStore(state => state.scanStatus);
  const scanResults = useBlindspotStore(state => state.scanResults);
  const errorMessage = useBlindspotStore(state => state.errorMessage);
  const runScan = useBlindspotStore(state => state.runScan);

  const openBuilder = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/webapp/index.html') });
  };

  const getBorderColor = (severity: string) => {
    if (severity === 'high') return '#ef4444'; // red-500
    if (severity === 'medium') return '#f59e0b';
    return 'var(--secondary)';
  };

  const themeVars = isDarkMode ? {
    '--bg': '#0a0a0f',
    '--surface': '#12121a',
    '--surface2': '#1a1a28',
    '--border': '#2a2a40',
    '--text': '#e2e8f0',
    '--text-muted': '#64748b',
    '--primary': '#7c3aed',
    '--secondary': '#06b6d4'
  } : {
    '--bg': '#f5f4ff',
    '--surface': '#ffffff',
    '--surface2': '#ede9fe',
    '--border': '#c4b5fd',
    '--text': '#1e1b4b',
    '--text-muted': '#6b7280',
    '--primary': '#7c3aed',
    '--secondary': '#0891b2'
  };

  return (
    <div className="flex flex-col h-screen font-sans p-4 overflow-hidden aurora-bg" style={{ ...themeVars, background: 'var(--bg)', color: 'var(--text)' } as React.CSSProperties}>
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Top Action */}
      <button 
        onClick={openBuilder}
        className="w-full flex-shrink-0 flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-sm font-medium text-sm mb-6 border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--primary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--surface2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
      >
        <span>⚡ Open Noosphere Builder</span>
        <ArrowRight size={16} />
      </button>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-xl font-semibold flex items-center gap-2 mb-2" style={{ color: 'var(--text)' }}>
            <Activity size={20} style={{ color: 'var(--secondary)' }} />
            Blindspot Scan
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Analyze repository structure for missing paradigms and optimizations.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4 mb-6 flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Target Repository
              </label>
              <button 
                onClick={() => {
                  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const url = tabs[0]?.url || '';
                    const match = url.match(/https:\/\/github\.com\/([^\/]+\/[^\/\s?#]+)/);
                    if (match) {
                      setRepoUrl(`https://github.com/${match[1].replace(/\.git$/, '')}`);
                    } else {
                      alert('No GitHub repo detected on the current tab.');
                    }
                  });
                }}
                className="text-[10px] px-2 py-1 rounded transition-colors flex items-center gap-1 border"
                style={{ background: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border)' }}
              >
                📋 Use Current Tab
              </button>
            </div>
            <div className="relative group">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full outline-none rounded-lg py-2.5 pl-10 pr-4 text-sm transition-all border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <button 
            onClick={() => runScan(repoUrl)}
            disabled={scanStatus === 'loading' || !repoUrl}
            className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg transition-all font-medium text-sm shadow-md"
            style={{ background: 'linear-gradient(135deg, var(--primary), #6d28d9)' }}
          >
            {scanStatus === 'loading' ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            Run Analysis
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex flex-col min-h-0 border rounded-lg p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Scan Results</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {scanStatus === 'idle' && (
              <div className="h-full flex items-center justify-center border border-dashed rounded-md p-4" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                <p className="text-xs text-center max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                  Ready to scan. Enter a repository URL to begin blindspot analysis.
                </p>
              </div>
            )}

            {scanStatus === 'loading' && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse border rounded-lg p-4 h-24" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                    <div className="h-4 rounded w-1/4 mb-4" style={{ background: 'var(--border)' }}></div>
                    <div className="h-3 rounded w-3/4 mb-2" style={{ background: 'var(--border)' }}></div>
                    <div className="h-3 rounded w-1/2" style={{ background: 'var(--border)' }}></div>
                  </div>
                ))}
              </div>
            )}

            {scanStatus === 'error' && (
              <div className="border rounded-lg p-4 flex gap-3" style={{ background: '#ef44441a', borderColor: '#ef444433', color: '#ef4444' }}>
                <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {scanStatus === 'done' && scanResults.map(result => (
              <div 
                key={result.id} 
                className="border border-l-4 rounded-lg p-4 transition-colors"
                style={{ background: 'var(--surface2)', borderLeftColor: getBorderColor(result.severity), borderTopColor: 'var(--border)', borderRightColor: 'var(--border)', borderBottomColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{result.title}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border" style={{ color: getBorderColor(result.severity), borderColor: getBorderColor(result.severity) }}>
                    {result.category}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {result.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
