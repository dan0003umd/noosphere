import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { callAI } from '../utils/geminiCall';

export type AgentId = 'alpha' | 'beta' | 'gamma' | 'delta';
export type AgentStatus = 'Idle' | 'Thinking' | 'Done';

export interface Agent {
  id: AgentId;
  name: string;
  status: AgentStatus;
  content: string;
}

interface StoreState {
  chatInput: string;
  setChatInput: (val: string) => void;
  agents: Record<AgentId, Agent>;
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  askSwarm: (idea: string) => void;
}

const initialAgents: Record<AgentId, Agent> = {
  alpha: { id: 'alpha', name: 'Agent α', status: 'Idle', content: '' },
  beta: { id: 'beta', name: 'Agent β', status: 'Idle', content: '' },
  gamma: { id: 'gamma', name: 'Agent γ', status: 'Idle', content: '' },
  delta: { id: 'delta', name: 'Agent δ', status: 'Idle', content: '' },
};

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Input System' }, className: 'bg-[#1a1a1a] text-white border-zinc-800 rounded-md p-3 shadow-lg' },
  { id: '2', position: { x: 350, y: 150 }, data: { label: 'Analysis Engine' }, className: 'bg-[#1a1a1a] text-white border-zinc-800 rounded-md p-3 shadow-lg' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4f46e5' } },
];

const prompts: Record<AgentId, string> = {
  alpha: "Synthesize the mental model of this idea into 5 key components. At the very end of your response, you MUST output a strict JSON array of 5 strings containing the component names, wrapped in a markdown code block like ```json\n[\"comp1\", \"comp2\", \"comp3\", \"comp4\", \"comp5\"]\n```.",
  beta: "Identify potential thought fractures and missing assumptions in this idea.",
  gamma: "Map the logical relationships and dependencies between components of this idea.",
  delta: "Detect drift risks — where this idea could deviate from its original intent over time."
};


export const useStore = create<StoreState>((set) => ({
  chatInput: '',
  setChatInput: (val) => set({ chatInput: val }),
  agents: initialAgents,
  nodes: initialNodes,
  edges: initialEdges,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  askSwarm: async (idea: string) => {
    if (!idea.trim()) return;
    set((state) => ({
      chatInput: '',
      agents: {
        alpha: { ...state.agents.alpha, status: 'Thinking', content: '' },
        beta:  { ...state.agents.beta,  status: 'Thinking', content: '' },
        gamma: { ...state.agents.gamma, status: 'Thinking', content: '' },
        delta: { ...state.agents.delta, status: 'Thinking', content: '' },
      }
    }));
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    const runAgent = async (agentId: AgentId, prompt: string, staggerMs: number) => {
      await delay(staggerMs);
      try {
        const text = await callAI(`${prompt}: ${idea}`);
        set((state) => ({
          agents: { ...state.agents, [agentId]: { ...state.agents[agentId], status: 'Done', content: text } }
        }));
        return text;
      } catch (e) {
        set((state) => ({
          agents: { ...state.agents, [agentId]: { ...state.agents[agentId], status: 'Done', content: 'Error: Could not connect to Gemini.' } }
        }));
        return '';
      }
    };
    const [alphaText] = await Promise.all([
      runAgent('alpha', prompts.alpha, 0),
      runAgent('beta',  prompts.beta,  900),
      runAgent('gamma', prompts.gamma, 1800),
      runAgent('delta', prompts.delta, 2700),
    ]);
    const concepts = alphaText
      .split('\n')
      .map((line: string) => line.replace(/^[-*0-9.`\[\]"]+\s*/g, '').trim())
      .filter((line: string) => line.length > 3 && !line.startsWith('```'))
      .slice(0, 6);
    if (concepts.length > 0) {
      const newNodes = concepts.map((concept: string, i: number) => ({
        id: `node-${Date.now()}-${i}`,
        data: { label: concept.slice(0, 45) },
        position: { x: 150 + (i % 3) * 280, y: 150 + Math.floor(i / 3) * 160 },
        className: 'bg-[#1a1a1a] text-white border-zinc-800 rounded-md p-3 shadow-lg'
      }));
      set({ nodes: newNodes, edges: [] });
    }
  }
}));