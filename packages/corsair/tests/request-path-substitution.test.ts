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

/** URLs passed to `fetch`, newest run first cleared in `beforeEach`. */
let requested: string[] = [];

/**
 * Minimal `fetch` stub.
 *
 * It implements only the members `request()` reads on the happy path — `ok`,
 * `status`, `statusText`, `url`, `headers` and `json()` — so the object is cast
 * to `Response` rather than satisfying the full DOM interface, which would mean
 * stubbing a dozen members these tests never touch. The cast is narrowed to
 * this stub and does not leak past `beforeEach`.
 */
beforeEach(() => {
	requested = [];
	const fetchStub: typeof fetch = async (input) => {
		requested.push(String(input));
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(input),
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => ({}),
			text: async () => '',
		} as Response;
	};
	global.fetch = jest.fn(fetchStub);
});

/**
 * Runs one request and returns the URL `fetch` received.
 *
 * `path` mirrors `ApiRequestOptions['path']`, whose values are unconstrained by
 * design — `getUrl` stringifies whatever it is handed — so the record is typed
 * as `unknown` values rather than narrowed to `string`.
 */
async function urlFor(
	url: string,
	path?: Record<string, unknown>,
): Promise<string | undefined> {
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

	it('leaves an empty placeholder alone when no such key exists', async () => {
		expect(await urlFor('/v1/u/{}', { user_id: 'u1' })).toBe(
			'https://api.example.com/v1/u/{}',
		);
	});

	it('leaves a lone opening brace untouched', async () => {
		expect(await urlFor('/v1/u/{a', { a: 'x' })).toBe(
			'https://api.example.com/v1/u/{a',
		);
	});

	it('substitutes the inner token of a nested brace expression', async () => {
		// The only input shape where this differs from the previous lazy
		// quantifier: on `{a{b}c}` the lazy form captured `a{b` while this one
		// captures `b`. Endpoint path templates are authored in-repo and no
		// plugin nests braces, so no supported template is affected — but the
		// behaviour is pinned here rather than left implicit.
		expect(await urlFor('/v1/u/{a{b}c}', { b: 'inner' })).toBe(
			'https://api.example.com/v1/u/{ainnerc}',
		);
	});

	it('handles many unclosed braces in linear time', async () => {
		const hostile = '/v1/'.concat('{a'.repeat(200_000));

		const started = Date.now();
		await request(config, { method: 'GET', url: hostile });
		const elapsed = Date.now() - started;

		// Measured on this input: the lazy-quantifier form takes ~22,000ms, the
		// guarded form ~1ms. The budget below sits between the two with room on
		// both sides — a false failure needs the guarded form to run thousands
		// of times slower than measured, and a false pass needs the quadratic
		// form to run several times faster. The `jest` timeout is the backstop:
		// the vulnerable form blows through it regardless of this assertion.
		const LINEAR_TIME_BUDGET_MS = 5_000;
		expect(elapsed).toBeLessThan(LINEAR_TIME_BUDGET_MS);
	}, 10_000);
});
