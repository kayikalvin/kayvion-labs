import { RAW_PROJECTS } from '../src/utils/projectdata.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://kayvionlabs.com'; // update with your domain

// Replicate the slugify function (or you could export it from a shared utility)
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const projectSlugs = RAW_PROJECTS.map(p => slugify(p.title));

const urls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/projects', changefreq: 'weekly', priority: '0.9' },
  ...projectSlugs.map(slug => ({
    loc: `/projects/${slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
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

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap.trim());
console.log('✅ sitemap.xml generated with', urls.length, 'URLs');