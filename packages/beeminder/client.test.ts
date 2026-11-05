/**
 * Transport: auth query param, Bearer header, form POST, official base URL.
 * Credentials here are fictional.
 */
import { BEEMINDER_API_BASE, makeBeeminderRequest } from './client';

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
			body?: string;
	  }
	| undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeBeeminderRequest', () => {
	it('hits the documented www base', async () => {
		mockFetch({ username: 'alice' });
		await makeBeeminderRequest('users/me.json', 'tok');
		expect(
			captured?.url.startsWith(`${BEEMINDER_API_BASE}/users/me.json`),
		).toBe(true);
	});

	it('sends personal tokens as auth_token and Bearer', async () => {
		mockFetch({});
		await makeBeeminderRequest('users/me.json', 'personal-token');
		expect(captured?.url).toContain('auth_token=personal-token');
		expect(captured?.headers.authorization).toBe('Bearer personal-token');
	});

	it('sends OAuth tokens as access_token and Bearer', async () => {
		mockFetch({});
		await makeBeeminderRequest('users/me.json', 'oauth-token', {
			authParam: 'access_token',
		});
		expect(captured?.url).toContain('access_token=oauth-token');
		expect(captured?.url).not.toContain('auth_token=');
		expect(captured?.headers.authorization).toBe('Bearer oauth-token');
	});

	it('POSTs charges as form fields, not JSON', async () => {
		mockFetch({ id: 'c1', amount: 1 });
		await makeBeeminderRequest('charges.json', 'tok', {
			method: 'POST',
			body: { user_id: 'alice', amount: 1, dryrun: true },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain(
			'application/x-www-form-urlencoded',
		);
		expect(captured?.body).toContain('user_id=alice');
		expect(captured?.body).toContain('amount=1');
		expect(captured?.body).toContain('dryrun=true');
		expect(captured?.body?.startsWith('{')).toBe(false);
	});
});
