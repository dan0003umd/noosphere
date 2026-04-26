import { useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react';
import { Send, TerminalSquare, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FlowNode } from '../components/FlowNode';

const nodeTypes = { custom: FlowNode };

const agentColors: Record<string, string> = {
  alpha: 'var(--primary)',
  beta: 'var(--secondary)',
  gamma: '#10b981',
  delta: '#f59e0b'
};

export default function WebApp() {
  const [mode, setMode] = useState<'BUILD' | 'SCAN'>('BUILD');
  const [panelWidth, setPanelWidth] = useState(300);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const chatInput = useStore(state => state.chatInput);
  const setChatInput = useStore(state => state.setChatInput);
  const askSwarm = useStore(state => state.askSwarm);
  
  const nodes = useStore(state => state.nodes);
  const edges = useStore(state => state.edges);
  const agents = useStore(state => state.agents);

  const handleSend = () => {
    if (chatInput.trim()) askSwarm(chatInput);
  };

  const agentList = [agents.alpha, agents.beta, agents.gamma, agents.delta];

  const handleMouseDown = () => {
    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = e.clientX;
      if (newWidth < 220) newWidth = 220;
      if (newWidth > 480) newWidth = 480;
      setPanelWidth(newWidth);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toolbarBtn = {
    background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
    borderRadius: '20px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer',
    transition: 'border-color 0.2s'
  };

  const addNode = () => {
    useStore.setState({
      nodes: [...nodes, { id: `node-${Date.now()}`, type: 'custom', data: { label: 'New Node' }, position: { x: 200, y: 200 } }]
    });
  };

  const autoLayout = () => {
    useStore.setState({
      nodes: nodes.map((n, i) => ({
        ...n,
        position: { x: (i % 3) * 280 + 150, y: Math.floor(i / 3) * 160 + 150 }
      }))
    });
  };

  const clearCanvas = () => {
    useStore.setState({ nodes: [], edges: [] });
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
    <div className="h-full w-full flex flex-col font-sans aurora-bg" style={{ ...themeVars, color: 'var(--text)' } as React.CSSProperties}>
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Agent Feed */}
        <div style={{ width: panelWidth, minWidth: panelWidth, background: 'var(--surface)', borderColor: 'var(--border)' }} className="border-r flex flex-col">
          <div className="p-4 border-b font-semibold tracking-wide text-xs uppercase flex justify-between items-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <span>Agent Swarm</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}>
              <span style={{ color: '#f59e0b' }}>⚡</span> Llama 3.1
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {agentList.map((agent) => {
              const color = agentColors[agent.id] || 'var(--primary)';
              const isThinking = agent.status === 'Thinking';
              const isDone = agent.status === 'Done';
              return (
                <div key={agent.id} 
                  className="p-3 rounded-lg border transition-colors flex flex-col gap-2"
                  style={{
                    backgroundColor: isThinking ? `var(--surface2)` : 'var(--surface2)',
                    borderColor: 'var(--border)',
                    boxShadow: `inset 3px 0 0 ${color}`
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {isThinking && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }}></span>
                      )}
                      <span className="relative inline-flex rounded-full h-2 w-2" 
                        style={{ backgroundColor: color }}></span>
                    </span>
                    <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{agent.name}</span>
                    <span className="text-[10px] ml-auto uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
                      backgroundColor: isThinking ? 'var(--surface)' : isDone ? '#10b98133' : 'var(--surface)',
                      color: isThinking ? 'var(--secondary)' : isDone ? '#10b981' : 'var(--text-muted)'
                    }}>
                      {agent.status}
                      {isThinking && <span className="animate-pulse">...</span>}
                    </span>
                  </div>
                  {agent.content && (
                    <div className="text-xs mt-1 whitespace-pre-wrap font-mono leading-relaxed p-2 rounded border max-h-48 overflow-y-auto overflow-x-hidden break-words"
                      style={{ color: 'var(--text-muted)', background: 'var(--bg)', borderColor: 'var(--border)' }}>
                      {agent.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className="w-[6px] cursor-col-resize transition-colors z-10"
          style={{ background: 'var(--border)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--border)')}
        />

        {/* Right Panel - Visual Canvas */}
        <div className="flex-1 relative bg-transparent flex flex-col">
          {/* Header Toggle */}
          <div className="absolute top-4 right-4 z-10">
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

          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            colorMode={isDarkMode ? 'dark' : 'light'}
          >
            <Background variant={BackgroundVariant.Dots} color="var(--border)" gap={24} size={1} />
            <MiniMap nodeColor="var(--primary)" maskColor={isDarkMode ? 'rgba(10,10,15,0.8)' : 'rgba(255,255,255,0.8)'} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px' }} />
            <Controls style={{ background:'var(--surface)', border:'1px solid var(--border)' }} className={isDarkMode ? 'fill-white text-black' : 'fill-black text-white'} />
          </ReactFlow>
          
          {/* Canvas Toolbar */}
          <div style={{ position:'absolute', top:'12px', left:'12px', zIndex:10, display:'flex', gap:'8px' }}>
            <button onClick={addNode} style={toolbarBtn} onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>+ Node</button>
            <button onClick={autoLayout} style={toolbarBtn} onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>Auto Layout</button>
            <button onClick={clearCanvas} style={toolbarBtn} onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>Clear</button>
          </div>

          <div className="absolute bottom-4 right-4 text-xs font-mono pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            Noosphere Engine v1.0
          </div>
        </div>
      </div>

      {/* Bottom Panel - Chat Bar */}
      <div className="h-20 border-t flex items-center px-6 gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex rounded-lg p-1 border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
          <button 
            onClick={() => setMode('BUILD')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all shadow-sm`}
            style={mode === 'BUILD' ? { background: 'linear-gradient(135deg, var(--primary), #6d28d9)', color: '#fff', filter: 'brightness(1.15)' } : { color: 'var(--text-muted)', background: 'transparent' }}
          >
            <TerminalSquare size={14} />
            BUILD
          </button>
          <button 
            onClick={() => setMode('SCAN')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all shadow-sm`}
            style={mode === 'SCAN' ? { border: '1px solid var(--secondary)', color: 'var(--secondary)', background: 'transparent' } : { border: '1px solid transparent', color: 'var(--text-muted)' }}
          >
            <Eye size={14} />
            SCAN
          </button>
        </div>

        <div className="flex-1 relative group">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe what you're building..." 
            className="w-full border outline-none rounded-lg py-3 px-4 text-sm transition-all"
            style={{ 
              background: 'var(--bg)', 
              borderColor: 'var(--border)', 
              color: 'var(--text)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-colors rounded-md border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
