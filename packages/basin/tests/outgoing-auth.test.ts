/**
 * Guards the Authorization header Basin actually receives.
 *
 * `client.test.ts` mocks `corsair/http`'s `request` and asserts the
 * `OpenAPIConfig.HEADERS` handed to it. That checks intent, not effect: the
 * transport applies `config.TOKEN` *after* `config.HEADERS`, overwriting
 * Authorization with `Bearer <key>`. Basin answers Bearer with 401
 * invalid_token, so the plugin once failed every request while those tests
 * stayed green.
 *
 * These tests drive the real transport against a stubbed `fetch` and assert the
 * header on the wire, which is the only place that regression is visible.
 */
import { makeBasinRequest } from '../client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

function stubFetch(): { calls: Captured[]; restore: () => void } {
	const original = global.fetch;
	const calls: Captured[] = [];

	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		calls.push({
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
		});

		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({ projects: [] }),
			text: async () => JSON.stringify({ projects: [] }),
		};
	}) as typeof global.fetch;

	return {
		calls,
		restore: () => {
			global.fetch = original;
		},
	};
}

describe('Basin outgoing Authorization header', () => {
	let fetchStub: ReturnType<typeof stubFetch>;

	beforeEach(() => {
		fetchStub = stubFetch();
	});

	afterEach(() => {
		fetchStub.restore();
	});

	const headerOf = () => fetchStub.calls[0]?.headers.authorization;

	it('sends the Token scheme Basin requires', async () => {
		await makeBasinRequest('projects', 'test-key', { method: 'GET' });

		expect(headerOf()).toBe('Token test-key');
	});

	// The regression that made every call 401.
	it('never sends a Bearer scheme', async () => {
		await makeBasinRequest('projects', 'test-key', { method: 'GET' });

		expect(headerOf()).not.toMatch(/^Bearer /);
	});

	it('does not double-prefix a key that already carries its scheme', async () => {
		await makeBasinRequest('projects', 'Token already-prefixed', {
			method: 'GET',
		});

		expect(headerOf()).toBe('Token already-prefixed');
	});

	// A credential stored as "Bearer <key>" would otherwise be sent verbatim and
	// 401 on every call, since Basin rejects the Bearer scheme outright.
	it('rewrites a Bearer-prefixed key to the Token scheme on the wire', async () => {
		await makeBasinRequest('projects', 'Bearer pasted-with-prefix', {
			method: 'GET',
		});

		expect(headerOf()).toBe('Token pasted-with-prefix');
	});

	it('is case-insensitive about the prefix it strips', async () => {
		await makeBasinRequest('projects', 'bearer lowercase-prefix', {
			method: 'GET',
		});

		expect(headerOf()).toBe('Token lowercase-prefix');
	});

	it('keeps the scheme on write requests too', async () => {
		await makeBasinRequest('projects', 'test-key', {
			method: 'POST',
			body: { name: 'x' },
		});

		expect(fetchStub.calls[0]?.method).toBe('POST');
		expect(headerOf()).toBe('Token test-key');
	});

	it('targets the documented v1 base URL', async () => {
		await makeBasinRequest('projects', 'test-key', { method: 'GET' });

		expect(fetchStub.calls[0]?.url).toBe(
			'https://usebasin.com/api/v1/projects',
		);
	});
});
