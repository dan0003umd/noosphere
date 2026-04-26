import { useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { Send, TerminalSquare, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function WebApp() {
  const [mode, setMode] = useState<'BUILD' | 'SCAN'>('BUILD');
  
  const chatInput = useStore(state => state.chatInput);
  const setChatInput = useStore(state => state.setChatInput);
  const askSwarm = useStore(state => state.askSwarm);
  
  const nodes = useStore(state => state.nodes);
  const edges = useStore(state => state.edges);
  const agents = useStore(state => state.agents);

  const handleSend = () => {
    askSwarm(chatInput);
  };

  const agentList = [agents.alpha, agents.beta, agents.gamma, agents.delta];

  return (
    <div className="h-full w-full flex flex-col font-sans bg-[#0a0a0a] text-gray-200">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Agent Feed */}
        <div className="w-80 border-r border-zinc-800/50 bg-[#0d0d0d] flex flex-col">
          <div className="p-4 border-b border-zinc-800/50 font-semibold tracking-wide text-xs text-zinc-400 uppercase flex justify-between items-center">
            <span>Agent Swarm</span>
            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">Gemini 2.0</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {agentList.map((agent) => (
              <div key={agent.id} className="p-3 bg-[#141414] rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    {agent.status === 'Thinking' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      agent.status === 'Thinking' ? 'bg-blue-500' :
                      agent.status === 'Done' ? 'bg-green-500' : 'bg-zinc-600'
                    }`}></span>
                  </span>
                  <span className="font-medium text-sm text-gray-200">{agent.name}</span>
                  <span className="text-[10px] text-zinc-500 ml-auto uppercase tracking-wider">{agent.status}</span>
                </div>
                {agent.content && (
                  <div className="text-xs text-zinc-400 mt-1 whitespace-pre-wrap font-mono leading-relaxed bg-[#0a0a0a] p-2 rounded border border-zinc-800/50 max-h-48 overflow-y-auto overflow-x-hidden break-words">
                    {agent.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Visual Canvas */}
        <div className="flex-1 relative bg-[#050505]">
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            fitView
            colorMode="dark"
          >
            <Background color="#333" gap={16} />
            <Controls className="fill-white text-black" style={{ display: 'none' }} />
          </ReactFlow>
          <div className="absolute top-4 left-4 text-xs font-mono text-zinc-600 pointer-events-none">
            Noosphere Engine v0.1-alpha
          </div>
        </div>
      </div>

      {/* Bottom Panel - Chat Bar */}
      <div className="h-20 border-t border-zinc-800/50 bg-[#0d0d0d] flex items-center px-6 gap-4">
        <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-zinc-800">
          <button 
            onClick={() => setMode('BUILD')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${mode === 'BUILD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <TerminalSquare size={14} />
            BUILD
          </button>
          <button 
            onClick={() => setMode('SCAN')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${mode === 'SCAN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Eye size={14} />
            SCAN
          </button>
        </div>

        <div className="flex-1 relative">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe what you're building..." 
            className="w-full bg-[#141414] border border-zinc-800 focus:border-indigo-500/50 outline-none rounded-lg py-3 px-4 text-sm text-white placeholder-zinc-600 transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-indigo-400 transition-colors bg-[#1a1a1a] rounded-md border border-zinc-800 hover:border-indigo-500/50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
