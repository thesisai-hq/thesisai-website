'use client';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    label: 'Getting Started',
    items: [{ href: '/docs', label: 'Introduction' }],
  },
  {
    label: 'System',
    items: [
      { href: '/docs/architecture', label: 'System Architecture' },
      { href: '/docs/kernel', label: 'AI Research Kernel' },
      { href: '/docs/agents', label: 'Agent Framework' },
      { href: '/docs/workflow', label: 'Research Workflow' },
    ],
  },
  {
    label: 'Data',
    items: [{ href: '/docs/data-sources', label: 'Data Sources' }],
  },
  {
    label: 'Product',
    items: [
      { href: '/docs/roadmap', label: 'Roadmap' },
      { href: '/console', label: 'Research Console ↗' },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      <nav>
        {navSections.map((section) => (
          <div key={section.label} className="docs-nav-section">
            <p className="docs-nav-label">{section.label}</p>
            <ul className="docs-nav-list">
              {section.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`docs-nav-link${pathname === item.href ? ' active' : ''}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
