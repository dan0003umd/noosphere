
import { Github, Play, ArrowRight, Activity, Loader2, AlertCircle } from 'lucide-react';
import { useBlindspotStore } from '../store/useBlindspotStore';

export default function App() {
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
    if (severity === 'high') return 'border-red-500';
    if (severity === 'medium') return 'border-yellow-500';
    return 'border-blue-500';
  };

  const getBadgeColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (severity === 'medium') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-gray-200 font-sans p-4 overflow-hidden">
      {/* Top Action */}
      <button 
        onClick={openBuilder}
        className="w-full flex-shrink-0 flex items-center justify-center gap-2 bg-[#141414] border border-zinc-800 hover:border-indigo-500/50 hover:bg-[#1a1a1a] text-indigo-400 py-3 rounded-xl transition-all shadow-sm font-medium text-sm mb-6"
      >
        <span>⚡ Open Noosphere Builder</span>
        <ArrowRight size={16} />
      </button>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
            <Activity className="text-indigo-500" size={20} />
            Blindspot Scan
          </h1>
          <p className="text-xs text-zinc-500">
            Analyze repository structure for missing paradigms and optimizations.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4 mb-6 flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
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
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                📋 Use Current Tab
              </button>
            </div>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full bg-[#141414] border border-zinc-800 focus:border-indigo-500/50 outline-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => runScan(repoUrl)}
            disabled={scanStatus === 'loading' || !repoUrl}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg transition-all font-medium text-sm shadow-md"
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
        <div className="flex-1 flex flex-col min-h-0 border border-zinc-800/50 rounded-lg bg-[#0d0d0d] p-4">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3 flex-shrink-0">Scan Results</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {scanStatus === 'idle' && (
              <div className="h-full flex items-center justify-center border border-dashed border-zinc-800 rounded-md bg-[#141414]/50 p-4">
                <p className="text-xs text-zinc-600 text-center max-w-[200px]">
                  Ready to scan. Enter a repository URL to begin blindspot analysis.
                </p>
              </div>
            )}

            {scanStatus === 'loading' && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-[#141414] border border-zinc-800/50 rounded-lg p-4 h-24">
                    <div className="h-4 bg-zinc-800 rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-zinc-800 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {scanStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3 text-red-400">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {scanStatus === 'done' && scanResults.map(result => (
              <div 
                key={result.id} 
                className={`bg-[#141414] border border-zinc-800/50 border-l-4 ${getBorderColor(result.severity)} rounded-lg p-4`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-200">{result.title}</h4>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getBadgeColor(result.severity)}`}>
                    {result.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
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
