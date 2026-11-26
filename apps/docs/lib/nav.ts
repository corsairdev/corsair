import { readFileSync } from 'node:fs';
import path from 'node:path';
import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { createElement } from 'react';

/**
 * The sidebar comes from docs/docs.json, the same file Mintlify reads, so
 * adding a page there (as every plugin PR does) adds it here too.
 */

type NavPage = string | NavGroup;
interface NavGroup {
	group: string;
	pages: NavPage[];
	expanded?: boolean;
	icon?: string;
}
interface NavTab {
	tab: string;
	groups?: NavGroup[];
	pages?: NavPage[];
}
export interface DocsJson {
	navigation: { tabs: NavTab[] };
	redirects?: { source: string; destination: string; permanent?: boolean }[];
}

const DOCS_JSON = path.resolve(process.cwd(), '../../docs/docs.json');

let cached: DocsJson | undefined;
export function readDocsJson(): DocsJson {
	cached ??= JSON.parse(readFileSync(DOCS_JSON, 'utf8')) as DocsJson;
	return cached;
}

export interface NavPageInfo {
	url: string;
	title: string;
	icon?: string;
}

export function sidebarIcon(icon: string | undefined): ReactNode {
	if (!icon || !icon.startsWith('/')) return undefined;
	return createElement('img', {
		src: icon,
		alt: '',
		className: 'framework-icon size-4 shrink-0',
	});
}

/** The tab a docs.json page belongs to, keyed by its slug path ("cloud/mcp"). */
export function tabOfPage(): Map<string, string> {
	const out = new Map<string, string>();
	const visit = (tab: string, pages: NavPage[]) => {
		for (const p of pages) {
			if (typeof p === 'string') out.set(p, tab);
			else visit(tab, p.pages);
		}
	};
	for (const t of readDocsJson().navigation.tabs) {
		for (const g of t.groups ?? []) visit(t.tab, g.pages);
		visit(t.tab, t.pages ?? []);
	}
	return out;
}

/**
 * docs.json → page tree. Tabs are root folders (the navbar tabs), top-level
 * groups are separators, nested groups are folders. A page docs.json names
 * that has no file is left out rather than linking to a 404.
 */
export function buildPageTree(
	lookup: (slugPath: string) => NavPageInfo | undefined,
): PageTree.Root {
	const page = (slugPath: string): PageTree.Item | undefined => {
		const info = lookup(slugPath);
		if (!info) return undefined;
		return {
			$id: `page:${info.url}`,
			type: 'page',
			name: info.title,
			url: info.url,
			icon: sidebarIcon(info.icon),
		};
	};

	// Fumadocs matches tabs to their folders by $id, so every node needs one.
	const nodes = (pages: NavPage[], scope: string): PageTree.Node[] => {
		const out: PageTree.Node[] = [];
		for (const p of pages) {
			if (typeof p === 'string') {
				const item = page(p);
				if (item) out.push(item);
				continue;
			}
			const id = `${scope}/${p.group}`;
			const children = nodes(p.pages, id);
			if (children.length === 0) continue;
			out.push({
				$id: `folder:${id}`,
				type: 'folder',
				name: p.group,
				defaultOpen: p.expanded ?? false,
				children,
			});
		}
		return out;
	};

	const tabs: PageTree.Folder[] = [];
	for (const t of readDocsJson().navigation.tabs) {
		const children: PageTree.Node[] = [];
		for (const g of t.groups ?? []) {
			const scope = `${t.tab}/${g.group}`;
			const groupNodes = nodes(g.pages, scope);
			if (groupNodes.length === 0) continue;
			children.push(
				{ $id: `separator:${scope}`, type: 'separator', name: g.group },
				...groupNodes,
			);
		}
		children.push(...nodes(t.pages ?? [], t.tab));
		if (children.length === 0) continue;
		tabs.push({
			$id: `tab:${t.tab}`,
			type: 'folder',
			name: t.tab,
			root: true,
			children,
		});
	}

	return { name: 'Corsair', children: tabs };
}

function containsUrl(node: PageTree.Node, url: string): boolean {
	if (node.type === 'page') return node.url === url;
	if (node.type === 'folder')
		return (
			node.index?.url === url || node.children.some((c) => containsUrl(c, url))
		);
	return false;
}

function firstPage(nodes: PageTree.Node[]): PageTree.Item | undefined {
	for (const n of nodes) {
		if (n.type === 'page') return n;
		if (n.type === 'folder') {
			const p = n.index ?? firstPage(n.children);
			if (p) return p;
		}
	}
	return undefined;
}

/**
 * The part of the tree one page's sidebar shows. The whole tree is ~3,500
 * nodes (785 plugins), and every page carries its tree in the HTML, so:
 * - other tabs keep only their first page, which is all their navbar tab needs;
 * - in the active tab, a folder that doesn't hold this page and has more than
 *   a page's worth of children (each plugin) becomes a link to its first page.
 */
export function treeForPage(tree: PageTree.Root, url: string): PageTree.Root {
	const collapse = (nodes: PageTree.Node[]): PageTree.Node[] =>
		nodes.map((n) => {
			if (n.type !== 'folder') return n;
			if (containsUrl(n, url))
				return { ...n, defaultOpen: true, children: collapse(n.children) };
			const first = firstPage(n.children);
			if (!first) return n;
			// Small groups (Use cases, Full-stack, …) stay folders; a plugin's
			// pages collapse into one link to its overview.
			if (n.children.every((c) => c.type === 'page') && n.children.length <= 5)
				return {
					$id: n.$id,
					type: 'page',
					name: n.name,
					url: first.url,
					icon: n.icon,
				};
			return { ...n, children: collapse(n.children) };
		});

	const active =
		tree.children.find((t) => containsUrl(t, url)) ?? tree.children[0];
	return {
		...tree,
		children: tree.children.map((tab) => {
			if (tab.type !== 'folder') return tab;
			if (tab === active) {
				// Only the Plugins tab is large enough to need collapsing.
				return tab.children.length > 100
					? { ...tab, children: collapse(tab.children) }
					: tab;
			}
			const first = firstPage(tab.children);
			return { ...tab, children: first ? [first] : [] };
		}),
	};
}
