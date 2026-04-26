
⚡ Noosphere

Map your ideas. Scan your blindspots. Ship better.

A Chrome extension that transforms raw ideas into living visual knowledge graphs using a 4-agent AI swarm, and scans any GitHub repository for architectural blindspots — all running client-side with no backend.

🧠 Features
Agent Swarm Builder

Describe any app idea and 4 specialized AI agents fire simultaneously:

Agent	Role
α Alpha	Synthesizes the mental model into 5 core components
β Beta	Identifies thought fractures and missing assumptions
γ Gamma	Maps logical relationships and dependencies
δ Delta	Detects drift risks — where the idea could go wrong


Results render as an interactive, editable React Flow knowledge graph with:

✏️ Inline node editing

➕ Add / delete nodes

🔗 Auto-generated flowchart edges with arrows

🗺️ Minimap + Auto Layout + Clear controls

🔍 Blindspot Scan

Paste any public GitHub repo URL → Noosphere:

Fetches the full file tree via GitHub API

Sends it to AI for deep architectural analysis

Returns categorized findings with severity levels:

🔴 Security — auth gaps, exposed secrets, injection risks

🏗️ Architecture — missing patterns, tight coupling, scalability issues

⚡ Performance — bottlenecks, unoptimized queries, bundle bloat

🔧 Maintainability — tech debt, missing docs, testing gaps

📧 Email the full report with one click — no backend needed

🎨 UI

Dark / Light mode toggle

Resizable agent swarm panel (drag handle)

Aurora animated background

Per-agent color theming (violet / cyan / emerald / amber)

🛠️ Tech Stack
Layer	Technology

|-------|-----------|

| Framework | React 18 + TypeScript |

| State | Zustand |

| Canvas | React Flow (@xyflow/react) |

| AI | Groq API — Llama 3.1 8B Instant |

| Email | EmailJS |

| Build | Vite |

| Extension | Chrome Manifest V3 |

🚀 Getting Started
1. Clone & Install
bash
git clone https://github.com/dan0003umd/noosphere.git
cd noosphere
npm install
2. Set up environment

Create a .env file in the root:

text
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

Get your free Groq key at console.groq.com — 14,400 requests/day free.

3. Build
bash
npm run build
4. Load in Chrome

Go to chrome://extensions

Enable Developer Mode

Click Load unpacked

Select the dist/ folder

📁 Project Structure
text
src/
├── config/
│   └── apiConfig.ts        # API config (reads from .env)
├── utils/
│   └── geminiCall.ts       # Shared AI call utility
├── store/
│   ├── useStore.ts         # Agent swarm state + logic
│   └── useBlindspotStore.ts# Blindspot scan state + logic
├── components/
│   ├── FlowNode.tsx        # Custom editable React Flow node
│   └── ...                 # UI components
└── webapp/
    └── index.html          # Extension entry point
🔑 Environment Variables

| Styling | Tailwind CSS |

Variable	Where to get it
Variable	Where to get it
VITE_GROQ_API_KEY	console.groq.com
VITE_EMAILJS_SERVICE_ID	emailjs.com → Email Services
VITE_EMAILJS_TEMPLATE_ID	emailjs.com → Email Templates
VITE_EMAILJS_PUBLIC_KEY	emailjs.com → Account

🏆 Built At

GDSC HackDay — Build With AI Hackathon 2026
Built by @dan0003umd

📄 License

MIT — use it, fork it, build on it.
