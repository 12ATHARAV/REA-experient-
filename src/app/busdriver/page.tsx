import { readFileSync } from 'fs';
import { join } from 'path';
import ClientHTML from '../ClientHTML';

export default function Page() {
  const htmlPath = join(process.cwd(), 'public', 'index.html');
  const html = readFileSync(htmlPath, 'utf-8');
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;
  return <ClientHTML html={bodyContent} />;
}
