import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/** Paths that are endpoints, not pages. Whole segments: /mcp-adapters/* are pages. */
function isEndpoint(pathname: string): boolean {
	return /^\/(?:api|mcp|llms\.mdx)(?:\/|$)/.test(pathname);
}

/** A request that prefers Markdown (`Accept: text/markdown`) gets the page's .md. */
export default function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (
		!isMarkdownPreferred(request) ||
		pathname === '/' ||
		isEndpoint(pathname) ||
		// Files (.md, .txt, icons, images) are already what was asked for.
		/\.[a-z0-9]+$/i.test(pathname)
	)
		return NextResponse.next();
	return NextResponse.rewrite(
		new URL(`/llms.mdx${pathname}`, request.nextUrl),
		{
			headers: { Vary: 'Accept' },
		},
	);
}

export const config = {
	matcher: ['/((?!_next/).*)'],
};
