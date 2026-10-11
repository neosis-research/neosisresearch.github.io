import type { APIRoute } from 'astro';
import { publishedInsights } from '../lib/insights';
import { url } from '../lib/urls';
export const GET: APIRoute = async ({ site }) => {
  const paths = [
    '',
    'computational-research/',
    'research-evaluation/',
    'sponsored-research/',
    'capabilities/',
    'about/',
    'insights/',
    'contact/',
    ...(await publishedInsights()).map((a) => `insights/${a.id}/`),
  ];
  const escape = (s: string) =>
    s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${escape(new URL(url(p), site).href)}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
