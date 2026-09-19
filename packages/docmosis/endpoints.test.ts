import { logEventFromContext } from 'corsair/core';
import { makeDocmosisRequest } from './client';
import { docmosis } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeDocmosisRequest: jest.fn(),
	};
});

const mockRequest = makeDocmosisRequest as jest.MockedFunction<
	typeof makeDocmosisRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

describe('Docmosis endpoints', () => {
	const plugin = docmosis({ key: 'test-key' });
	const endpoints = plugin.endpoints!;
	const ctx = { key: 'test-key', authType: 'api_key' } as never;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockClear();
	});

	it('environmentReady POSTs to environment/ready', async () => {
		mockRequest.mockResolvedValue({ succeeded: true });
		const result = await endpoints.admin.environmentReady(ctx, {});

		expect(result.succeeded).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith('environment/ready', 'test-key', {
			method: 'POST',
			formData: {},
		});
	});

	it('environmentSummary POSTs to environment/summary', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			accountEnvironmentSummary: { ready: true },
		});
		const result = await endpoints.admin.environmentSummary(ctx, {});

		expect(result.accountEnvironmentSummary?.ready).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith(
			'environment/summary',
			'test-key',
			{
				method: 'POST',
				formData: {},
			},
		);
	});

	it('ping and pingService GET /ping', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });
		await endpoints.admin.ping(ctx, {});
		await endpoints.admin.pingService(ctx, {});

		expect(mockRequest).toHaveBeenNthCalledWith(1, 'ping', 'test-key', {
			method: 'GET',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(2, 'ping', 'test-key', {
			method: 'GET',
		});
	});

	it('deleteImage supports multiple image names', async () => {
		mockRequest.mockResolvedValue({ succeeded: true });
		await endpoints.images.delete(ctx, {
			imageName: ['folder/a.png', 'folder/b.png'],
		});

		expect(mockRequest).toHaveBeenCalledWith('deleteImage', 'test-key', {
			method: 'POST',
			formData: { imageName: ['folder/a.png', 'folder/b.png'] },
		});
	});

	it('deleteTemplate supports single template shorthand', async () => {
		mockRequest.mockResolvedValue({ succeeded: true });
		await endpoints.templates.delete(ctx, {
			templateName: '/invoice.docx',
		});

		expect(mockRequest).toHaveBeenCalledWith('deleteTemplate', 'test-key', {
			method: 'POST',
			formData: { templateName: ['/invoice.docx'] },
		});
	});

	it('listImages maps includeSubFolders boolean to string', async () => {
		mockRequest.mockResolvedValue({ succeeded: true, imageList: [] });
		await endpoints.images.list(ctx, {
			folder: '/stock',
			includeSubFolders: true,
		});

		expect(mockRequest).toHaveBeenCalledWith('listImages', 'test-key', {
			method: 'POST',
			formData: { folder: '/stock', includeSubFolders: 'true' },
		});
	});

	it('listTemplates forwards pagination fields', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			nextPageToken: 'n2',
			templateList: [],
		});
		await endpoints.templates.list(ctx, {
			folder: '/contracts',
			paging: true,
			pageToken: 'n1',
			pageSize: 50,
			includeDetail: true,
			includeSubFolders: false,
		});

		expect(mockRequest).toHaveBeenCalledWith('listTemplates', 'test-key', {
			method: 'POST',
			formData: {
				includeDetail: 'true',
				folder: '/contracts',
				includeSubFolders: 'false',
				paging: 'true',
				pageToken: 'n1',
				pageSize: 50,
			},
		});
	});

	it('getImage and getTemplate request binary responses', async () => {
		mockRequest.mockResolvedValue(new ArrayBuffer(4));
		const image = await endpoints.images.get(ctx, {
			imageName: '/logo.png',
		});
		const template = await endpoints.templates.get(ctx, {
			templateName: '/template.docx',
		});

		expect(image).toBeInstanceOf(ArrayBuffer);
		expect(template).toBeInstanceOf(ArrayBuffer);
		expect(mockRequest).toHaveBeenNthCalledWith(1, 'getImage', 'test-key', {
			method: 'POST',
			formData: { imageName: ['/logo.png'] },
			responseType: 'arrayBuffer',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(2, 'getTemplate', 'test-key', {
			method: 'POST',
			formData: { templateName: ['/template.docx'] },
			responseType: 'arrayBuffer',
		});
	});

	it('templates.render forwards render options and requests binary response', async () => {
		mockRequest.mockResolvedValue(new ArrayBuffer(8));

		const result = await endpoints.templates.render(ctx, {
			templateName: '/invoice.docx',
			data: { invoiceId: 'inv_123', total: 199.5 },
			outputName: 'invoice.pdf',
			outputFormat: 'pdf',
			renderName: 'invoice-render',
			test: true,
			tag: 'billing',
		});

		expect(result).toBeInstanceOf(ArrayBuffer);
		expect(mockRequest).toHaveBeenCalledWith('render', 'test-key', {
			method: 'POST',
			formData: {
				templateName: '/invoice.docx',
				data: JSON.stringify({ invoiceId: 'inv_123', total: 199.5 }),
				outputName: 'invoice.pdf',
				outputFormat: 'pdf',
				renderName: 'invoice-render',
				test: 'true',
				tag: 'billing',
			},
			responseType: 'arrayBuffer',
		});
	});

	it('getBatchUploadStatus POSTs to uploadTemplateBatchStatus', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			jobStatus: { status: 'done' },
		});
		const result = await endpoints.admin.getBatchUploadStatus(ctx, {
			userJobId: 'job-123',
		});

		expect(result.jobStatus?.status).toBe('done');
		expect(mockRequest).toHaveBeenCalledWith(
			'uploadTemplateBatchStatus',
			'test-key',
			{ method: 'POST', formData: { userJobId: 'job-123' } },
		);
	});

	it('getRenderQueue POSTs with empty form data', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			queue: { availablePct: 80 },
		});
		const result = await endpoints.admin.getRenderQueue(ctx, {});

		expect(result.queue?.availablePct).toBe(80);
		expect(mockRequest).toHaveBeenCalledWith('getRenderQueue', 'test-key', {
			method: 'POST',
			formData: {},
		});
	});

	it('template details/structure/sample endpoints map stringify and format', async () => {
		mockRequest
			.mockResolvedValueOnce({
				succeeded: true,
				templateDetails: { name: '/a.docx' },
			})
			.mockResolvedValueOnce({ succeeded: true, templateStructure: [] })
			.mockResolvedValueOnce({
				succeeded: true,
				templateSampleData: { name: 'x' },
			});

		await endpoints.templates.getDetails(ctx, {
			templateName: '/a.docx',
			stringify: true,
		});
		await endpoints.templates.getStructure(ctx, {
			templateName: '/a.docx',
			stringify: 'yes',
		});
		await endpoints.templates.getSampleData(ctx, {
			templateName: '/a.docx',
			stringify: false,
			format: 'json',
		});

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'getTemplateDetails',
			'test-key',
			{
				method: 'POST',
				formData: { templateName: '/a.docx', stringify: 'true' },
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'getTemplateStructure',
			'test-key',
			{
				method: 'POST',
				formData: { templateName: '/a.docx', stringify: 'yes' },
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'getSampleData',
			'test-key',
			{
				method: 'POST',
				formData: {
					templateName: '/a.docx',
					stringify: 'false',
					format: 'json',
				},
			},
		);
	});

	it('getRenderTags forwards tags and window parameters', async () => {
		mockRequest.mockResolvedValue({ succeeded: true, renderTags: [] });
		await endpoints.admin.getRenderTags(ctx, {
			tags: 'billing,onboarding',
			year: 2026,
			month: 8,
			nMonths: 3,
			padBlanks: true,
		});

		expect(mockRequest).toHaveBeenCalledWith('getRenderTags', 'test-key', {
			method: 'POST',
			formData: {
				tags: 'billing,onboarding',
				year: 2026,
				month: 8,
				nMonths: 3,
				padBlanks: 'true',
			},
		});
	});

	it('rejects invalid provider payloads via output zod schemas', async () => {
		mockRequest.mockResolvedValue({ succeeded: 'yes' });

		await expect(endpoints.images.list(ctx, {})).rejects.toThrow();
	});

	it('drops untyped fields from provider responses', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			accessKey: 'should-not-leak',
		});

		const result = await endpoints.admin.environmentReady(ctx, {});

		expect(result).toEqual({ succeeded: true });
		expect(result).not.toHaveProperty('accessKey');
	});

	it('registers schemas/meta for all 17 claimed operations', () => {
		const schemas = plugin.endpointSchemas as Record<string, unknown>;
		const meta = plugin.endpointMeta as Record<string, unknown>;
		const keys = Object.keys(schemas);

		expect(keys).toHaveLength(17);
		for (const key of keys) {
			expect(meta[key]).toBeDefined();
		}
	});

	it('logs a completion event for each endpoint call', async () => {
		mockRequest.mockResolvedValue({ succeeded: true });
		await endpoints.admin.environmentReady(ctx, {});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'docmosis.environment.ready',
			{},
			'completed',
		);
	});
});
