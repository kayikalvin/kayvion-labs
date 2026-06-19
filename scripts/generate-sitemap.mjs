// scripts/generate-sitemap.mjs
import { PROJECTS } from '../src/components/Projectsindex.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://kayvionlabs.com'; // update with your real domain

// Static routes
const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/projects', changefreq: 'weekly', priority: '0.9' },
];

// Dynamic project routes
const projectRoutes = PROJECTS.map(p => ({
  loc: `/projects/${p.id}`,
  changefreq: 'monthly',
  priority: '0.8',
}));

const urls = [...staticRoutes, ...projectRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap.trim());
console.log('✅ sitemap.xml generated with', urls.length, 'URLs');