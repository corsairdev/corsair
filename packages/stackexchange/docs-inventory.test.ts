import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { ROUTE_GROUPS } from './endpoints/routes';

// Snapshot of every v2.3 method page on api.stackexchange.com/docs (11-15):
// the page's own `var method`, POST flag, access_token and scope parameters,
// and whether the method takes `site` (the docs index section, corrected by
// the live API for the two network-activity methods).
const DocsMethodSchema = z.object({
	path: z.string(),
	method: z.enum(['GET', 'POST']),
	token: z.boolean(),
	scopes: z.array(z.string()),
	site: z.boolean(),
});
const docsMethods = z
	.record(z.string(), DocsMethodSchema)
	.parse(
		JSON.parse(
			readFileSync(
				join(__dirname, '__fixtures__', 'docs-methods.json'),
				'utf8',
			),
		),
	);

const normalise = (path: string) => path.toLowerCase();
const scopesOf = (scope: string | readonly string[]) =>
	(typeof scope === 'string' ? [scope] : [...scope]).filter(
		(name) => name !== 'none' && name !== 'user',
	);

describe('route catalog matches the Stack Exchange v2.3 docs', () => {
	const routes = Object.values(ROUTE_GROUPS).flat();

	it('uses the docs method id for every route so docs links resolve', () => {
		const unknown = routes
			.map((route) => route.id)
			.filter((id) => !(id in docsMethods));
		expect(unknown).toEqual([]);
	});

	it('uses the documented path and HTTP method', () => {
		for (const route of routes) {
			const doc = docsMethods[route.id];
			if (!doc) continue;
			expect({ id: route.id, path: normalise(route.path) }).toEqual({
				id: route.id,
				path: normalise(doc.path),
			});
			expect({
				id: route.id,
				method: route.methods.includes(doc.method),
			}).toEqual({ id: route.id, method: true });
		}
	});

	it('sends site only to per-site methods', () => {
		for (const route of routes) {
			const doc = docsMethods[route.id];
			if (!doc) continue;
			expect({ id: route.id, site: route.site }).toEqual({
				id: route.id,
				site: doc.site,
			});
		}
	});

	it('requires an access token exactly where the docs do', () => {
		for (const route of routes) {
			const doc = docsMethods[route.id];
			if (!doc) continue;
			expect({ id: route.id, token: route.scope !== 'none' }).toEqual({
				id: route.id,
				token: doc.token,
			});
		}
	});

	it('records every documented OAuth scope', () => {
		for (const route of routes) {
			const doc = docsMethods[route.id];
			if (!doc) continue;
			expect({ id: route.id, scopes: scopesOf(route.scope).sort() }).toEqual({
				id: route.id,
				scopes: [...doc.scopes].sort(),
			});
		}
	});
});
