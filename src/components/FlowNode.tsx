import { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export function FlowNode({ id, data }: { id: string; data: any }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const { setNodes, deleteElements } = useReactFlow();

  const saveLabel = () => {
    setEditing(false);
    setNodes(nodes => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  };

  return (
    <div className="flow-node group" style={{
      background: 'var(--surface2)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '12px 16px',
      minWidth: '140px',
      maxWidth: '200px',
      position: 'relative',
      boxShadow: '0 -2px 12px rgba(124,58,237,0.3), 0 4px 20px rgba(0,0,0,0.4)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: 'default'
    }}>
      <button onClick={() => deleteElements({ nodes: [{ id }] })}
        style={{ position:'absolute', top:'4px', left:'6px', background:'none', border:'none', color:'var(--text-muted)', fontSize:'11px', cursor:'pointer', opacity:0, transition:'opacity 0.2s' }}
        className="group-hover:opacity-100">✕</button>
      <button onClick={() => setEditing(true)}
        style={{ position:'absolute', top:'4px', right:'6px', background:'none', border:'none', color:'var(--text-muted)', fontSize:'11px', cursor:'pointer', opacity:0, transition:'opacity 0.2s' }}
        className="group-hover:opacity-100">✏️</button>
      {editing ? (
        <input autoFocus value={label}
          onChange={e => setLabel(e.target.value)}
          onBlur={saveLabel}
          onKeyDown={e => e.key === 'Enter' && saveLabel()}
          style={{ background:'transparent', border:'none', borderBottom:'1px solid var(--primary)', color:'var(--text)', fontSize:'13px', width:'100%', outline:'none', textAlign:'center' }} />
      ) : (
        <div style={{ color:'var(--text)', fontSize:'13px', fontWeight:500, textAlign:'center', lineHeight:1.4 }}>{label}</div>
      )}
      <Handle type="target" position={Position.Top} style={{ background:'var(--primary)', width:'8px', height:'8px', border:'2px solid var(--bg)' }} />
      <Handle type="source" position={Position.Bottom} style={{ background:'var(--primary)', width:'8px', height:'8px', border:'2px solid var(--bg)' }} />
      <Handle type="target" position={Position.Left} style={{ background:'var(--secondary)', width:'8px', height:'8px', border:'2px solid var(--bg)' }} />
      <Handle type="source" position={Position.Right} style={{ background:'var(--secondary)', width:'8px', height:'8px', border:'2px solid var(--bg)' }} />
    </div>
  );
}
