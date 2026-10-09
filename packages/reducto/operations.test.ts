import { logEventFromContext } from 'corsair/core';
import { makeReductoRequest } from './client';
import {
	Account,
	Classify,
	Edit,
	Extract,
	Files,
	Jobs,
	Parse,
	Pipeline,
	Split,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

jest.mock('./client', () => {
	// jest.requireActual is typed as any. The module's own type is the real export.
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makeReductoRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeReductoRequest);
const mockLog = jest.mocked(logEventFromContext);

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext() {
	return {
		key: 'test-key',
		options: { baseUrl: 'https://platform.reducto.ai' },
		db: {
			jobs: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(true),
			},
		},
	};
}

const document = 'https://cdn.reducto.ai/samples/fidelity-example.pdf';

const parseResponse = {
	job_id: 'job-1',
	duration: 1.2,
	usage: { num_pages: 2, credits: 2 },
	result: {
		type: 'full' as const,
		chunks: [{ content: 'Hello', embed: 'Hello' }],
	},
};

describe('Reducto endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('parse.parse posts /parse and caches the job', async () => {
		mockRequest.mockResolvedValue(parseResponse);
		const ctx = createContext();

		const result = await (Parse.parse as AnyEndpoint)(ctx, { input: document });

		expect(result).toMatchObject({ job_id: 'job-1' });
		expect(mockRequest).toHaveBeenCalledWith('/parse', 'test-key', {
			method: 'POST',
			body: { input: document },
			baseUrl: 'https://platform.reducto.ai',
		});
		expect(ctx.db.jobs.upsertByEntityId).toHaveBeenCalledWith(
			'job-1',
			expect.objectContaining({ jobId: 'job-1' }),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'reducto.parse.parse',
			{ jobId: 'job-1', pages: 2 },
			'completed',
		);
	});

	it('parse.parseAsync posts /parse_async', async () => {
		mockRequest.mockResolvedValue({ job_id: 'job-2' });
		await (Parse.parseAsync as AnyEndpoint)(createContext(), {
			input: document,
			queue_priority: 'batch',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/parse_async',
			'test-key',
			expect.objectContaining({
				method: 'POST',
				body: { input: document, queue_priority: 'batch' },
			}),
		);
	});

	it('extract.extract posts /extract', async () => {
		mockRequest.mockResolvedValue({
			usage: { num_pages: 1, num_fields: 1 },
			result: [{ total: 10 }],
			job_id: 'job-3',
		});
		await (Extract.extract as AnyEndpoint)(createContext(), {
			input: document,
			instructions: { schema: { type: 'object' } },
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/extract');
		expect(mockRequest.mock.calls[0]?.[2]).toMatchObject({ method: 'POST' });
	});

	it('extract.extractAsync posts /extract_async', async () => {
		mockRequest.mockResolvedValue({ job_id: 'job-4' });
		await (Extract.extractAsync as AnyEndpoint)(createContext(), {
			input: document,
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/extract_async');
	});

	it('split.split posts /split', async () => {
		mockRequest.mockResolvedValue({
			usage: { num_pages: 1 },
			result: { splits: [{ name: 'Summary', pages: [1] }] },
			job_id: 'job-5',
		});
		await (Split.split as AnyEndpoint)(createContext(), {
			input: document,
			split_description: [{ name: 'Summary', description: 'Opening section' }],
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/split');
	});

	it('split.splitAsync posts /split_async', async () => {
		mockRequest.mockResolvedValue({ job_id: 'job-6' });
		await (Split.splitAsync as AnyEndpoint)(createContext(), {
			input: document,
			split_description: [{ name: 'Summary', description: 'Opening section' }],
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/split_async');
	});

	it('edit.edit posts /edit with document_url', async () => {
		mockRequest.mockResolvedValue({
			document_url: 'https://storage.example/filled.pdf',
			job_id: 'job-7',
		});
		await (Edit.edit as AnyEndpoint)(createContext(), {
			document_url: document,
			edit_instructions: 'Fill Name: Ada',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/edit',
			'test-key',
			expect.objectContaining({
				body: {
					document_url: document,
					edit_instructions: 'Fill Name: Ada',
				},
			}),
		);
	});

	it('edit.editAsync posts /edit_async', async () => {
		mockRequest.mockResolvedValue({ job_id: 'job-8' });
		await (Edit.editAsync as AnyEndpoint)(createContext(), {
			document_url: document,
			edit_instructions: 'Fill Name: Ada',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/edit_async');
	});

	it('classify.classify posts /classify', async () => {
		mockRequest.mockResolvedValue({
			job_id: 'job-9',
			result: { category: 'invoice' },
		});
		await (Classify.classify as AnyEndpoint)(createContext(), {
			input: document,
			classification_schema: [
				{ category: 'invoice', criteria: ['amount due'] },
			],
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/classify');
	});

	it('classify.classifyAsync posts /classify_async', async () => {
		mockRequest.mockResolvedValue({ job_id: 'job-10' });
		await (Classify.classifyAsync as AnyEndpoint)(createContext(), {
			input: document,
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/classify_async');
	});

	it('pipeline.run posts /pipeline', async () => {
		mockRequest.mockResolvedValue({
			job_id: 'job-11',
			usage: { num_pages: 1 },
			result: { ok: true },
		});
		await (Pipeline.run as AnyEndpoint)(createContext(), {
			input: document,
			pipeline_id: 'pipe-1',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/pipeline');
	});

	it('pipeline.runAsync posts /pipeline_async', async () => {
		mockRequest.mockResolvedValue({ job_id: 'job-12' });
		await (Pipeline.runAsync as AnyEndpoint)(createContext(), {
			input: document,
			pipeline_id: 'pipe-1',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/pipeline_async');
	});

	it('jobs.get reads /job/{job_id} and caches the path id', async () => {
		mockRequest.mockResolvedValue({ status: 'Completed', result: null });
		const ctx = createContext();
		await (Jobs.get as AnyEndpoint)(ctx, { job_id: 'job-1' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/job/{job_id}',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				path: { job_id: 'job-1' },
			}),
		);
		expect(ctx.db.jobs.upsertByEntityId).toHaveBeenCalledWith(
			'job-1',
			expect.objectContaining({ jobId: 'job-1', status: 'Completed' }),
		);
	});

	it('jobs.list reads /jobs with the cursor and limit', async () => {
		mockRequest.mockResolvedValue({
			jobs: [
				{
					job_id: 'job-1',
					status: 'Completed',
					type: 'Parse',
					created_at: '2026-01-01T00:00:00Z',
					num_pages: 1,
					total_pages: 1,
					duration: 0.4,
				},
			],
			next_cursor: 'next',
		});
		const ctx = createContext();
		await (Jobs.list as AnyEndpoint)(ctx, {
			limit: 1,
			cursor: 'prev',
			exclude_configs: true,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/jobs',
			'test-key',
			expect.objectContaining({
				query: { exclude_configs: true, cursor: 'prev', limit: 1 },
			}),
		);
		expect(ctx.db.jobs.upsertByEntityId).toHaveBeenCalledWith(
			'job-1',
			expect.objectContaining({ status: 'Completed', type: 'Parse' }),
		);
	});

	it('jobs.cancel posts /cancel/{job_id} and keeps earlier cache fields', async () => {
		mockRequest.mockResolvedValue({});
		const ctx = createContext();
		ctx.db.jobs.findByEntityId.mockResolvedValue({
			data: { jobId: 'job-1', type: 'Parse', numPages: 4 },
		});
		await (Jobs.cancel as AnyEndpoint)(ctx, { job_id: 'job-1' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/cancel/{job_id}');
		expect(ctx.db.jobs.upsertByEntityId).toHaveBeenCalledWith(
			'job-1',
			expect.objectContaining({
				status: 'Cancelled',
				type: 'Parse',
				numPages: 4,
			}),
		);
	});

	it('jobs.delete sends DELETE /job/{job_id}', async () => {
		mockRequest.mockResolvedValue({ job_id: 'echoed-other' });
		const ctx = createContext();
		const result = await (Jobs.remove as AnyEndpoint)(ctx, {
			job_id: 'job-1',
			include_persisted: true,
		});
		expect(result).toMatchObject({ job_id: 'echoed-other' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/job/{job_id}',
			'test-key',
			expect.objectContaining({
				method: 'DELETE',
				query: { include_persisted: true },
			}),
		);
		expect(ctx.db.jobs.deleteByEntityId).toHaveBeenCalledWith('job-1');
		expect(ctx.db.jobs.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('files.upload posts multipart /upload and does not log the file', async () => {
		mockRequest.mockResolvedValue({ file_id: 'reducto://file-1' });
		const file = new Blob(['hello'], { type: 'text/plain' });
		await (Files.upload as AnyEndpoint)(createContext(), {
			file,
			extension: 'txt',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/upload',
			'test-key',
			expect.objectContaining({
				method: 'POST',
				formData: { file },
				query: { extension: 'txt' },
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'reducto.files.upload',
			{ fileId: 'reducto://file-1', extension: 'txt' },
			'completed',
		);
	});

	it('files.delete sends DELETE /upload/{file_id}', async () => {
		mockRequest.mockResolvedValue({ file_id: 'reducto://file-1' });
		await (Files.remove as AnyEndpoint)(createContext(), {
			file_id: 'reducto://file-1',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/upload/{file_id}',
			'test-key',
			expect.objectContaining({
				method: 'DELETE',
				path: { file_id: 'reducto://file-1' },
			}),
		);
	});

	it('account.version reads /version', async () => {
		mockRequest.mockResolvedValue('1.0.0');
		const result = await (Account.version as AnyEndpoint)(createContext(), {});
		expect(result).toBe('1.0.0');
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/version');
	});

	it('account.configureWebhook posts /configure_webhook and does not log the url', async () => {
		mockRequest.mockResolvedValue('https://portal.example/secret');
		await (Account.configureWebhook as AnyEndpoint)(createContext(), {});
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/configure_webhook');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'reducto.account.configureWebhook',
			{ configured: true },
			'completed',
		);
	});
});
