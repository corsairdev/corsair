import { makeTpscheckRequest } from './client';
import type {
	BatchResponse,
	CheckResponse,
	CreditsResponse,
	StatusResponse,
} from './endpoints/types';
import {
	BatchResponseSchema,
	CheckResponseSchema,
	CreditsResponseSchema,
	StatusResponseSchema,
} from './endpoints/types';
import { tpscheck, tpscheckEndpointSchemas } from './index';

describe('tpscheck plugin shape', () => {
	it('exposes check.post, batch.post, credits.get and status.get', () => {
		const plugin = tpscheck({});

		expect(plugin.endpoints?.check.post).toBeDefined();
		expect(plugin.endpoints?.batch.post).toBeDefined();
		expect(plugin.endpoints?.credits.get).toBeDefined();
		expect(plugin.endpoints?.status.get).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = tpscheck({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		expect(tpscheckEndpointSchemas['check.post']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['check.post']?.output).toBeDefined();
		expect(tpscheckEndpointSchemas['batch.post']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['batch.post']?.output).toBeDefined();
		expect(tpscheckEndpointSchemas['credits.get']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['credits.get']?.output).toBeDefined();
		expect(tpscheckEndpointSchemas['status.get']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['status.get']?.output).toBeDefined();
	});
});

// Note: keyBuilder has no unit tests here. Its public type accepts only a
// `never` context (a framework typing limitation shared by every plugin),
// so calling it directly requires a type assertion. Auth behaviour is
// covered instead by the Authorization-header tests in client.test.ts.

// Live tests run only when TPSCHECK_API_KEY is set, so CI stays hermetic
// without credentials. Per the docs, /status and /credits are free while
// /check and /batch consume one credit per number.
const LIVE_KEY = process.env.TPSCHECK_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('tpscheck live API (env-gated)', () => {
	it('GET /status is public and returns the version payload', async () => {
		const res = await makeTpscheckRequest<StatusResponse>(
			'/status',
			undefined,
			{ method: 'GET' },
		);

		const parsed = StatusResponseSchema.parse(res);
		expect(parsed.status).toBe('ok');
		expect(typeof parsed.version).toBe('string');
	});

	it('GET /credits returns usage for the live key', async () => {
		const res = await makeTpscheckRequest<CreditsResponse>(
			'/credits',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = CreditsResponseSchema.parse(res);
		expect(typeof parsed.requests_used).toBe('number');
		expect(typeof parsed.requests_remaining).toBe('number');
		expect(typeof parsed.monthly_limit).toBe('number');
		expect(typeof parsed.plan).toBe('string');
	});

	it('POST /check verifies a single number', async () => {
		const res = await makeTpscheckRequest<CheckResponse>('/check', LIVE_KEY, {
			method: 'POST',
			body: { phone: '01829 830730' },
			query: { version: '2' },
		});

		const parsed = CheckResponseSchema.parse(res);
		expect(typeof parsed.valid).toBe('boolean');
		expect(typeof parsed.input).toBe('string');
	});

	it('POST /batch verifies multiple numbers', async () => {
		const res = await makeTpscheckRequest<BatchResponse>('/batch', LIVE_KEY, {
			method: 'POST',
			body: { phones: ['01564 331484', '01953 498974'] },
			query: { version: '2' },
		});

		const parsed = BatchResponseSchema.parse(res);
		expect(parsed.results.length).toBe(2);
		for (const result of parsed.results) {
			expect(typeof result.valid).toBe('boolean');
		}
	});
});
