import { ApiError } from 'corsair/http';
import type { MozOperationName } from './endpoints';
import { mozEndpointsNested, mozMethods } from './endpoints';
import { mozOutputSchema } from './endpoints/call';
import { mozLiveError, mozLiveResults } from './live-fixtures';

// Methods the 11-24 live run did not call: SERP fetch costs 15 rows, the two
// generate methods are billed on-demand collection, competitors reserves the
// whole 50-unit mozscape quota, and Moz Local is enterprise only.
const NOT_RUN_LIVE = [
	'competitors.fetch',
	'keywords.generateMetrics',
	'keywords.generateSerp',
	'keywords.serp',
];

// unknown: walks a recorded JSON value to list its leaf paths.
function leafPaths(value: unknown, prefix = ''): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((item) => leafPaths(item, `${prefix}[]`));
	}
	if (value && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, item]) =>
			leafPaths(item, prefix ? `${prefix}.${key}` : key),
		);
	}
	return [prefix];
}

describe('real Moz results (11-24 live run)', () => {
	it('cover every non-Moz Local method except the ones not run live', () => {
		const expected = Object.keys(mozMethods)
			.filter((name) => !name.startsWith('local.'))
			.filter((name) => !NOT_RUN_LIVE.includes(name))
			.sort();
		expect(Object.keys(mozLiveResults).sort()).toEqual(expected);
	});

	it.each(Object.entries(mozLiveResults))(
		'%s parses and keeps every field',
		(name, result) => {
			const parsed = mozOutputSchema(name as MozOperationName).parse(result);
			expect(new Set(leafPaths(parsed))).toEqual(new Set(leafPaths(result)));
		},
	);
});

describe('a real Moz error', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('becomes core ApiError with the HTTP status and JSON-RPC code', async () => {
		global.fetch = jest.fn(
			async () =>
				new Response(JSON.stringify(mozLiveError.body), {
					status: mozLiveError.status,
					headers: { 'content-type': 'application/json' },
				}),
		) as never;
		const lookup = mozEndpointsNested.jobs.lookup as (
			ctx: never,
			input: unknown,
		) => Promise<unknown>;
		const error = await lookup({ key: 'moz-token-abcdef-123456' } as never, {
			id: '00000000-0000-4000-8000-000000000000',
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect((error as ApiError).message).toBe(
			'Moz 404 -32655: Call was not found.',
		);
	});
});
