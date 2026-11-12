/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `U301_API_KEY=... U301_WORKSPACE_ID=... pnpm --filter @corsair-dev/u301 test:live`.
 * The key must belong to a workspace that allows reads; nothing here writes.
 */

import * as Api from './endpoints';
import type { U301Context } from './index';

const apiKey = process.env.U301_API_KEY;
const workspaceId = process.env.U301_WORKSPACE_ID;

const describeIfKey = apiKey && workspaceId ? describe : describe.skip;

if (!apiKey || !workspaceId) {
	// A skipped run must not read as a green one.
	console.warn(
		[apiKey ? null : 'U301_API_KEY', workspaceId ? null : 'U301_WORKSPACE_ID']
			.filter(Boolean)
			.join(' and ') + ' not set: the live U301 suite is skipped, not passing.',
	);
}

function liveContext(): U301Context {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: `${apiKey}\n${workspaceId}` } as unknown as U301Context;
}

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant, and Output is inferred from the endpoint. The
// endpoints read only `key` off the context, and each input below fits its
// operation's schema, which parses it again.
function live<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: object,
): Promise<Output> {
	return endpoint(liveContext() as never, input as never);
}

describeIfKey('live U301 API', () => {
	it('lists the workspace domains through the output schema', async () => {
		const result = await live(Api.domainList, {});

		expect(Array.isArray(result)).toBe(true);
		// The shared u301.co domain is on every workspace.
		expect(result.length).toBeGreaterThan(0);
		for (const domain of result) {
			expect(typeof domain.domain).toBe('string');
		}
	});

	it('lists short links through the output schema', async () => {
		const result = await live(Api.list, {
			page: 1,
			perPage: 10,
		});

		expect(Array.isArray(result.links)).toBe(true);
		// The page count is in `metadata`, not at the top level.
		expect(typeof result.metadata?.total).toBe('number');
	});

	it('reads one link by its short form and echoes the slug', async () => {
		const listed = await live(Api.list, {
			page: 1,
			perPage: 10,
		});
		// A list row names its short link `shortUrl`, with a scheme the endpoint
		// strips. An empty workspace has nothing to read, which is logged rather
		// than passed silently.
		const shortlink = listed.links?.[0]?.shortUrl;
		if (!shortlink) {
			console.warn('No links in the workspace: links.get was not exercised.');
			return;
		}

		const one = await live(Api.get, {
			shortlink,
		});

		expect(typeof one.slug).toBe('string');
		expect(one.slug).toBe(shortlink.split('/').pop());
	});

	it('reads click buckets through the output schema', async () => {
		const result = await live(Api.clicks, {
			range: '7d',
			granularity: 'day',
		});

		expect(Array.isArray(result.data)).toBe(true);
		// The real field is `click`, singular; a `clicks` model would leave this
		// undefined without failing the parse.
		const anyBucket = result.data?.[0];
		if (anyBucket) expect(typeof anyBucket.click).toBe('number');
	});

	it('reads an audience breakdown through its envelope schema', async () => {
		const result = await live(Api.audience, {
			dimension: 'countries',
			range: '30d',
		});

		// The route answers an envelope, not a bare array.
		expect(Array.isArray(result.data)).toBe(true);
		const row = result.data?.[0];
		if (row) expect(typeof row.label).toBe('string');
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await live(Api.domainList, {});

		// describeIfKey runs this only when U301_API_KEY is set.
		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
