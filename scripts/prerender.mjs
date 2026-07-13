// scripts/prerender.mjs
import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { RAW_PROJECTS } from '../src/utils/projectdata.js';
import { slugify } from '../src/utils/slugify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '../dist');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const staticRoutes = ['/', '/projects'];
const dynamicRoutes = RAW_PROJECTS.map(
  (p) => `/projects/${slugify(p.title)}`
);
const allRoutes = [...staticRoutes, ...dynamicRoutes];

// Map route → expected title
const expectedTitle = new Map();
RAW_PROJECTS.forEach((p) => {
  const slug = slugify(p.title);
  expectedTitle.set(
    `/projects/${slug}`,
    `${p.title} — Kayvion Labs Case Study | Kayvion Labs`
  );
});

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

async function startServer(port = 3456) {
  const server = createServer(async (req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = join(DIST, filePath);

    // Try exact file first
    try {
      if (!existsSync(filePath)) throw new Error('not found');
      const stat = await readFile(filePath);
      const ext = extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(stat);
      return;
    } catch {}

    // Try directory or .html
    if (!extname(filePath)) {
      const asHtml = filePath + '.html';
      const asDir = join(filePath, 'index.html');
      try {
        if (existsSync(asHtml)) {
          const content = await readFile(asHtml);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
          return;
        } else if (existsSync(asDir)) {
          const content = await readFile(asDir);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
          return;
        }
      } catch {}
    }

    // SPA fallback for routes (no extension, or .html)
    if (!extname(filePath) || extname(filePath) === '.html') {
      const fallback = await readFile(join(DIST, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fallback);
      return;
    }

    res.writeHead(404);
    res.end();
  });

  return new Promise((resolve) => {
    server.listen(port, () =>
      resolve({ server, url: `http://localhost:${port}` })
    );
  });
}

async function prerender() {
  const { server, url } = await startServer(3456);

  // 👇 Vercel‑safe launch: no sandbox, no setuid
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  for (const route of allRoutes) {
    console.log(`\nPrerendering: ${route}`);

    try {
      await page.goto(`${url}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      });

      console.log('Waiting for navigation element...');
      await page.waitForSelector('nav', { timeout: 30000 });
      console.log('Navigation element found.');

      // Extra settle time for lazy components
      await delay(2000);

      const targetTitle = expectedTitle.get(route);
      if (targetTitle) {
        console.log(`Waiting for title: "${targetTitle}"`);
        try {
          await page.waitForFunction(
            (title) => document.title === title,
            { timeout: 15000 },
            targetTitle
          );
          console.log('Title matched!');
        } catch {
          console.warn('Timeout waiting for title – capturing as-is.');
          await delay(3000);
        }
      }

      const html = await page.content();
      const outPath =
        route === '/'
          ? join(DIST, 'index.html')
          : join(DIST, route, 'index.html');

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html);
      console.log(`Saved: ${outPath}`);
    } catch (err) {
      console.error(`Failed to prerender ${route}:`, err.message);
      const fallbackHtml = await readFile(join(DIST, 'index.html'), 'utf-8');
      const outPath =
        route === '/'
          ? join(DIST, 'index.html')
          : join(DIST, route, 'index.html');
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, fallbackHtml);
      console.log(`Saved fallback for: ${route}`);
    }
  }

  await browser.close();
  server.close();
  console.log('\nPrerendering complete.');
}

prerender().catch(console.error);