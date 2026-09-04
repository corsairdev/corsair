import { request } from 'corsair/http';
import * as misc from './endpoints/misc';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('griptape misc endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('connection.list sends GET /connections with pagination and type', async () => {
		const payload = { connections: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.listConnections(ctx, {
			page: 1,
			page_size: 10,
			type: 'github',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'connections' }),
		);
		expect(result).toEqual(payload);
	});

	it('exportJob.list sends GET /export-jobs', async () => {
		const payload = { export_jobs: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.listExportJobs(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'export-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('exportJob.create sends POST /export-jobs', async () => {
		const payload = { export_job_id: 'export-test-001', status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.createExportJob(ctx, {
			body: { resource: 'threads' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'export-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('exportJob.get sends GET /export-jobs/{export_job_id}', async () => {
		const payload = { export_job_id: 'export-test-001', status: 'completed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.getExportJob(ctx, {
			export_job_id: 'export-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'export-jobs/export-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('importJob.list sends GET /import-jobs', async () => {
		const payload = { import_jobs: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.listImportJobs(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'import-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('importJob.create sends POST /import-jobs', async () => {
		const payload = { import_job_id: 'import-test-001', status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.createImportJob(ctx, {
			body: { resource: 'threads' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'import-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('importJob.get sends GET /import-jobs/{import_job_id}', async () => {
		const payload = { import_job_id: 'import-test-001', status: 'completed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.getImportJob(ctx, {
			import_job_id: 'import-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'import-jobs/import-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates connectionList input with a type filter', () => {
		const parsed = GriptapeEndpointInputSchemas.connectionList.safeParse({
			page: 1,
			page_size: 10,
			type: 'github',
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects exportJobGet input with an empty id', () => {
		const parsed = GriptapeEndpointInputSchemas.exportJobGet.safeParse({
			export_job_id: '',
		});

		expect(parsed.success).toBe(false);
	});
});
