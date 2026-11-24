import { buildHomeMarkdown } from '@/components/landing/home-markdown';

export const dynamic = 'force-static';

/** The homepage as markdown, for agents (see llms.txt and the human/machine switch). */
export function GET() {
	return new Response(buildHomeMarkdown(), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
}
