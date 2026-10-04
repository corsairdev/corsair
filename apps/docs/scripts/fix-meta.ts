/**
 * Regenerate root meta.json files from docs/docs.json (Fumadocs flat pages format).
 * Run: bun apps/docs/scripts/fix-meta.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = join(import.meta.dir, '../../..');
const DOCS_JSON = join(REPO_ROOT, 'docs/docs.json');
const CONTENT_ROOT = join(REPO_ROOT, 'apps/docs/content/docs');

const TAB_DIRS: Record<string, string> = {
	Docs: '(docs)',
	Plugins: 'plugins',
	Guides: '(guides)',
};

type NavGroup = { group: string; pages: NavEntry[] };
type NavEntry = string | NavGroup;

type DocsJson = {
	navigation: { tabs: { tab: string; groups: NavGroup[] }[] };
};

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

const nav = JSON.parse(readFileSync(DOCS_JSON, 'utf8')) as DocsJson;

for (const tab of nav.navigation.tabs) {
	const dirName = TAB_DIRS[tab.tab];
	if (!dirName) continue;
	const pages =
		tab.tab === 'Plugins'
			? convertPluginsRootPages(tab.groups)
			: convertGroups(tab.groups, tab.tab);
	const path = join(CONTENT_ROOT, dirName, 'meta.json');
	writeFileSync(
		path,
		`${JSON.stringify({ title: tab.tab, root: true, pages }, null, 2)}\n`,
	);
	console.log(`Wrote ${path} (${pages.length} entries)`);
}
