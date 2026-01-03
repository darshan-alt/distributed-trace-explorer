import Link from 'next/link';
import { ArrowRight, Activity, Zap, Shield, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content">
          <h1>Distributed Trace Explorer</h1>
          <p className="subtitle">
            Visualize how a request flows through services, where time is spent, and where failures occur.
          </p>
          <div className="hero-actions">
            <Link href="/traces" className="btn btn-primary">
              View Sample Traces <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="trace-preview card">
            <div className="preview-header">
              <div className="preview-dot" style={{ background: 'var(--success)' }}></div>
              <div className="preview-line"></div>
            </div>
            <div className="preview-body">
              <div className="mock-span" style={{ width: '90%', marginLeft: '0%' }}></div>
              <div className="mock-span" style={{ width: '30%', marginLeft: '10%' }}></div>
              <div className="mock-span" style={{ width: '20%', marginLeft: '45%' }}></div>
              <div className="mock-span error" style={{ width: '15%', marginLeft: '70%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="features container">
        <div className="section-header">
          <h2>Why Trace Explorer?</h2>
          <p>Modern observability built for clarity and speed.</p>
        </div>
        <div className="grid">
          <div className="feat-card">
            <div className="feat-icon"><Activity size={24} /></div>
            <h3>Request Context</h3>
            <p>Understand the full journey of a request across your entire architecture.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon"><Zap size={24} /></div>
            <h3>Latency Insights</h3>
            <p>Pinpoint bottlenecks with millisecond precision in a visual timeline.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon"><Shield size={24} /></div>
            <h3>Instant Error Mapping</h3>
            <p>Surface failed spans and exceptions immediately within the trace path.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon"><Search size={24} /></div>
            <h3>Root Cause Analysis</h3>
            <p>Inspect metadata and attributes for every span to find the source of truth.</p>
          </div>
        </div>
      </section>

      {/* Internal Task List / Roadmap */}
      <section className="roadmap container">
        <div className="card roadmap-card">
          <div className="roadmap-header">
            <h2>Project Status & Roadmap</h2>
          </div>
          <ul className="task-list">
            <li className="task-item done">
              <div className="task-status"></div>
              <span>Trace list view with status filtering</span>
            </li>
            <li className="task-item done">
              <div className="task-status"></div>
              <span>Waterfall visualization for trace details</span>
            </li>
            <li className="task-item done">
              <div className="task-status"></div>
              <span>Span attribute inspection panel</span>
            </li>
            <li className="task-item">
              <div className="task-status"></div>
              <span>Critical path highlighting (Coming soon)</span>
            </li>
            <li className="task-item">
              <div className="task-status"></div>
              <span>Flamegraph toggle (Planned)</span>
            </li>
            <li className="task-item">
              <div className="task-status"></div>
              <span>Log correlation (Planned)</span>
            </li>
          </ul>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .landing {
          padding-top: 4rem;
          padding-bottom: 8rem;
        }
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 8rem;
        }
        .hero-content h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(180deg, var(--foreground) 0%, #444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          font-size: 1.5rem;
          color: var(--secondary);
          line-height: 1.4;
          margin-bottom: 2.5rem;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 100px;
          font-weight: 600;
          font-size: 1rem;
          transition: var(--transition);
        }
        .btn-primary {
          background: var(--foreground);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        .hero-visual {
          position: relative;
        }
        .trace-preview {
          height: 300px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          box-shadow: var(--shadow-lg);
        }
        .preview-header {
           display: flex;
           align-items: center;
           gap: 1rem;
        }
        .preview-dot {
           width: 12px;
           height: 12px;
           border-radius: 50%;
        }
        .preview-line {
           flex: 1;
           height: 1px;
           background: var(--border);
        }
        .preview-body {
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }
        .mock-span {
          height: 8px;
          background: var(--accent);
          border-radius: 4px;
          opacity: 0.2;
        }
        .mock-span.error {
          background: var(--error);
          opacity: 0.8;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .section-header p {
          color: var(--secondary);
          font-size: 1.25rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-bottom: 8rem;
        }
        .feat-card {
           padding: 2.5rem;
           border-radius: var(--radius-xl);
           background: var(--tertiary);
           transition: var(--transition);
        }
        .feat-card:hover {
           background: #eee;
        }
        .feat-icon {
           margin-bottom: 1.5rem;
           color: var(--accent);
        }
        .feat-card h3 {
           margin-bottom: 0.75rem;
        }
        .feat-card p {
           color: var(--secondary);
           line-height: 1.5;
        }

        .roadmap {
           max-width: 800px;
        }
        .roadmap-card {
           padding: 3rem;
        }
        .roadmap-header {
           margin-bottom: 2rem;
           border-bottom: 1px solid var(--border);
           padding-bottom: 1.5rem;
        }
        .task-list {
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }
        .task-item {
           display: flex;
           align-items: center;
           gap: 1rem;
           color: var(--secondary);
        }
        .task-status {
           width: 20px;
           height: 20px;
           border-radius: 50%;
           border: 2px solid var(--border);
           flex-shrink: 0;
        }
        .task-item.done {
           color: var(--foreground);
        }
        .task-item.done .task-status {
           background: var(--success);
           border-color: var(--success);
           position: relative;
        }
        .task-item.done .task-status::after {
           content: '✓';
           position: absolute;
           color: white;
           font-size: 12px;
           top: 50%;
           left: 50%;
           transform: translate(-50%, -50%);
        }

        @media (max-width: 968px) {
          .hero { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .hero-content h1 { font-size: 3rem; }
          .hero-actions { justify-content: center; }
          .grid { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
        }
      `}} />
    </div>
  );
}
