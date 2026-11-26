import type { Redirect } from 'next/dist/lib/load-custom-routes';
import { readDocsJson } from './nav';

/**
 * docs.json's redirects (the list Mintlify serves) plus the few paths Mintlify
 * answered without a rule. Every old URL has to keep resolving.
 */
export function getAllRedirects(): Redirect[] {
	const fromDocsJson: Redirect[] = (readDocsJson().redirects ?? [])
		// "/" is ours: the optional catch-all owns it, so it's handled below.
		.filter((r) => r.source !== '/')
		.map((r) => ({
			source: r.source,
			destination: r.destination,
			permanent: r.permanent ?? true,
		}));

	return [
		{ source: '/', destination: '/introduction', permanent: false },
		{ source: '/docs/:path*', destination: '/:path*', permanent: true },
		...fromDocsJson,
	];
}
