import { readFileSync } from 'fs';
import { join } from 'path';
import ClientHTML from '../ClientHTML';

export default function Page() {
  const htmlPath = join(process.cwd(), 'public', 'bhojpuri.html');
  const html = readFileSync(htmlPath, 'utf-8');

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : '';
  const styles = [...headContent.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi)]
    .map((match) => match[0])
    .join('\n');
  const headScripts = [...headContent.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)]
    .map((match) => match[0]);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : undefined;

  return <ClientHTML html={bodyContent} styles={styles} headScripts={headScripts} title={title} />;
}
