import type { ReactNode } from 'react';

// Argus page gets no footer, no extra chrome — just the page
// We override with a portal-style wrapper that hides the root layout footer/nav visually
// The real fix: this layout injects a style tag that hides footer + resets body bg
export default function ArgusLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide footer and reset body dot-grid on the Argus page */
        body.argus-route footer,
        body.argus-route > main ~ * {
          display: none !important;
        }
        body.argus-route {
          background-image: none !important;
          overflow: hidden !important;
        }
      `}</style>
      {children}
    </>
  );
}
