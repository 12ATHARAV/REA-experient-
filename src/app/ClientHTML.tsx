'use client';

import { useEffect, useRef } from 'react';

export default function ClientHTML({ html, styles = '', headScripts = [], title }: { html: string; styles?: string; headScripts?: string[]; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleMatch = title ? null : html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (title) {
      document.title = title;
    } else if (titleMatch) {
      document.title = titleMatch[1].trim();
    }

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
  }, [html]);

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