'use client';

import { useEffect } from 'react';

/**
 * Mounts an IntersectionObserver that adds `.visible` to every `.reveal`
 * element as it scrolls into the viewport, triggering the CSS fade-up
 * animation defined in globals.css.
 *
 * Returns null — no rendered output.
 */
export default function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll<Element>('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
