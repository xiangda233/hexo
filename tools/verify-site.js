'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function fileForRoute(route) {
  const cleanRoute = route.replace(/^\/+/, '');
  const candidates = new Set([cleanRoute]);

  try {
    candidates.add(decodeURIComponent(cleanRoute));
  } catch {
    // Keep only the original route when it is not valid URI encoding.
  }

  for (const candidate of candidates) {
    const target = path.join(publicDir, candidate);
    if (!candidate || candidate.endsWith('/')) {
      const indexFile = path.join(target, 'index.html');
      if (fs.existsSync(indexFile)) return indexFile;
    } else if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      return target;
    } else if (fs.existsSync(`${target}.html`)) {
      return `${target}.html`;
    } else if (fs.existsSync(path.join(target, 'index.html'))) {
      return path.join(target, 'index.html');
    }
  }

  return null;
}

if (!fs.existsSync(publicDir)) {
  throw new Error('public/ does not exist. Run the build first.');
}

const files = walk(publicDir);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const missing = [];
let checkedLinks = 0;

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const pageRoute = `/${path.relative(publicDir, htmlFile).replaceAll(path.sep, '/')}`;

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (
      !reference ||
      reference.includes('$') ||
      reference.startsWith('#') ||
      /^(?:data:|javascript:|mailto:|tel:)/i.test(reference)
    ) {
      continue;
    }

    const url = new URL(reference, `https://hexo.yuixd.top${pageRoute}`);
    if (url.hostname !== 'hexo.yuixd.top') continue;

    checkedLinks += 1;
    const target = fileForRoute(url.pathname);
    if (!target) {
      missing.push({
        page: path.relative(publicDir, htmlFile),
        reference
      });
    }
  }
}

for (const required of ['index.html', 'atom.xml', 'CNAME', 'search-index.json']) {
  if (!fs.existsSync(path.join(publicDir, required))) {
    throw new Error(`Missing required build output: ${required}`);
  }
}

if (missing.length) {
  for (const link of missing.slice(0, 20)) {
    console.error(`${link.page}: ${link.reference}`);
  }
  throw new Error(`${missing.length} internal links point to missing files.`);
}

console.log(`Verified ${htmlFiles.length} HTML pages and ${checkedLinks} internal links.`);
