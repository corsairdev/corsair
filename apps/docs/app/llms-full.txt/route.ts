import type * as PageTree from 'fumadocs-core/page-tree';
import { pageMarkdown } from '@/lib/markdown';
import { SITE_URL } from '@/lib/site';
import { getPageTree, source } from '@/lib/source';

/**
 * Every written page, in sidebar order. The ~2,500 generated plugin pages
 * stay out (the Mintlify version was 53 MB, more than an agent can read);
 * each plugin's reference is at /plugins/<id>/api.md and friends.
 */
export const revalidate = 3600;

function urls(nodes: PageTree.Node[], out: string[] = []): string[] {
	for (const n of nodes) {
		if (n.type === 'page') out.push(n.url);
		else if (n.type === 'folder') {
			if (n.index) out.push(n.index.url);
			urls(n.children, out);
		}
	}
	return out;
}

export async function GET() {
	const ordered = urls(getPageTree().children).filter(
		(u) => !u.startsWith('/plugins/'),
	);
	const parts: string[] = [
		`# Corsair documentation\n\nEvery page of ${SITE_URL} except the per-plugin reference pages. A plugin's pages are at ${SITE_URL}/plugins/<id>/overview.md, /api.md, /database.md and /webhooks.md; the plugin list is at ${SITE_URL}/guides/plugins.md.\n`,
	];
	for (const url of ordered) {
		const page = source.getPage(url.split('/').filter(Boolean));
		if (!page?.absolutePath) continue;
		const md = await pageMarkdown(
			{
				title: page.data.title,
				description: page.data.description,
				file: page.absolutePath,
			},
			{ header: false },
		);
		parts.push(`Source: ${SITE_URL}${page.url}.md\n\n${md}`);
	}
	return new Response(parts.join('\n---\n\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	});
}
