'use strict';

// Parse the WordPress export and write deterministic Hexo Markdown files.
const fs = require('fs/promises');
const path = require('path');
const parseFeed = require('hexo-migrator-wordpress/lib/feed');
const TurndownService = require('turndown');
const { convertShortcodes } = require('../lib/wordpress-content');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'source', '_posts');
const draftsDir = path.join(rootDir, 'source', '_drafts');
const exportPath = path.join(rootDir, 'migration', 'wordpress-export.xml');

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

function toMarkdown(content) {
  let html = String(content || '').trim();
  if (!/<p(?:\s|>)/i.test(html)) {
    html = `<p>${html.replace(/(\r?\n){2,}/g, '</p>\n\n<p>')}</p>`;
  }
  return turndown.turndown(html);
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function safeFilename(value) {
  let decoded = String(value || 'untitled');
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep the original value when it is not URI encoded.
  }

  return decoded
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'untitled';
}

function buildFrontMatter(item, permalink) {
  const lines = [
    '---',
    'layout: post',
    `title: ${yamlString(item.title || 'Untitled')}`,
    `date: ${item.date}`
  ];

  if (permalink) lines.push(`permalink: ${yamlString(permalink)}`);
  lines.push(`id: ${yamlString(item.id)}`);

  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
  if (tags.length) {
    lines.push('tags:');
    for (const tag of tags) lines.push(`  - ${yamlString(tag)}`);
  } else {
    lines.push('tags: []');
  }

  const categories = Array.isArray(item.categories)
    ? item.categories.filter(Boolean)
    : [];
  lines.push('categories:');
  if (categories.length) {
    for (const category of categories) lines.push(`  - ${yamlString(category)}`);
  } else {
    lines.push(`  - ${yamlString('未分类')}`);
  }

  if (item.comment === 'closed') lines.push('comments: false');
  lines.push('---');
  return lines.join('\n');
}

function readId(markdown) {
  const match = markdown.match(/^id:\s*['"]?(\d+)['"]?\s*$/m);
  return match ? match[1] : null;
}

function extractWordPressDates(xml) {
  const dates = new Map();
  const items = xml.match(/<item\b[\s\S]*?<\/item>/g) || [];

  for (const item of items) {
    const id = item.match(/<wp:post_id>\s*(\d+)\s*<\/wp:post_id>/);
    const date = item.match(
      /<wp:post_date><!\[CDATA\[([^\]]+)\]\]><\/wp:post_date>/
    );
    if (id && date) dates.set(id[1], date[1].trim());
  }

  return dates;
}

async function listMarkdown(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.md')
      .map(entry => path.join(directory, entry.name));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function removeStaleGeneratedFiles(expectedPaths) {
  const files = [
    ...await listMarkdown(postsDir),
    ...await listMarkdown(draftsDir)
  ];

  for (const file of files) {
    const markdown = await fs.readFile(file, 'utf8');
    if (readId(markdown) && !expectedPaths.has(path.normalize(file))) {
      await fs.rm(file);
    }
  }
}

async function migrateWordPress() {
  const xml = await fs.readFile(exportPath, 'utf8');
  const feed = await parseFeed(xml);
  const dates = extractWordPressDates(xml);
  const outputs = [];

  for (const item of feed.items) {
    if (item.status === 'trash') continue;

    const localDate = dates.get(String(item.id)) || item.date;
    const filename = `${safeFilename(item.slug || item.title)}.md`;
    const destinationDir = item.status === 'private' ? draftsDir : postsDir;
    const destination = path.join(destinationDir, filename);
    let permalink = item.link ? new URL(item.link).pathname : '';
    try {
      permalink = decodeURIComponent(permalink);
    } catch {
      // Keep the original path when it is not valid URI encoding.
    }
    const body = convertShortcodes(toMarkdown(item.content || item.description));
    const markdown = `${buildFrontMatter({ ...item, date: localDate }, permalink)}\n\n${body}`;

    outputs.push({
      destination,
      markdown,
      id: String(item.id),
      status: item.status
    });
  }

  const expectedPaths = new Set(outputs.map(output => path.normalize(output.destination)));
  await removeStaleGeneratedFiles(expectedPaths);

  for (const output of outputs) {
    await fs.mkdir(path.dirname(output.destination), { recursive: true });

    try {
      const existing = await fs.readFile(output.destination, 'utf8');
      if (readId(existing) !== output.id) {
        throw new Error(`Refusing to overwrite non-WordPress file: ${output.destination}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    await fs.writeFile(output.destination, output.markdown, 'utf8');
  }

  return {
    published: outputs.filter(output => output.status === 'publish').length,
    drafts: outputs.filter(output => output.status === 'private').length,
    discarded: feed.items.filter(item => item.status === 'trash').length
  };
}

migrateWordPress()
  .then(result => {
    console.log(
      `WordPress migration complete: ${result.published} published, ` +
      `${result.drafts} drafts, ${result.discarded} trash posts discarded.`
    );
    setImmediate(() => process.exit(0));
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
