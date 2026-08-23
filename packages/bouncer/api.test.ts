import {
	BouncerEndpointInputSchemas,
	BouncerEndpointOutputSchemas,
} from './endpoints/types';
import { bouncer } from './index';

const realFetch = global.fetch;

describe('Bouncer API Unit Tests', () => {
	const TEST_KEY = 'IPksOzbwmeBGBUPAIc7r6zHn0Nj0qZsVkTsQuXPb';
	let calls: { url: string; init?: RequestInit }[] = [];

	beforeEach(() => {
		calls = [];
		global.fetch = realFetch;
	});

	afterEach(() => {
		global.fetch = realFetch;
	});

	function mockFetch(status = 200, body: unknown = {}) {
		global.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url, init });
			return {
				ok: status >= 200 && status < 300,
				status,
				statusText: status === 200 ? 'OK' : 'Error',
				url,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => body,
				text: async () => JSON.stringify(body),
			};
		}) as unknown as typeof global.fetch;
	}

	describe('email verification', () => {
		it('verifyEmail parses input and returns valid response', async () => {
			const mockResponse = {
				email: 'test@example.com',
				status: 'deliverable',
				reason: 'accepted_email',
				domain: {
					name: 'example.com',
					acceptAll: 'no',
					disposable: 'no',
					free: 'no',
				},
				account: { role: 'no', disabled: 'no', fullMailbox: 'no' },
				dns: { type: 'MX', record: 'mail.example.com' },
				provider: 'google.com',
				score: 100,
				toxic: 'unknown',
				toxicity: 0,
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { email: 'test@example.com', timeout: 10 };
			const parsedInput = BouncerEndpointInputSchemas.verifyEmail.parse(input);

			const ctx: any = {
				key: TEST_KEY,
				authType: 'api_key',
			};

			const result = await plugin.endpoints!.email.verifyEmail(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.verifyEmail.parse(result);

			expect(parsedOutput.email).toBe('test@example.com');
			expect(parsedOutput.status).toBe('deliverable');
			expect(parsedOutput.score).toBe(100);
			expect(parsedOutput.domain?.disposable).toBe('no');
		});

		it('verifyDomain parses domain query and returns domain health', async () => {
			const mockResponse = {
				domain: 'example.com',
				status: 'ok',
				acceptAll: 'no',
				disposable: 'no',
				free: 'no',
				dns: { type: 'MX', record: 'mail.example.com' },
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { domain: 'example.com' };
			const parsedInput = BouncerEndpointInputSchemas.verifyDomain.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.email.verifyDomain(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.verifyDomain.parse(result);

			expect(parsedOutput.domain).toBe('example.com');
			expect(parsedOutput.disposable).toBe('no');
		});

		it('createBatchRequest submits batch recipients array', async () => {
			const mockResponse = {
				batchId: 'batch-abc-123',
				status: 'queued',
				quantity: 2,
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = {
				recipients: [
					{ email: 'user1@example.com' },
					{ email: 'user2@example.com' },
				],
			};
			const parsedInput =
				BouncerEndpointInputSchemas.createBatchRequest.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.email.createBatchRequest(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.createBatchRequest.parse(result);

			expect(parsedOutput.batchId).toBe('batch-abc-123');
			expect(parsedOutput.status).toBe('queued');
		});

		it('getBatchResults retrieves processed batch data', async () => {
			const mockResponse = {
				batchId: 'batch-abc-123',
				status: 'completed',
				total: 2,
				results: [
					{ email: 'user1@example.com', status: 'deliverable' },
					{ email: 'user2@example.com', status: 'undeliverable' },
				],
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { batchId: 'batch-abc-123', download: 'all' as const };
			const parsedInput =
				BouncerEndpointInputSchemas.getBatchResults.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.email.getBatchResults(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.getBatchResults.parse(result);

			expect(parsedOutput.batchId).toBe('batch-abc-123');
			expect(parsedOutput.status).toBe('completed');
			expect(parsedOutput.results?.length).toBe(2);
		});

		it('finishBatch marks batch as completed early', async () => {
			const mockResponse = {
				batchId: 'batch-abc-123',
				status: 'finished',
				message: 'Batch marked as finished',
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { batchId: 'batch-abc-123' };
			const parsedInput = BouncerEndpointInputSchemas.finishBatch.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.email.finishBatch(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.finishBatch.parse(result);

			expect(parsedOutput.batchId).toBe('batch-abc-123');
			expect(parsedOutput.status).toBe('finished');
		});

		it('deleteBatchRequest deletes the batch request', async () => {
			const mockResponse = {
				batchId: 'batch-abc-123',
				deleted: true,
				message: 'Batch deleted',
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { batchId: 'batch-abc-123' };
			const parsedInput =
				BouncerEndpointInputSchemas.deleteBatchRequest.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.email.deleteBatchRequest(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.deleteBatchRequest.parse(result);

			expect(parsedOutput.deleted).toBe(true);
		});
	});

	describe('toxicity analysis', () => {
		it('createToxicityListJob submits toxicity list', async () => {
			const mockResponse = {
				jobId: 'tox-job-999',
				status: 'queued',
				total: 1,
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { emails: ['test@example.com'] };
			const parsedInput =
				BouncerEndpointInputSchemas.createToxicityListJob.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.toxicity.createToxicityListJob(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.createToxicityListJob.parse(result);

			expect(parsedOutput.jobId).toBe('tox-job-999');
			expect(parsedOutput.total).toBe(1);
		});

		it('checkToxicityListJobStatus polls job status', async () => {
			const mockResponse = {
				jobId: 'tox-job-999',
				status: 'completed',
				total: 1,
				processed: 1,
				results: [{ email: 'test@example.com', toxic: 'no' }],
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { jobId: 'tox-job-999' };
			const parsedInput =
				BouncerEndpointInputSchemas.checkToxicityListJobStatus.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result =
				await plugin.endpoints!.toxicity.checkToxicityListJobStatus(
					ctx,
					parsedInput,
				);
			const parsedOutput =
				BouncerEndpointOutputSchemas.checkToxicityListJobStatus.parse(result);

			expect(parsedOutput.jobId).toBe('tox-job-999');
			expect(parsedOutput.status).toBe('completed');
		});

		it('deleteToxicityListJob deletes toxicity job', async () => {
			const mockResponse = {
				jobId: 'tox-job-999',
				deleted: true,
			};

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const input = { jobId: 'tox-job-999' };
			const parsedInput =
				BouncerEndpointInputSchemas.deleteToxicityListJob.parse(input);

			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.toxicity.deleteToxicityListJob(
				ctx,
				parsedInput,
			);
			const parsedOutput =
				BouncerEndpointOutputSchemas.deleteToxicityListJob.parse(result);

			expect(parsedOutput.deleted).toBe(true);
		});
	});

	describe('account endpoints', () => {
		it('getCredits returns credit balance', async () => {
			const mockResponse = { credits: 100 };

			mockFetch(200, mockResponse);

			const plugin = bouncer({ key: TEST_KEY });
			const ctx: any = { key: TEST_KEY, authType: 'api_key' };
			const result = await plugin.endpoints!.account.getCredits(ctx, {});
			const parsedOutput =
				BouncerEndpointOutputSchemas.getCredits.parse(result);

			expect(parsedOutput.credits).toBe(100);
		});
	});
});
