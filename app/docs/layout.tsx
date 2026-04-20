import type { Metadata } from 'next';
import './docs.css';
import DocsSidebar from './components/DocsSidebar';

export const metadata: Metadata = {
  title: 'Docs | Thesis AI',
  description:
    'Technical documentation for the Thesis AI multi-agent investment research platform.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-root">
      <header className="docs-header">
        <a href="/" className="docs-brand">
          <img
            src="/branding/Light mode-Thesis AI Logo - transparent.png"
            alt="Thesis AI logo"
          />
          <span>Thesis AI</span>
          <span className="docs-brand-sep">/</span>
          <span className="docs-brand-sub">Docs</span>
        </a>
        <nav className="docs-header-nav">
          <a href="/">Home</a>
          <a href="/#waitlist" className="docs-header-cta">
            Request Access
          </a>
        </nav>
      </header>
      <div className="docs-body">
        <DocsSidebar />
        <main className="docs-content">
          <div className="docs-content-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
