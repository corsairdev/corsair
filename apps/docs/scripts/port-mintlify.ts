/**
 * One-shot Mintlify → Fumadocs content port.
 * Run from repo root: bun apps/docs/scripts/port-mintlify.ts
 */
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

const REPO_ROOT = join(import.meta.dir, '../../..');
const DOCS_SRC = join(REPO_ROOT, 'docs');
const DOCS_JSON = join(DOCS_SRC, 'docs.json');
const CONTENT_ROOT = join(REPO_ROOT, 'apps/docs/content/docs');
const SNIPPETS_OUT = join(REPO_ROOT, 'apps/docs/content/snippets');
const PUBLIC_DIR = join(REPO_ROOT, 'apps/docs/public');
const IMAGES_SRC = join(DOCS_SRC, 'images');

const TAB_DIRS: Record<string, string> = {
  Docs: '(docs)',
  Plugins: 'plugins',
  Guides: '(guides)',
};

const DROPPED_FM_KEYS = new Set(['mode', 'sidebarTitle']);
const todoNotes: string[] = [];
const droppedDuplicates: string[] = [];
const droppedFmKeys = new Set<string>();
let pagesPorted = 0;

type NavGroup = { group: string; pages: NavEntry[]; expanded?: boolean };
type NavEntry = string | NavGroup;

type DocsJson = {
  navigation: {
    tabs: { tab: string; groups: NavGroup[] }[];
  };
};

function readDocsJson(): DocsJson {
  return JSON.parse(readFileSync(DOCS_JSON, 'utf8')) as DocsJson;
}

function collectNavPages(
  entries: NavEntry[],
  tab: string,
  map: Map<string, string>,
): void {
  for (const entry of entries) {
    if (typeof entry === 'string') {
      map.set(entry, tab);
    } else {
      collectNavPages(entry.pages, tab, map);
    }
  }
}

function toFumaPagePath(pagePath: string, tab: string): string {
  if (tab === 'Plugins' && pagePath.startsWith('plugins/')) {
    return pagePath.slice('plugins/'.length);
  }
  return pagePath;
}

function convertNavPages(entries: NavEntry[], tab: string): string[] {
  const result: string[] = [];
  for (const entry of entries) {
    if (typeof entry === 'string') {
      result.push(toFumaPagePath(entry, tab));
      continue;
    }
    result.push(`---${entry.group}---`);
    result.push(...convertNavPages(entry.pages, tab));
  }
  return result;
}

function convertGroups(groups: NavGroup[], tab: string): string[] {
  const result: string[] = [];
  for (const g of groups) {
    result.push(`---${g.group}---`);
    result.push(...convertNavPages(g.pages, tab));
  }
  return result;
}

function convertPluginsRootPages(groups: NavGroup[]): string[] {
  const result: string[] = [];
  for (const g of groups) {
    result.push(`---${g.group}---`);
    for (const entry of g.pages) {
      if (typeof entry === 'string') {
        result.push(toFumaPagePath(entry, 'Plugins'));
        continue;
      }
      const first = entry.pages[0];
      if (typeof first === 'string' && first.startsWith('plugins/')) {
        result.push(first.split('/')[1]);
      }
    }
  }
  return result;
}

function sourceRelPath(pagePath: string): string {
  return `${pagePath}.mdx`;
}

function targetRelPath(pagePath: string, tab: string): string {
  if (tab === 'Plugins' && pagePath.startsWith('plugins/')) {
    return pagePath.slice('plugins/'.length);
  }
  return pagePath;
}

function resolveTab(pagePath: string, navMap: Map<string, string>): string {
  if (navMap.has(pagePath)) return navMap.get(pagePath)!;
  if (pagePath.startsWith('plugins/')) return 'Plugins';
  if (
    pagePath.startsWith('guides/dashboard') ||
    pagePath.startsWith('guides/plugin-credentials') ||
    pagePath.startsWith('guides/webhooks') ||
    pagePath === 'guides/workflows'
  ) {
    return 'Guides';
  }
  return 'Docs';
}

function parseFrontmatter(content: string): {
  frontmatter: string;
  body: string;
  keys: string[];
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: '', body: content, keys: [] };

  const fmBlock = match[1];
  const keys: string[] = [];
  const kept: string[] = [];
  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) {
      kept.push(line);
      continue;
    }
    const [, key] = m;
    keys.push(key);
    if (DROPPED_FM_KEYS.has(key)) {
      droppedFmKeys.add(key);
      continue;
    }
    kept.push(line);
  }

  return {
    frontmatter: kept.length ? `---\n${kept.join('\n')}\n---\n` : '',
    body: content.slice(match[0].length),
    keys,
  };
}

function convertCodeGroups(content: string): string {
  return content.replace(
    /<CodeGroup>([\s\S]*?)<\/CodeGroup>/g,
    (_, inner: string) => {
      const blocks: { label: string; lang: string; code: string }[] = [];
      const re = /```(\S+)?\s*([^\n]*)\n([\s\S]*?)```/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(inner)) !== null) {
        const lang = m[1] ?? 'text';
        const rest = m[2]?.trim() ?? '';
        const label = rest.length > 0 ? rest : lang;
        blocks.push({ label, lang, code: m[3] });
      }
      if (blocks.length === 0) {
        todoNotes.push('CodeGroup with no fenced blocks');
        return inner;
      }
      const items = blocks.map((b) => JSON.stringify(b.label)).join(', ');
      const tabs = blocks
        .map(
          (b) =>
            `<Tab value=${JSON.stringify(b.label)}>\n\`\`\`${b.lang}\n${b.code}\`\`\`\n</Tab>`,
        )
        .join('\n\n');
      return `<Tabs items={[${items}]}>\n\n${tabs}\n\n</Tabs>`;
    },
  );
}

function isTabsOpenAt(content: string, index: number): 'plain' | 'items' | false {
  if (content.slice(index, index + 6) === '<Tabs>') return 'plain';
  if (content.slice(index, index + 11) === '<Tabs items') return 'items';
  return false;
}

function tabsOpenTagLength(content: string, index: number): number {
  if (content.slice(index, index + 6) === '<Tabs>') return 6;
  const close = content.indexOf('>', index);
  return close === -1 ? 6 : close - index + 1;
}

function findMatchingTabsClose(content: string, openEnd: number): number {
  let depth = 1;
  let pos = openEnd;
  while (pos < content.length && depth > 0) {
    const rest = content.slice(pos);
    const closeIdx = rest.indexOf('</Tabs>');
    if (closeIdx === -1) return -1;

    let nextOpen = -1;
    let nextOpenLen = 0;
    for (let j = 0; j < rest.length && j < closeIdx; j++) {
      const kind = isTabsOpenAt(rest, j);
      if (kind) {
        nextOpen = j;
        nextOpenLen = tabsOpenTagLength(rest, j);
        break;
      }
    }

    if (nextOpen !== -1) {
      depth++;
      pos += nextOpen + nextOpenLen;
    } else {
      depth--;
      if (depth === 0) return pos + closeIdx + 7;
      pos += closeIdx + 7;
    }
  }
  return -1;
}

function convertOneTabsBlock(inner: string): string | null {
  const titles: string[] = [];
  const titleRe = /<Tab\s+title=(?:"([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = titleRe.exec(inner)) !== null) {
    titles.push(m[1] ?? m[2]);
  }
  if (titles.length === 0) return null;
  const items = titles.map((t) => JSON.stringify(t)).join(', ');
  const converted = inner.replace(
    /<Tab\s+title=(?:"([^"]*)"|'([^']*)')/g,
    (_, a, b) => `<Tab value=${JSON.stringify(a ?? b)}`,
  );
  return `<Tabs items={[${items}]}>${converted}</Tabs>`;
}

function convertMintlifyTabs(content: string): string {
  let out = content;
  let changed = true;
  while (changed) {
    changed = false;
    let i = 0;
    while (i < out.length) {
      if (isTabsOpenAt(out, i) !== 'plain') {
        i++;
        continue;
      }
      const openStart = i;
      const openEnd = i + 6;
      const closeEnd = findMatchingTabsClose(out, openEnd);
      if (closeEnd === -1) {
        i = openEnd;
        continue;
      }
      const inner = out.slice(openEnd, closeEnd - 7);
      if (/<Tabs>/.test(inner)) {
        i = closeEnd;
        continue;
      }
      const converted = convertOneTabsBlock(inner);
      if (!converted) {
        i = closeEnd;
        continue;
      }
      changed = true;
      out = out.slice(0, openStart) + converted + out.slice(closeEnd);
      i = openStart + converted.length;
    }
  }
  return out;
}

function convertCallouts(content: string): string {
  const pairs: [string, string][] = [
    ['Note', 'info'],
    ['Tip', 'info'],
    ['Info', 'info'],
    ['Check', 'info'],
    ['Warning', 'warn'],
  ];
  let out = content;
  for (const [tag, type] of pairs) {
    out = out.replace(new RegExp(`<${tag}>`, 'g'), `<Callout type="${type}">`);
    out = out.replace(new RegExp(`</${tag}>`, 'g'), '</Callout>');
  }
  return out;
}

function convertAccordions(content: string): string {
  return content
    .replace(/<AccordionGroup>/g, '<Accordions>')
    .replace(/<\/AccordionGroup>/g, '</Accordions>');
}

function convertCards(content: string): string {
  return content
    .replace(/<CardGroup[^>]*>/g, '<Cards>')
    .replace(/<\/CardGroup>/g, '</Cards>')
    .replace(/\s+icon=(?:"[^"]*"|'[^']*')/g, '');
}

function convertParamFields(content: string): string {
  return content.replace(
    /<ParamField\s+([^>]+)>([\s\S]*?)<\/ParamField>/g,
    (_, attrs: string, body: string) => {
      const path = attrs.match(/path=(?:"([^"]*)"|'([^']*)')/)?.[1] ?? attrs.match(/path=(?:"([^"]*)"|'([^']*)')/)?.[2] ?? '';
      const type = attrs.match(/type=(?:"([^"]*)"|'([^']*)')/)?.[1] ?? attrs.match(/type=(?:"([^"]*)"|'([^']*)')/)?.[2] ?? '—';
      const required = /\brequired\b/.test(attrs) ? 'Yes' : 'No';
      const desc = body.trim().replace(/\n/g, ' ');
      return `| \`${path}\` | \`${type}\` | ${required} | ${desc} |`;
    },
  );
}

function wrapParamFieldTables(content: string): string {
  const lines = content.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('| `') && line.includes(' | ')) {
      const tableRows: string[] = [line];
      i++;
      while (i < lines.length && lines[i].startsWith('| `')) {
        tableRows.push(lines[i]);
        i++;
      }
      out.push('');
      out.push('| Parameter | Type | Required | Description |');
      out.push('| --- | --- | --- | --- |');
      out.push(...tableRows);
      out.push('');
      continue;
    }
    out.push(line);
    i++;
  }
  return out.join('\n');
}

function convertFrames(content: string): string {
  return content.replace(
    /<Frame[^>]*>([\s\S]*?)<\/Frame>/g,
    (_, inner: string) => inner.trim(),
  );
}

function convertSnippetImports(content: string, fromDir: string): string {
  return content.replace(
    /import\s+(\{[^}]+\}|\w+)\s+from\s+['"]\/snippets\/([^'"]+)['"]\s*;?/g,
    (_full, spec, snippetPath: string) => {
      if (snippetPath === 'generate-kek.mdx') {
        return `import ${spec} from '@/components/generate-kek';`;
      }
      if (snippetPath === 'windows-shell.mdx') {
        return `import ${spec} from '@/components/windows-shell';`;
      }
      const absSnippet = join(SNIPPETS_OUT, snippetPath);
      const rel = relative(fromDir, absSnippet).replace(/\\/g, '/');
      const importPath = rel.startsWith('.') ? rel : `./${rel}`;
      return `import ${spec} from '${importPath}';`;
    },
  );
}

function escapeMdxTextSegment(segment: string): string {
  const lines = segment.split('\n');
  return lines
    .map((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith('import ')) return line;
      if (/^<(Tab|Tabs|Callout|Accordion|Accordions|Card|Cards|Step|Steps)\b/.test(trimmed)) {
        return line;
      }
      let out = line;
      out = out.replace(/<([a-z][a-zA-Z0-9]*)>/g, '`<$1>`');
      out = out.replace(/\{([^{}]*)\}/g, (match, inner: string) => {
        if (match.startsWith('\\{')) return match;
        if (/['":]|^\s*\.\.\./.test(inner)) return `\\{${inner}\\}`;
        return match;
      });
      return out;
    })
    .join('\n');
}

function escapeMdxLiterals(content: string): string {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part;
      const segments = part.split(/(`[^`]*`)/g);
      return segments
        .map((seg, j) => (j % 2 === 1 ? seg : escapeMdxTextSegment(seg)))
        .join('');
    })
    .join('');
}

function needsReactImport(content: string): boolean {
  return (
    /\buseState\b/.test(content) ||
    /\buseEffect\b/.test(content) ||
    /\buseRef\b/.test(content) ||
    /\buseCallback\b/.test(content)
  );
}

function ensureReactImport(content: string): string {
  if (!needsReactImport(content)) return content;
  if (/from\s+['"]react['"]/.test(content)) return content;
  const fmMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const insert = `'use client';\n\nimport { useState, useEffect, useRef, useCallback } from 'react';\n\n`;
  if (fmMatch) {
    return content.replace(fmMatch[0], `${fmMatch[0]}${insert}`);
  }
  return `${insert}${content}`;
}

function collectComponents(content: string): Set<string> {
  const needs = new Set<string>();
  if (/<Tabs[\s>]/.test(content)) needs.add('tabs');
  if (/<Callout[\s>]/.test(content)) needs.add('callout');
  if (/<Accordions[\s>]/.test(content)) needs.add('accordion');
  if (/<Cards[\s>]/.test(content) || /<Card[\s>]/.test(content)) needs.add('card');
  if (/<Steps[\s>]/.test(content) || /<Step[\s>]/.test(content)) needs.add('steps');
  return needs;
}

function buildComponentImports(needs: Set<string>, existing: string): string {
  const lines: string[] = [];
  if (needs.has('tabs') && !existing.includes('fumadocs-ui/components/tabs')) {
    lines.push(`import { Tab, Tabs } from 'fumadocs-ui/components/tabs';`);
  }
  if (needs.has('callout') && !existing.includes('fumadocs-ui/components/callout')) {
    lines.push(`import { Callout } from 'fumadocs-ui/components/callout';`);
  }
  if (needs.has('accordion') && !existing.includes('fumadocs-ui/components/accordion')) {
    lines.push(`import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';`);
  }
  if (needs.has('card') && !existing.includes('fumadocs-ui/components/card')) {
    lines.push(`import { Card, Cards } from 'fumadocs-ui/components/card';`);
  }
  if (needs.has('steps') && !existing.includes('fumadocs-ui/components/steps')) {
    lines.push(`import { Step, Steps } from 'fumadocs-ui/components/steps';`);
  }
  return lines.join('\n');
}

function transformMdx(content: string, fromDir: string): string {
  const { frontmatter, body } = parseFrontmatter(content);
  let out = body;

  // Mintlify <Tabs> before <CodeGroup> — CodeGroup becomes <Tabs> and breaks outer matching.
  out = convertMintlifyTabs(out);
  out = convertCodeGroups(out);
  out = convertCallouts(out);
  out = convertAccordions(out);
  out = convertCards(out);
  out = convertParamFields(out);
  out = wrapParamFieldTables(out);
  out = convertFrames(out);
  out = convertSnippetImports(out, fromDir);
  out = escapeMdxLiterals(out);

  if (/<(Note|Tip|Info|Check|Warning|CardGroup|CodeGroup|AccordionGroup|ParamField|Frame)\b/.test(out)) {
    todoNotes.push(`Unresolved Mintlify component in ${fromDir}`);
  }

  const needs = collectComponents(out);
  const importBlock = buildComponentImports(needs, out);

  const parts = [frontmatter];
  if (importBlock) parts.push(importBlock);
  parts.push(out.trimStart());
  return parts.filter(Boolean).join('\n\n') + '\n';
}

function writeMetaJson(dir: string, data: object): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.json'), `${JSON.stringify(data, null, 2)}\n`);
}

function cleanPortedDirs(): void {
  for (const tabDir of ['(docs)', 'plugins', '(guides)']) {
    const base = join(CONTENT_ROOT, tabDir);
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base)) {
      const full = join(base, entry);
      if (entry === 'meta.json') continue;
      rmSync(full, { recursive: true, force: true });
    }
  }
  if (existsSync(SNIPPETS_OUT)) {
    rmSync(SNIPPETS_OUT, { recursive: true, force: true });
  }
}

function portSnippets(): void {
  const src = join(DOCS_SRC, 'snippets');
  mkdirSync(SNIPPETS_OUT, { recursive: true });

  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!name.endsWith('.mdx')) continue;
      if (name === 'generate-kek.mdx' || name === 'windows-shell.mdx') continue;
      const rel = relative(src, full);
      const outPath = join(SNIPPETS_OUT, rel);
      mkdirSync(dirname(outPath), { recursive: true });
      let content = readFileSync(full, 'utf8');
      content = transformMdx(content, dirname(outPath));
      content = ensureReactImport(content);
      writeFileSync(outPath, content);
    }
  }
  walk(src);
}

function portImages(): void {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  if (existsSync(IMAGES_SRC)) {
    cpSync(IMAGES_SRC, join(PUBLIC_DIR, 'images'), { recursive: true });
  }
  const favicon = join(DOCS_SRC, 'favicon.ico');
  if (existsSync(favicon)) {
    copyFileSync(favicon, join(PUBLIC_DIR, 'favicon.ico'));
  }
}

function writePluginMeta(nav: DocsJson, tab: string): void {
  const pluginsTab = nav.navigation.tabs.find((t) => t.tab === tab);
  if (!pluginsTab) return;

  for (const group of pluginsTab.groups) {
    for (const entry of group.pages) {
      if (typeof entry === 'string') continue;
      if (typeof entry.pages[0] === 'string' && entry.pages[0].startsWith('plugins/')) {
        const pluginPages = entry.pages as string[];
        const pluginSlug = pluginPages[0].split('/')[1];
        const pages = pluginPages.map((p) => basename(p));
        writeMetaJson(join(CONTENT_ROOT, 'plugins', pluginSlug), { pages });
      }
    }
  }
}

function writeRootMetas(nav: DocsJson): void {
  for (const tab of nav.navigation.tabs) {
    const dirName = TAB_DIRS[tab.tab];
    if (!dirName) continue;
    const pages =
      tab.tab === 'Plugins'
        ? convertPluginsRootPages(tab.groups)
        : convertGroups(tab.groups, tab.tab);
    writeMetaJson(join(CONTENT_ROOT, dirName), {
      title: tab.tab,
      root: true,
      pages,
    });
  }
}

function portPages(navMap: Map<string, string>): void {
  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (relative(DOCS_SRC, full).startsWith('snippets')) continue;
        walk(full);
        continue;
      }
      if (!name.endsWith('.mdx')) continue;

      const relFromDocs = relative(DOCS_SRC, full).replace(/\.mdx$/, '').replace(/\\/g, '/');
      const tab = resolveTab(relFromDocs, navMap);
      const tabDir = TAB_DIRS[tab];
      if (!tabDir) continue;

      const relTarget = targetRelPath(relFromDocs, tab);
      const outPath = join(CONTENT_ROOT, tabDir, `${relTarget}.mdx`);
      mkdirSync(dirname(outPath), { recursive: true });

      const raw = readFileSync(full, 'utf8');
      const transformed = transformMdx(raw, dirname(outPath));
      writeFileSync(outPath, transformed);
      pagesPorted++;
    }
  }
  walk(DOCS_SRC);
}

function main(): void {
  const nav = readDocsJson();
  const navMap = new Map<string, string>();
  for (const tab of nav.navigation.tabs) {
    for (const group of tab.groups) {
      collectNavPages(group.pages, tab.tab, navMap);
    }
  }

  cleanPortedDirs();
  portSnippets();
  portImages();
  portPages(navMap);
  writeRootMetas(nav);
  writePluginMeta(nav, 'Plugins');

  const summary = {
    pagesPorted,
    droppedFmKeys: [...droppedFmKeys],
    todoNotes: [...new Set(todoNotes)].slice(0, 50),
    droppedDuplicates,
  };
  writeFileSync(
    join(REPO_ROOT, 'apps/docs/PORT-SUMMARY.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  console.log(JSON.stringify(summary, null, 2));
}

main();
