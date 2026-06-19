import { PROJECTS } from '../src/components/Projectsindex.js'; // adjust path if needed
import fs from 'fs';

const SITE_URL = 'https://yourdomain.com';

const urls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/projects', changefreq: 'weekly', priority: '0.9' },
  ...PROJECTS.map(p => ({
    loc: `/projects/${p.id}`,
    changefreq: 'monthly',
    priority: '0.8'
  }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap.trim());
console.log('sitemap.xml generated');