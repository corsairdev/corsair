import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderApiMarkdown } from '@/lib/plugin-api-markdown';
import { getPlugin } from '@/lib/plugin-catalog';
import { source } from '@/lib/source';

/**
 * Raw markdown twin of every doc page, reached as `/<slug>.md` via the rewrite
 * in next.config.ts. llms.txt links them.
 */
export const revalidate = 3600;
export const dynamicParams = true;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await params;

	// `/plugins/<id>/api` is a route over the catalog, so there is no file.
	if (slug.length === 3 && slug[0] === 'plugins' && slug[2] === 'api') {
		const entry = getPlugin(slug[1] as string);
		if (!entry) return new Response('Not found', { status: 404 });
		return new Response(renderApiMarkdown(entry), {
			headers: { 'content-type': 'text/markdown; charset=utf-8' },
		});
	}

	const page = source.getPage(slug);
	if (!page) return new Response('Not found', { status: 404 });

	const file =
		page.absolutePath ?? join(process.cwd(), 'content/docs', page.path);

	return new Response(await readFile(file, 'utf8'), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' },
	});
}
