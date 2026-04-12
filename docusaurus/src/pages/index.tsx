import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const paths = [
  { emoji: '🐣', label: 'Beginner', desc: 'Start from zero', to: '/learn/paths/beginner' },
  { emoji: '🐍', label: 'Python Developer', desc: 'Scripts → web APIs', to: '/learn/paths/python_developer' },
  { emoji: '🖥️', label: 'Frontend', desc: 'HTML → React → Next.js', to: '/learn/paths/frontend_developer' },
  { emoji: '⚙️', label: 'Backend', desc: 'APIs, DBs, auth', to: '/learn/paths/backend_developer' },
  { emoji: '🌐', label: 'Full Stack', desc: 'End-to-end development', to: '/learn/paths/fullstack' },
  { emoji: '🔧', label: 'Systems', desc: 'C, Rust, assembly', to: '/learn/paths/systems' },
  { emoji: '🚀', label: 'DevOps', desc: 'Docker, K8s, CI/CD', to: '/learn/paths/devops' },
  { emoji: '🤖', label: 'AI Engineer', desc: 'ML, LLMs, agents', to: '/learn/paths/ai_engineer' },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Open Learner's Guide" description={siteConfig.tagline}>
      <main>
        {/* Hero */}
        <section style={{
          textAlign: 'center',
          padding: '5rem 2rem 3rem',
          background: 'linear-gradient(160deg, rgba(156,77,204,0.12) 0%, rgba(0,188,212,0.08) 100%)',
          borderBottom: '1px solid var(--olg-border-subtle)',
        }}>
          <Heading as="h1" style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            background: 'linear-gradient(90deg, var(--ifm-color-primary) 0%, var(--olg-accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}>
            Open Learner's Guide
          </Heading>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: 600, margin: '0 auto 2rem' }}>
            A neurodivergent-friendly, open-source guide to IT, Programming, and DevOps.
            <br />Pseudocode-first. Multi-language. Self-paced.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="button button--primary button--lg" to="/learn/courses">
              📚 Browse Courses
            </Link>
            <Link className="button button--secondary button--lg" to="/learn/paths/beginner">
              🗺️ Pick a Learning Path
            </Link>
          </div>
        </section>

        {/* Learning Paths Grid */}
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <Heading as="h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Choose Your Path
          </Heading>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {paths.map(p => (
              <Link key={p.label} to={p.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '1.5rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--olg-border-subtle)',
                  background: 'var(--olg-surface-subtle)',
                  textAlign: 'center',
                  transition: 'border-color 0.2s, transform 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--ifm-color-primary)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--olg-border-subtle)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{p.emoji}</div>
                  <div style={{ fontWeight: 600, color: 'var(--ifm-font-color-base)' }}>{p.label}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: '0.25rem' }}>{p.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Feature pills */}
        <section style={{
          background: 'var(--olg-surface-subtle)',
          borderTop: '1px solid var(--olg-border-subtle)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}>
          {['🎯 Pseudocode-first', '🗂️ Multi-language tabs', '✅ Progress tracking', '🧠 Built-in quizzes', '📊 Mermaid diagrams', '🌙 Dark mode'].map(f => (
            <span key={f} style={{
              display: 'inline-block', margin: '0.3rem',
              padding: '0.3rem 0.8rem', borderRadius: '20px',
              background: 'var(--olg-border-subtle)', fontSize: '0.9rem',
            }}>{f}</span>
          ))}
        </section>
      </main>
    </Layout>
  );
}
