import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/** A request that prefers Markdown (`Accept: text/markdown`) gets the page's .md. */
export default function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (
		!isMarkdownPreferred(request) ||
		/\.[a-z]+$/i.test(pathname) ||
		pathname === '/'
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
	matcher: ['/((?!_next|api|mcp|llms\\.mdx|icons|images|favicon\\.ico).*)'],
};
