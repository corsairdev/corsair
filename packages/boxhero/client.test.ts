/**
 * Transport: Bearer token, official host, `/v1` paths.
 * Credentials here are fictional.
 */

import { z } from 'zod';
import { BOXHERO_API_BASE, makeBoxheroRequest } from './client';

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
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

describe('makeBoxheroRequest', () => {
	it('hits the documented host with Bearer auth', async () => {
		mockFetch({
			id: 1,
			name: 'g',
			mode: 2,
			currency_symbol: '$',
			currency_code: 'USD',
			price_decimal_places: 2,
			memo: null,
		});
		await makeBoxheroRequest('/v1/teams/linked', 'tok', {
			schema: z.object({
				id: z.number(),
				name: z.string(),
				mode: z.number(),
				currency_symbol: z.string().nullable(),
				currency_code: z.string().nullable(),
				price_decimal_places: z.number(),
				memo: z.string().nullable(),
			}),
		});
		expect(captured?.url).toBe(`${BOXHERO_API_BASE}/v1/teams/linked`);
		expect(captured?.headers.authorization).toBe('Bearer tok');
	});
});
