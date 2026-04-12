import React, { useState, useEffect } from 'react';

interface Option {
  label: string;
  correct: boolean;
  explanation?: string;
}

interface QuizQuestionProps {
  question: string;
  options: Option[];
  /** Unique ID used for localStorage persistence — defaults to question text hash */
  id?: string;
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export default function QuizQuestion({ question, options, id }: QuizQuestionProps): JSX.Element {
  const key = `olg-quiz-${id ?? hashStr(question)}`;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      setSelected(parsed.selected);
      setRevealed(parsed.revealed);
    }
  }, [key]);

  function choose(idx: number) {
    if (revealed) return;
    const next = { selected: idx, revealed: true };
    setSelected(idx);
    setRevealed(true);
    localStorage.setItem(key, JSON.stringify(next));
  }

  function reset() {
    setSelected(null);
    setRevealed(false);
    localStorage.removeItem(key);
  }

  const correct = selected !== null && options[selected]?.correct;

  return (
    <div className="olg-quiz-card">
      <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{question}</p>

      {options.map((opt, idx) => {
        let cls = 'olg-quiz-option';
        if (revealed && idx === selected) cls += opt.correct ? ' correct' : ' incorrect';
        if (revealed && opt.correct && idx !== selected) cls += ' correct';

        return (
          <div key={idx} className={cls} onClick={() => choose(idx)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && choose(idx)}>
            <span style={{ fontWeight: 500 }}>{String.fromCharCode(65 + idx)}.</span>
            <span>{opt.label}</span>
          </div>
        );
      })}

      {revealed && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: correct ? '#00c853' : '#f44336', fontWeight: 600 }}>
            {correct ? '✅ Correct!' : '❌ Not quite.'}
          </p>
          {selected !== null && options[selected]?.explanation && (
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>{options[selected].explanation}</p>
          )}
          {!correct && (
            <p style={{ opacity: 0.75, fontSize: '0.9rem' }}>
              The correct answer is: <strong>{options.find(o => o.correct)?.label}</strong>
            </p>
          )}
          <button onClick={reset} style={{
            marginTop: '0.5rem', cursor: 'pointer', padding: '0.3rem 0.8rem',
            borderRadius: '6px', background: 'transparent',
            border: '1px solid var(--ifm-color-primary)', color: 'var(--ifm-color-primary)',
            fontSize: '0.85rem',
          }}>Try again</button>
        </div>
      )}
    </div>
  );
}
