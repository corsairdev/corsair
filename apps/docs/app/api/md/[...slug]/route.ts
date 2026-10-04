import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { source } from '@/lib/source';

/**
 * Raw markdown twin of every doc page, reached as `/<slug>.md` via the rewrite
 * in next.config.ts. Mintlify served these and llms.txt still links them.
 */
export const revalidate = 3600;
export const dynamicParams = true;

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await params;
	const page = source.getPage(slug);
	if (!page) return new Response('Not found', { status: 404 });

	const file =
		page.absolutePath ?? join(process.cwd(), 'content/docs', page.path);

	return new Response(await readFile(file, 'utf8'), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' },
	});
}
