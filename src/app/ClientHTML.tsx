'use client';

import { useEffect, useRef } from 'react';

export default function ClientHTML({ html, styles = '', headScripts = [] }: { html: string; styles?: string; headScripts?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = false;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: styles }} />
      {headScripts.map((script, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: script }} />
      ))}
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}