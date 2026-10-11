import { makeReductoRequest, ReductoAPIError } from './client';
import {
	AsyncJobIdResponseSchema,
	ClassifyResponseSchema,
	DeleteUploadResponseSchema,
	EditInputSchema,
	ExtractResponseSchema,
	JobResponseSchema,
	ListJobsInputSchema,
	ListJobsResponseSchema,
	ParseInputSchema,
	ParseResponseSchema,
	SplitInputSchema,
	SplitResponseSchema,
	UploadResponseSchema,
	VersionResponseSchema,
} from './endpoints/types';
import { reducto } from './index';

const TEST_API_KEY = process.env.REDUCTO_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;
const SAMPLE = 'https://cdn.reducto.ai/samples/fidelity-example.pdf';

jest.mock('corsair/core', () => ({
	AuthMissingError: class AuthMissingError extends Error {},
}));

describe('Reducto input schemas', () => {
	it('accepts a document url for parse', () => {
		const parsed = ParseInputSchema.parse({
			input: 'https://cdn.reducto.ai/samples/fidelity-example.pdf',
			retrieval: { chunking: { chunk_mode: 'variable' } },
		});
		expect(parsed.input).toBe(
			'https://cdn.reducto.ai/samples/fidelity-example.pdf',
		);
	});

	it('rejects an empty split description', () => {
		expect(() =>
			SplitInputSchema.parse({
				input: 'https://example.com/a.pdf',
				split_description: [],
			}),
		).toThrow();
	});

	it('rejects a job list limit above 500', () => {
		expect(() => ListJobsInputSchema.parse({ limit: 501 })).toThrow();
	});

	it('keeps unknown parse settings instead of stripping them', () => {
		const parsed = ParseInputSchema.parse({
			input: 'reducto://file',
			settings: { future_flag: true },
		});
		expect(parsed.settings).toMatchObject({ future_flag: true });
	});

	it('requires edit_instructions', () => {
		expect(() =>
			EditInputSchema.parse({ document_url: 'https://example.com/form.pdf' }),
		).toThrow();
	});
});

describe('Reducto plugin', () => {
	it('registers every documented operation and no example webhook', () => {
		const plugin = reducto({ key: 'test-key' });
		expect(plugin.id).toBe('reducto');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.endpointSchemas).toBeDefined();
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			[
				'account.configureWebhook',
				'account.version',
				'classify.classify',
				'classify.classifyAsync',
				'edit.edit',
				'edit.editAsync',
				'extract.extract',
				'extract.extractAsync',
				'files.delete',
				'files.upload',
				'jobs.cancel',
				'jobs.delete',
				'jobs.get',
				'jobs.list',
				'parse.parse',
				'parse.parseAsync',
				'pipeline.run',
				'pipeline.runAsync',
				'split.split',
				'split.splitAsync',
			].sort(),
		);
	});

	it('uses a passed api key', async () => {
		const plugin = reducto({ key: 'local-key' });
		expect(plugin.keyBuilder).toBeDefined();
		const key = await plugin.keyBuilder!(
			// keyBuilder only reads authType and keys here. The rest of the
			// plugin context is not used, so the stub is not the full type.
			{
				authType: 'api_key',
				keys: { get_api_key: async () => null },
			} as never,
			'endpoint',
		);
		expect(key).toBe('local-key');
	});
});

describeIfApiKey('Reducto live API', () => {
	jest.setTimeout(180_000);

	it('version, jobs, parse, extract, split, classify, upload, and cancel match the docs', async () => {
		const version = VersionResponseSchema.parse(
			await makeReductoRequest('/version', TEST_API_KEY),
		);
		expect(version.length).toBeGreaterThan(0);

		const listed = ListJobsResponseSchema.parse(
			await makeReductoRequest('/jobs', TEST_API_KEY, {
				query: { limit: 1, exclude_configs: true },
			}),
		);
		expect(Array.isArray(listed.jobs)).toBe(true);

		const parsed = ParseResponseSchema.parse(
			await makeReductoRequest('/parse', TEST_API_KEY, {
				method: 'POST',
				body: { input: SAMPLE },
			}),
		);
		expect(parsed.usage.num_pages).toBeGreaterThan(0);
		expect(['full', 'url']).toContain(parsed.result.type);

		const job = JobResponseSchema.parse(
			await makeReductoRequest('/job/{job_id}', TEST_API_KEY, {
				path: { job_id: parsed.job_id },
			}),
		);
		expect(job.status).toBe('Completed');

		const extracted = ExtractResponseSchema.parse(
			await makeReductoRequest('/extract', TEST_API_KEY, {
				method: 'POST',
				body: {
					input: `jobid://${parsed.job_id}`,
					instructions: {
						schema: {
							type: 'object',
							properties: {
								title: { type: 'string', description: 'Document title' },
							},
						},
					},
				},
			}),
		);
		expect(extracted.usage.num_pages).toBeGreaterThan(0);

		const split = SplitResponseSchema.parse(
			await makeReductoRequest('/split', TEST_API_KEY, {
				method: 'POST',
				body: {
					input: `jobid://${parsed.job_id}`,
					split_description: [
						{
							name: 'Document',
							description: 'The whole document',
						},
					],
				},
			}),
		);
		expect(split.usage.num_pages).toBeGreaterThan(0);

		const classified = ClassifyResponseSchema.parse(
			await makeReductoRequest('/classify', TEST_API_KEY, {
				method: 'POST',
				body: {
					input: SAMPLE,
					classification_schema: [
						{
							category: 'statement',
							criteria: ['account', 'balance', 'transaction'],
						},
						{
							category: 'other',
							criteria: ['not a financial statement'],
						},
					],
				},
			}),
		);
		expect(classified.job_id.length).toBeGreaterThan(0);
	});

	it('uploads a file and deletes it', async () => {
		const file = new Blob(['hello'], { type: 'text/plain' });
		const uploaded = UploadResponseSchema.parse(
			await makeReductoRequest('/upload', TEST_API_KEY, {
				method: 'POST',
				formData: { file },
				query: { extension: 'txt' },
			}),
		);
		expect(uploaded.file_id.startsWith('reducto://')).toBe(true);

		// Free plans return 422 NOT_APPLICABLE. Growth and Enterprise delete the file.
		try {
			const deleted = DeleteUploadResponseSchema.parse(
				await makeReductoRequest('/upload/{file_id}', TEST_API_KEY, {
					method: 'DELETE',
					path: { file_id: uploaded.file_id },
				}),
			);
			expect(deleted.file_id).toBe(uploaded.file_id);
		} catch (error) {
			expect(error).toBeInstanceOf(ReductoAPIError);
			if (!(error instanceof ReductoAPIError)) return;
			expect(error.status).toBe(422);
			expect(error.message).toContain('NOT_APPLICABLE');
		}
	});

	it('starts a one-page parse and cancels it', async () => {
		const asyncJob = AsyncJobIdResponseSchema.parse(
			await makeReductoRequest('/parse_async', TEST_API_KEY, {
				method: 'POST',
				body: {
					input: SAMPLE,
					settings: { page_range: { start: 1, end: 1 } },
				},
			}),
		);
		expect(asyncJob.job_id.length).toBeGreaterThan(0);

		await makeReductoRequest('/cancel/{job_id}', TEST_API_KEY, {
			method: 'POST',
			path: { job_id: asyncJob.job_id },
		});
	});
});
