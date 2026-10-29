import { readFileSync } from 'fs';
import { join } from 'path';

export default function Bhojpuri() {
  const htmlPath = join(process.cwd(), 'public', 'index.html');
  const html = readFileSync(htmlPath, 'utf-8');
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : '';

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: headContent }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </>
  );
}
