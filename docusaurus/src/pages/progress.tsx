import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

interface LessonProgress {
  key: string;
  label: string;
  done: number;
  total: number;
}

function getAllProgress(): LessonProgress[] {
  const results: LessonProgress[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith('olg-milestone-')) continue;
    const lessonId = k.replace('olg-milestone-', '');
    try {
      const arr: boolean[] = JSON.parse(localStorage.getItem(k) ?? '[]');
      results.push({
        key: k,
        label: lessonId.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        done: arr.filter(Boolean).length,
        total: arr.length,
      });
    } catch {
      /* skip corrupt entries */
    }
  }
  return results.sort((a, b) => b.done / (b.total || 1) - a.done / (a.total || 1));
}

export default function ProgressPage(): JSX.Element {
  const [data, setData] = useState<LessonProgress[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(getAllProgress());
  }, []);

  const totalItems = data.reduce((s, d) => s + d.total, 0);
  const doneItems = data.reduce((s, d) => s + d.done, 0);
  const overallPct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <Layout title="My Progress" description="Track your learning progress across the Open Learner's Guide">
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>✅ My Progress</h1>
        <p style={{ opacity: 0.75 }}>Your progress is saved locally in this browser. It's never sent anywhere.</p>

        {!mounted ? (
          <p>Loading…</p>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
            <p style={{ fontSize: '2rem' }}>📚</p>
            <p>No progress tracked yet. Start any lesson and check off your milestones!</p>
            <Link to="/learn" className="button button--primary" style={{ marginTop: '1rem' }}>Browse Courses</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px',
              background: 'var(--olg-surface-subtle)', border: '1px solid var(--olg-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Overall Progress</strong>
                <span>{doneItems} / {totalItems} items · {overallPct}%</span>
              </div>
              <div className="olg-progress-bar-outer">
                <div className="olg-progress-bar-inner" style={{ width: `${overallPct}%` }} />
              </div>
            </div>

            {data.map((d) => {
              const pct = d.total ? Math.round((d.done / d.total) * 100) : 0;
              return (
                <div key={d.key} style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px',
                  border: '1px solid var(--olg-border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 500 }}>{d.label}</span>
                    <span style={{ opacity: 0.7 }}>{d.done}/{d.total} · {pct}%</span>
                  </div>
                  <div className="olg-progress-bar-outer" style={{ marginBottom: 0 }}>
                    <div className="olg-progress-bar-inner" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            <button onClick={() => {
              data.forEach(d => localStorage.removeItem(d.key));
              setData([]);
            }} style={{ marginTop: '2rem', cursor: 'pointer', padding: '0.5rem 1rem',
              borderRadius: '6px', background: 'transparent', border: '1px solid #f44336',
              color: '#f44336', fontSize: '0.85rem' }}>
              Reset all progress
            </button>
          </>
        )}
      </main>
    </Layout>
  );
}
