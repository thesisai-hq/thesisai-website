import type { Metadata } from 'next';
import './console.css';

export const metadata: Metadata = {
  title: 'Research Console | Thesis AI',
  description: 'Internal agent pipeline inspection tool.',
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
