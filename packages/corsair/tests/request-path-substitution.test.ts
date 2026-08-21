import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

/**
 * Covers path-parameter substitution in `getUrl`.
 *
 * The substitution regex previously used a lazy `.*?`, which backtracks from
 * every `{` in the string. On input such as `"{a".repeat(n)` that is quadratic
 * — roughly 20s at n=200_000 — which CodeQL flagged as a polynomial regular
 * expression on uncontrolled data.
 */

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1.0.0',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'omit',
	TOKEN: undefined,
	HEADERS: {},
};

let requested: string[] = [];

beforeEach(() => {
	requested = [];
	global.fetch = jest.fn(async (url: unknown) => {
		requested.push(String(url));
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => ({}),
			text: async () => '',
		} as unknown as Response;
	}) as unknown as typeof fetch;
});

async function urlFor(url: string, path?: Record<string, unknown>) {
	await request(config, { method: 'GET', url, path });
	return requested[0];
}

describe('path parameter substitution', () => {
	it('substitutes a single placeholder', async () => {
		expect(await urlFor('/v1/users/{user_id}', { user_id: 'u1' })).toBe(
			'https://api.example.com/v1/users/u1',
		);
	});

	it('substitutes multiple placeholders', async () => {
		expect(
			await urlFor('/v1/workspaces/{workspace_id}/members/{user_id}', {
				workspace_id: 'w1',
				user_id: 'u1',
			}),
		).toBe('https://api.example.com/v1/workspaces/w1/members/u1');
	});

	it('leaves an unmatched placeholder untouched', async () => {
		expect(await urlFor('/v1/a/{missing}/b', {})).toBe(
			'https://api.example.com/v1/a/{missing}/b',
		);
	});

	it('encodes substituted values', async () => {
		expect(await urlFor('/v1/e/{id}', { id: 'a/b c' })).toBe(
			'https://api.example.com/v1/e/a/b%20c',
		);
	});

	it('substitutes {api-version}', async () => {
		expect(await urlFor('/{api-version}/ping')).toBe(
			'https://api.example.com/1.0.0/ping',
		);
	});

	it('handles many unclosed braces in linear time', async () => {
		// The lazy-quantifier form took ~20s here; the guarded form is ~1ms.
		const hostile = '/v1/'.concat('{a'.repeat(200_000));

		const started = Date.now();
		await request(config, { method: 'GET', url: hostile });
		const elapsed = Date.now() - started;

		expect(elapsed).toBeLessThan(1000);
	}, 10_000);
});
