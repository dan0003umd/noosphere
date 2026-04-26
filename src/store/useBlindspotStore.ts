import { create } from 'zustand';
import { callAI } from '../utils/geminiCall';

export type Severity = 'high' | 'medium' | 'low';
export type Category = 'Security' | 'Architecture' | 'Performance' | 'Maintainability';

export interface BlindspotResult {
  id: string;
  category: Category;
  title: string;
  description: string;
  severity: Severity;
}

interface BlindspotStore {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  scanStatus: 'idle' | 'loading' | 'done' | 'error';
  scanResults: BlindspotResult[];
  errorMessage: string;
  runScan: (repoUrl: string) => Promise<void>;
}

export const useBlindspotStore = create<BlindspotStore>((set) => ({
  repoUrl: '',
  setRepoUrl: (url) => set({ repoUrl: url }),
  scanStatus: 'idle',
  scanResults: [],
  errorMessage: '',
  runScan: async (repoUrl: string) => {
    set({ scanStatus: 'loading', scanResults: [], errorMessage: '' });
    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\s?#\.]+)/);
      if (!match) throw new Error('Invalid GitHub URL. Use: https://github.com/owner/repo');
      const [, owner, repo] = match;
      let tree: string[] = [];
      for (const branch of ['main', 'master', 'HEAD']) {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
        if (res.ok) {
          const data = await res.json();
          tree = (data.tree || []).map((f: any) => f.path);
          break;
        }
      }
      if (tree.length === 0) throw new Error('Could not fetch repo. Make sure the repo is public.');
      const filePaths = tree.slice(0, 200).join('\n');
      const prompt = `You are a senior software architect. Analyze this repository file tree and identify blindspots — missing paradigms, architectural gaps, security concerns, performance issues, and maintainability problems.\n\nFile tree:\n${filePaths}\n\nRespond ONLY with a valid JSON array. No markdown fences, no explanation, just the raw JSON array. Each object must have exactly these fields: category (one of: Security, Architecture, Performance, Maintainability), title (short string under 60 chars), description (1-2 sentences), severity (one of: high, medium, low). Return at least 6 items.`;
      const raw = await callAI(prompt);
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const results = parsed.map((item: any, i: number) => ({ id: `bs-${i}`, ...item }));
      set({ scanStatus: 'done', scanResults: results });
    } catch (e: any) {
      set({ scanStatus: 'error', errorMessage: e.message || 'Unknown error occurred.' });
    }
  }
}));
