import { notFound } from 'next/navigation';
import { pageMarkdown } from '@/lib/markdown';
import { source } from '@/lib/source';

/**
 * The Markdown of a page, reached as `/<page>.md` (rewrite in next.config.ts)
 * or with `Accept: text/markdown` (proxy.ts). llms.txt links these.
 */
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
	return [];
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await params;
	const headers = { 'content-type': 'text/markdown; charset=utf-8' };

	const page = source.getPage(slug);
	if (!page?.absolutePath) notFound();
	const markdown = await pageMarkdown({
		title: page.data.title,
		description: page.data.description,
		file: page.absolutePath,
	});
	return new Response(markdown, { headers });
}
