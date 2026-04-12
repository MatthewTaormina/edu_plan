import React, { useState, useEffect } from 'react';

interface MilestoneChecklistProps {
  /** Unique ID for localStorage — use the lesson slug */
  lessonId: string;
  items: string[];
}

export default function MilestoneChecklist({ lessonId, items }: MilestoneChecklistProps): JSX.Element {
  const key = `olg-milestone-${lessonId}`;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: boolean[] = JSON.parse(saved);
      // Handle case where items count changed
      setChecked(items.map((_, i) => parsed[i] ?? false));
    }
  }, [key]);

  function toggle(idx: number) {
    setChecked(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }

  const doneCount = checked.filter(Boolean).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;
  const allDone = doneCount === items.length;

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem', opacity: 0.75 }}>
        <span>{doneCount} / {items.length} complete</span>
        <span>{pct}%</span>
      </div>
      <div className="olg-progress-bar-outer">
        <div className="olg-progress-bar-inner" style={{ width: `${pct}%` }} />
      </div>

      {items.map((item, idx) => (
        <div key={idx} className={`olg-milestone-item${checked[idx] ? ' checked' : ''}`}
          onClick={() => toggle(idx)} role="checkbox" aria-checked={checked[idx]} tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggle(idx)}>
          <div className="olg-milestone-checkbox">
            {checked[idx] && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
          </div>
          <span>{item}</span>
        </div>
      ))}

      {allDone && (
        <div style={{
          marginTop: '1rem', padding: '1rem', borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(156,77,204,0.15), rgba(0,188,212,0.1))',
          border: '1px solid var(--olg-border-subtle)', textAlign: 'center',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <p style={{ margin: '0.25rem 0 0', fontWeight: 600 }}>Milestone Complete!</p>
        </div>
      )}
    </div>
  );
}
