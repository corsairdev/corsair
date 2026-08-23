/**
 * Unit coverage for every Bouncer operation.
 *
 * These tests assert the *request* the plugin builds — method, URL, query and
 * body — against the paths published at https://docs.usebouncer.com, and parse
 * each mocked response with the endpoint's declared output schema. Response
 * fixtures are copied from real API responses, so a schema that drifts from
 * the wire format fails here.
 */
import { BOUNCER_API_BASE } from './client';
import {
	BouncerEndpointInputSchemas as Inputs,
	BouncerEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { bouncer } from './index';

const realFetch = global.fetch;
const TEST_KEY = 'test-api-key';

/** A real `EmailRecord`, captured from GET /v1.1/email/verify. */
const EMAIL_RECORD = {
	email: 'john@usebouncer.com',
	status: 'undeliverable',
	reason: 'rejected_email',
	domain: {
		name: 'usebouncer.com',
		acceptAll: 'no',
		disposable: 'no',
		free: 'no',
	},
	account: { role: 'no', disabled: 'no', fullMailbox: 'no' },
	dns: { type: 'MX', record: 'aspmx.l.google.com.' },
	provider: 'google.com',
	score: 0,
	toxic: 'unknown',
	toxicity: 0,
};

describe('Bouncer API', () => {
	let calls: { url: string; init?: RequestInit }[] = [];

	beforeEach(() => {
		calls = [];
	});

	afterEach(() => {
		global.fetch = realFetch;
	});

	function mockFetch(body: unknown = {}, status = 200) {
		global.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url, init });
			return {
				ok: status >= 200 && status < 300,
				status,
				statusText: status === 200 ? 'OK' : 'Error',
				url,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => body,
				text: async () => (body === undefined ? '' : JSON.stringify(body)),
			};
		}) as unknown as typeof global.fetch;
	}

	const plugin = bouncer({ key: TEST_KEY });
	const ctx = { key: TEST_KEY, authType: 'api_key' } as never;

	/** The single request the last call made. */
	function onlyCall() {
		expect(calls).toHaveLength(1);
		const call = calls[0];
		if (!call) throw new Error('no request recorded');
		return {
			url: new URL(call.url),
			method: call.init?.method,
			init: call.init,
		};
	}

	function bodyOf(init?: RequestInit) {
		return JSON.parse(init?.body as string);
	}

	describe('authentication', () => {
		it('sends the key as x-api-key and never as a bearer token', async () => {
			mockFetch({ credits: 100 });
			await plugin.endpoints!.account.getCredits(ctx, {});

			const headers = new Headers(onlyCall().init?.headers);
			expect(headers.get('x-api-key')).toBe(TEST_KEY);
			expect(headers.get('authorization')).toBeNull();
		});
	});

	describe('email', () => {
		it('verifyEmail GETs /v1.1/email/verify with email and timeout', async () => {
			mockFetch(EMAIL_RECORD);
			const input = Inputs.verifyEmail.parse({
				email: 'john@usebouncer.com',
				timeout: 20,
			});

			const result = await plugin.endpoints!.email.verifyEmail(ctx, input);

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/email/verify`,
			);
			expect(url.searchParams.get('email')).toBe('john@usebouncer.com');
			expect(url.searchParams.get('timeout')).toBe('20');

			const parsed = Outputs.verifyEmail.parse(result);
			expect(parsed.status).toBe('undeliverable');
			expect(parsed.domain?.acceptAll).toBe('no');
		});

		it('verifyEmail omits timeout when it was not supplied', async () => {
			mockFetch(EMAIL_RECORD);
			const input = Inputs.verifyEmail.parse({ email: 'john@usebouncer.com' });

			await plugin.endpoints!.email.verifyEmail(ctx, input);

			expect(onlyCall().url.searchParams.has('timeout')).toBe(false);
		});

		it('verifyEmail rejects a timeout above the documented maximum', () => {
			expect(() =>
				Inputs.verifyEmail.parse({ email: 'a@b.com', timeout: 31 }),
			).toThrow();
		});

		it('verifyEmail accepts a greylisted result carrying retryAfter', async () => {
			mockFetch({
				email: 'john@usebouncer.com',
				status: 'unknown',
				reason: 'timeout',
				retryAfter: '2022-11-24T09:55:09.029Z',
			});
			const input = Inputs.verifyEmail.parse({ email: 'john@usebouncer.com' });

			const result = await plugin.endpoints!.email.verifyEmail(ctx, input);

			expect(Outputs.verifyEmail.parse(result).retryAfter).toBe(
				'2022-11-24T09:55:09.029Z',
			);
		});

		it('verifyDomain GETs /v1.1/domain, not /domain/verify', async () => {
			mockFetch({
				domain: {
					name: 'usebouncer.com',
					acceptAll: 'no',
					disposable: 'no',
					free: 'no',
				},
				dns: { type: 'MX', record: 'aspmx.l.google.com.' },
				provider: 'google.com',
				toxic: 'unknown',
			});
			const input = Inputs.verifyDomain.parse({ domain: 'usebouncer.com' });

			const result = await plugin.endpoints!.email.verifyDomain(ctx, input);

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(`${BOUNCER_API_BASE}/v1.1/domain`);
			expect(url.searchParams.get('domain')).toBe('usebouncer.com');

			const parsed = Outputs.verifyDomain.parse(result);
			expect(parsed.domain?.name).toBe('usebouncer.com');
			expect(parsed.domain?.disposable).toBe('no');
		});

		it('createBatchRequest POSTs an object array and sends callback as a query param', async () => {
			mockFetch({
				batchId: '6a8b0c829d61cb5fa895b0fd',
				created: '2026-08-23T15:06:42.682Z',
				status: 'queued',
				quantity: 2,
				duplicates: 0,
			});
			const input = Inputs.createBatchRequest.parse({
				recipients: ['john@usebouncer.com', { email: 'jenny@usebouncer.com' }],
				callback: 'https://example.com/hook',
			});

			const result = await plugin.endpoints!.email.createBatchRequest(
				ctx,
				input,
			);

			const { url, method, init } = onlyCall();
			expect(method).toBe('POST');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/email/verify/batch`,
			);
			expect(url.searchParams.get('callback')).toBe('https://example.com/hook');
			// Bouncer rejects bare strings, so the shorthand must be expanded.
			expect(bodyOf(init)).toEqual([
				{ email: 'john@usebouncer.com' },
				{ email: 'jenny@usebouncer.com' },
			]);

			expect(Outputs.createBatchRequest.parse(result).batchId).toBe(
				'6a8b0c829d61cb5fa895b0fd',
			);
		});

		it('createBatchRequest omits callback when it was not supplied', async () => {
			mockFetch({ batchId: 'b1', status: 'queued' });
			const input = Inputs.createBatchRequest.parse({
				recipients: [{ email: 'a@b.com' }],
			});

			await plugin.endpoints!.email.createBatchRequest(ctx, input);

			expect(onlyCall().url.searchParams.has('callback')).toBe(false);
		});

		it('getBatchStatus GETs the batch and forwards with-stats', async () => {
			mockFetch({
				batchId: 'b1',
				created: '2026-08-23T15:06:42.682Z',
				started: '2026-08-23T15:06:44.111Z',
				completed: '2026-08-23T15:06:55.023Z',
				status: 'completed',
				quantity: 2,
				duplicates: 0,
				credits: 2,
				processed: 2,
				stats: { deliverable: 0, risky: 0, undeliverable: 2, unknown: 0 },
			});
			const input = Inputs.getBatchStatus.parse({
				batchId: 'b1',
				withStats: true,
			});

			const result = await plugin.endpoints!.email.getBatchStatus(ctx, input);

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/email/verify/batch/b1`,
			);
			expect(url.searchParams.get('with-stats')).toBe('true');

			const parsed = Outputs.getBatchStatus.parse(result);
			expect(parsed.status).toBe('completed');
			expect(parsed.stats?.undeliverable).toBe(2);
		});

		it('getBatchResults GETs /download and parses a bare array', async () => {
			mockFetch([
				EMAIL_RECORD,
				{ ...EMAIL_RECORD, email: 'jenny@usebouncer.com' },
			]);
			const input = Inputs.getBatchResults.parse({
				batchId: 'b1',
				download: 'all',
			});

			const result = await plugin.endpoints!.email.getBatchResults(ctx, input);

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/email/verify/batch/b1/download`,
			);
			expect(url.searchParams.get('download')).toBe('all');

			const parsed = Outputs.getBatchResults.parse(result);
			expect(Array.isArray(parsed)).toBe(true);
			expect(parsed).toHaveLength(2);
			expect(parsed[0]?.email).toBe('john@usebouncer.com');
		});

		it('getBatchResults rejects an undocumented download filter', () => {
			expect(() =>
				Inputs.getBatchResults.parse({ batchId: 'b1', download: 'toxic' }),
			).toThrow();
		});

		it('finishBatch POSTs to /finish', async () => {
			mockFetch({});
			const input = Inputs.finishBatch.parse({ batchId: 'b1' });

			const result = await plugin.endpoints!.email.finishBatch(ctx, input);

			const { url, method } = onlyCall();
			expect(method).toBe('POST');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/email/verify/batch/b1/finish`,
			);
			expect(Outputs.finishBatch.parse(result)).toEqual({});
		});

		it('deleteBatchRequest DELETEs the batch', async () => {
			mockFetch({});
			const input = Inputs.deleteBatchRequest.parse({ batchId: 'b1' });

			const result = await plugin.endpoints!.email.deleteBatchRequest(
				ctx,
				input,
			);

			const { url, method } = onlyCall();
			expect(method).toBe('DELETE');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/email/verify/batch/b1`,
			);
			expect(Outputs.deleteBatchRequest.parse(result)).toEqual({});
		});

		it('reports an empty delete body as {} rather than undefined', async () => {
			// Bouncer really answers DELETE with `content-length: 0`.
			mockFetch(undefined);
			const input = Inputs.deleteBatchRequest.parse({ batchId: 'b1' });

			const result = await plugin.endpoints!.email.deleteBatchRequest(
				ctx,
				input,
			);

			expect(result).toEqual({});
			expect(Outputs.deleteBatchRequest.parse(result)).toEqual({});
		});

		it('reports an empty finish body as {} rather than undefined', async () => {
			mockFetch(undefined);
			const input = Inputs.finishBatch.parse({ batchId: 'b1' });

			const result = await plugin.endpoints!.email.finishBatch(ctx, input);

			expect(result).toEqual({});
		});

		it('percent-encodes a batch id with path-significant characters', async () => {
			mockFetch({});
			const input = Inputs.deleteBatchRequest.parse({ batchId: 'a/b?c' });

			await plugin.endpoints!.email.deleteBatchRequest(ctx, input);

			expect(onlyCall().url.pathname).toBe(
				'/v1.1/email/verify/batch/a%2Fb%3Fc',
			);
		});
	});

	describe('toxicity', () => {
		it('createToxicityListJob POSTs a bare string array to /v1/toxicity/list', async () => {
			mockFetch({
				id: '6a8b0c736133cb6a8e31e5f9',
				createdAt: '2026-08-23T15:06:27.985Z',
				status: 'processing',
			});
			const input = Inputs.createToxicityListJob.parse({
				emails: ['jane@usebouncer.com', 'john@usebouncer.com'],
			});

			const result = await plugin.endpoints!.toxicity.createToxicityListJob(
				ctx,
				input,
			);

			const { url, method, init } = onlyCall();
			expect(method).toBe('POST');
			// The toxicity surface is v1, not v1.1.
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1/toxicity/list`,
			);
			// Objects are rejected by the API here; strings must stay strings.
			expect(bodyOf(init)).toEqual([
				'jane@usebouncer.com',
				'john@usebouncer.com',
			]);

			const parsed = Outputs.createToxicityListJob.parse(result);
			expect(parsed.id).toBe('6a8b0c736133cb6a8e31e5f9');
			expect(parsed.status).toBe('processing');
		});

		it('checkToxicityListJobStatus GETs /v1/toxicity/list/{id}', async () => {
			mockFetch({
				id: 'j1',
				createdAt: '2026-08-23T15:06:27.985Z',
				status: 'completed',
			});
			const input = Inputs.checkToxicityListJobStatus.parse({ jobId: 'j1' });

			const result =
				await plugin.endpoints!.toxicity.checkToxicityListJobStatus(ctx, input);

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1/toxicity/list/j1`,
			);
			expect(Outputs.checkToxicityListJobStatus.parse(result).status).toBe(
				'completed',
			);
		});

		it('getToxicityListResults GETs /data and parses a bare array', async () => {
			mockFetch([
				{ email: 'jane@usebouncer.com', toxicity: 0 },
				{ email: 'hello@usebouncer.com', toxicity: 1 },
			]);
			const input = Inputs.getToxicityListResults.parse({ jobId: 'j1' });

			const result = await plugin.endpoints!.toxicity.getToxicityListResults(
				ctx,
				input,
			);

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1/toxicity/list/j1/data`,
			);

			const parsed = Outputs.getToxicityListResults.parse(result);
			expect(parsed).toHaveLength(2);
			expect(parsed[1]?.toxicity).toBe(1);
		});

		it('reports an empty toxicity delete body as {}', async () => {
			mockFetch(undefined);
			const input = Inputs.deleteToxicityListJob.parse({ jobId: 'j1' });

			const result = await plugin.endpoints!.toxicity.deleteToxicityListJob(
				ctx,
				input,
			);

			expect(result).toEqual({});
		});

		it('deleteToxicityListJob DELETEs /v1/toxicity/list/{id}', async () => {
			mockFetch({});
			const input = Inputs.deleteToxicityListJob.parse({ jobId: 'j1' });

			const result = await plugin.endpoints!.toxicity.deleteToxicityListJob(
				ctx,
				input,
			);

			const { url, method } = onlyCall();
			expect(method).toBe('DELETE');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1/toxicity/list/j1`,
			);
			expect(Outputs.deleteToxicityListJob.parse(result)).toEqual({});
		});
	});

	describe('account', () => {
		it('getCredits GETs /v1.1/credits', async () => {
			mockFetch({ credits: 100 });

			const result = await plugin.endpoints!.account.getCredits(ctx, {});

			const { url, method } = onlyCall();
			expect(method).toBe('GET');
			expect(url.origin + url.pathname).toBe(
				`${BOUNCER_API_BASE}/v1.1/credits`,
			);
			expect(Outputs.getCredits.parse(result).credits).toBe(100);
		});
	});

	describe('keyBuilder', () => {
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		};
		type KeyBuilder = (c: unknown, s: string) => Promise<string>;

		it('prefers the configured key over the key manager', async () => {
			const configured = bouncer({ key: 'option-key' });
			await expect(
				(configured.keyBuilder as KeyBuilder)(keyCtx, 'endpoint'),
			).resolves.toBe('option-key');
		});

		it('falls back to the stored key', async () => {
			const unconfigured = bouncer({});
			await expect(
				(unconfigured.keyBuilder as KeyBuilder)(keyCtx, 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('returns an empty key for non-endpoint sources', async () => {
			const configured = bouncer({ key: 'option-key' });
			await expect(
				(configured.keyBuilder as KeyBuilder)(keyCtx, 'webhook'),
			).resolves.toBe('');
		});
	});

	describe('every registered operation', () => {
		it('has an input schema, an output schema and metadata', () => {
			const schemas = plugin.endpointSchemas as Record<
				string,
				{ input?: unknown; output?: unknown } | undefined
			>;
			const meta = plugin.endpointMeta as Record<
				string,
				{ description?: string } | undefined
			>;
			const registered = Object.entries(plugin.endpoints!).flatMap(
				([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`),
			);

			expect(registered).toHaveLength(12);
			for (const key of registered) {
				expect(schemas[key]?.input).toBeDefined();
				expect(schemas[key]?.output).toBeDefined();
				expect(meta[key]?.description).toBeTruthy();
			}
		});
	});
});
