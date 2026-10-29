import { readFileSync } from 'fs';
import { join } from 'path';
import ClientHTML from '../ClientHTML';

export default function Page() {
  const htmlPath = join(process.cwd(), 'public', 'index.html');
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

  return <ClientHTML html={bodyContent} styles={styles} headScripts={headScripts} />;
}
