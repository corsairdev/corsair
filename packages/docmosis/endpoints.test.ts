import { logEventFromContext } from 'corsair/core';
import { makeDocmosisRequest } from './client';
import type { DocmosisContext, DocmosisPluginOptions } from './index';
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

const mockRequest = jest.mocked(makeDocmosisRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

type EntityStore = {
	upsertByEntityId: (entityId: string, data: object) => Promise<object>;
	deleteByEntityId: (entityId: string) => Promise<boolean>;
};

type MockStore = {
	upsertByEntityId: jest.Mock<Promise<object>, [string, object]>;
	deleteByEntityId: jest.Mock<Promise<boolean>, [string]>;
};

const makeStore = (): MockStore => ({
	upsertByEntityId: jest.fn<Promise<object>, [string, object]>(
		async () => ({}),
	),
	deleteByEntityId: jest.fn<Promise<boolean>, [string]>(async () => true),
});

function makeCtx(
	options: DocmosisPluginOptions = {},
	key = 'test-key',
	db: { [K in keyof DocmosisContext['db']]?: EntityStore } = {},
): DocmosisContext {
	// Safe: the endpoints read only key, options and db from the context.
	// A narrower type is not practical because a full CorsairPluginContext needs the hub, keys and database.
	return { key, options, db, endpoints: {} } as DocmosisContext;
}

describe('Docmosis endpoints', () => {
	const plugin = docmosis({ key: 'test-key' });
	const endpoints = plugin.endpoints!;
	const ctx = makeCtx();

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

	it('getApiKey returns only a masked preview without calling the API', async () => {
		const result = await endpoints.auth.getApiKey(
			makeCtx({}, 'dXNlcjEyMzQ1Njc4'),
			{},
		);

		expect(result).toEqual({ configured: true, keyPreview: 'Njc4' });
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('forwards the configured region to the client', async () => {
		mockRequest.mockResolvedValue({ succeeded: true });
		await endpoints.admin.getRenderQueue(makeCtx({ region: 'eu1' }), {});

		expect(mockRequest).toHaveBeenCalledWith('getRenderQueue', 'test-key', {
			method: 'POST',
			region: 'eu1',
			formData: {},
		});
	});

	it('getStructure keeps the provider element shape including nesting', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			templateStructure: [
				{
					type: 'condition',
					conditionIdx: 0,
					text: 'cs_hasPeople',
					dataRefs: ['hasPeople'],
					contains: [
						{
							type: 'field',
							fieldIdx: 0,
							text: 'name',
							dataRefs: ['name'],
						},
					],
				},
			],
		});

		const result = await endpoints.templates.getStructure(ctx, {
			templateName: '/a.docx',
		});

		expect(result.templateStructure).toEqual([
			{
				type: 'condition',
				conditionIdx: 0,
				text: 'cs_hasPeople',
				dataRefs: ['hasPeople'],
				contains: [
					{ type: 'field', fieldIdx: 0, text: 'name', dataRefs: ['name'] },
				],
			},
		]);
	});

	it('getStructure accepts the stringified structure', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			templateStructure: '[{"type":"field"}]',
		});

		const result = await endpoints.templates.getStructure(ctx, {
			templateName: '/a.docx',
			stringify: true,
		});

		expect(result.templateStructure).toBe('[{"type":"field"}]');
	});

	it('getRenderTags accepts string-encoded counts from the provider', async () => {
		mockRequest.mockResolvedValue({
			succeeded: true,
			renderTags: [
				{
					year: '2017',
					month: '9',
					tags: [{ name: 'abc', countPages: '6', countDocuments: '4' }],
				},
			],
		});

		const result = await endpoints.admin.getRenderTags(ctx, { tags: 'abc' });

		expect(result.renderTags?.[0]?.tags?.[0]).toEqual({
			name: 'abc',
			countPages: '6',
			countDocuments: '4',
		});
	});

	it('ping and pingService GET /ping', async () => {
		mockRequest.mockResolvedValue({});
		expect(await endpoints.admin.ping(ctx, {})).toEqual({});
		expect(await endpoints.admin.pingService(ctx, {})).toEqual({});

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
		const binary = {
			contentType: 'application/octet-stream',
			dataBase64: 'AQIDBA==',
			byteLength: 4,
		};
		mockRequest.mockResolvedValue(binary);
		const image = await endpoints.images.get(ctx, {
			imageName: '/logo.png',
		});
		const template = await endpoints.templates.get(ctx, {
			templateName: '/template.docx',
		});

		expect(image).toEqual(binary);
		expect(template).toEqual(binary);
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
		const binary = {
			contentType: 'application/pdf',
			dataBase64: 'AQIDBAUGBwg=',
			byteLength: 8,
		};
		mockRequest.mockResolvedValue(binary);

		const result = await endpoints.templates.render(ctx, {
			templateName: '/invoice.docx',
			data: { invoiceId: 'inv_123', total: 199.5 },
			outputName: 'invoice.pdf',
			outputFormat: 'pdf',
			devMode: true,
			tags: 'billing',
		});

		expect(result).toEqual(binary);
		expect(mockRequest).toHaveBeenCalledWith('render', 'test-key', {
			method: 'POST',
			formData: {
				templateName: '/invoice.docx',
				data: JSON.stringify({ invoiceId: 'inv_123', total: 199.5 }),
				outputName: 'invoice.pdf',
				outputFormat: 'pdf',
				devMode: 'true',
				tags: 'billing',
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

	it('registers schemas/meta for all 18 operations', () => {
		const keys = Object.keys(plugin.endpointSchemas ?? {});
		const metaKeys = Object.keys(plugin.endpointMeta ?? {});

		expect(keys).toHaveLength(18);
		expect(metaKeys.sort()).toEqual([...keys].sort());
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

	describe('entity persistence', () => {
		it('listTemplates upserts each template under its folder-qualified path', async () => {
			mockRequest.mockResolvedValue({
				succeeded: true,
				templateList: [
					{ name: 'a.docx', sizeBytes: 10, md5: 'abc' },
					{ name: '/b.docx', lastModifiedISO8601: '2024-01-01T00:00:00Z' },
				],
			});
			const templates = makeStore();
			await endpoints.templates.list(makeCtx({}, 'test-key', { templates }), {
				folder: '/samples/',
			});

			expect(templates.upsertByEntityId).toHaveBeenCalledTimes(2);
			expect(templates.upsertByEntityId).toHaveBeenNthCalledWith(
				1,
				'samples/a.docx',
				{ id: 'samples/a.docx', name: 'a.docx', sizeBytes: 10, md5: 'abc' },
			);
			expect(templates.upsertByEntityId).toHaveBeenNthCalledWith(
				2,
				'samples/b.docx',
				{
					id: 'samples/b.docx',
					name: '/b.docx',
					lastModifiedISO8601: '2024-01-01T00:00:00Z',
				},
			);
		});

		it('listTemplates on the root folder saves the same id as getTemplateDetails', async () => {
			mockRequest.mockResolvedValue({
				succeeded: true,
				templateList: [{ name: 'a.docx' }],
			});
			const templates = makeStore();
			await endpoints.templates.list(makeCtx({}, 'test-key', { templates }), {
				folder: '/',
			});

			expect(templates.upsertByEntityId).toHaveBeenCalledWith('a.docx', {
				id: 'a.docx',
				name: 'a.docx',
			});
		});

		it('getTemplateDetails upserts the template under the requested path', async () => {
			mockRequest.mockResolvedValue({
				succeeded: true,
				templateDetails: { name: 'x.docx', templateHasErrors: false },
			});
			const templates = makeStore();
			await endpoints.templates.getDetails(
				makeCtx({}, 'test-key', { templates }),
				{ templateName: '/x.docx' },
			);

			expect(templates.upsertByEntityId).toHaveBeenCalledWith('x.docx', {
				id: 'x.docx',
				name: 'x.docx',
				templateHasErrors: false,
			});
		});

		it('deleteTemplate removes rows only when the provider reports success', async () => {
			const templates = makeStore();
			const dbCtx = makeCtx({}, 'test-key', { templates });
			mockRequest.mockResolvedValue({ succeeded: false });
			await endpoints.templates.delete(dbCtx, { templateName: '/a.docx' });
			expect(templates.deleteByEntityId).not.toHaveBeenCalled();

			mockRequest.mockResolvedValue({ succeeded: true });
			await endpoints.templates.delete(dbCtx, {
				templateName: ['/a.docx', 'dir/b.docx'],
			});
			expect(templates.deleteByEntityId).toHaveBeenNthCalledWith(1, 'a.docx');
			expect(templates.deleteByEntityId).toHaveBeenNthCalledWith(
				2,
				'dir/b.docx',
			);
		});

		it('listImages upserts and deleteImage removes image rows', async () => {
			const images = makeStore();
			const dbCtx = makeCtx({}, 'test-key', { images });
			mockRequest.mockResolvedValue({
				succeeded: true,
				imageList: [{ name: 'logo.png', sizeBytes: 5, md5: 'm' }],
			});
			await endpoints.images.list(dbCtx, {});
			expect(images.upsertByEntityId).toHaveBeenCalledWith('logo.png', {
				id: 'logo.png',
				name: 'logo.png',
				sizeBytes: 5,
				md5: 'm',
			});

			mockRequest.mockResolvedValue({ succeeded: true });
			await endpoints.images.delete(dbCtx, { imageName: 'logo.png' });
			expect(images.deleteByEntityId).toHaveBeenCalledWith('logo.png');
		});

		it('getBatchUploadStatus upserts the job keyed by userJobId', async () => {
			mockRequest.mockResolvedValue({
				succeeded: true,
				jobStatus: {
					userJobId: 'job-1',
					isEnded: true,
					status: 'done',
					pctComplete: 100,
					jobResult: { uploadedTotalCount: 3 },
				},
			});
			const batchUploadJobs = makeStore();
			await endpoints.admin.getBatchUploadStatus(
				makeCtx({}, 'test-key', { batchUploadJobs }),
				{ userJobId: 'job-1' },
			);

			expect(batchUploadJobs.upsertByEntityId).toHaveBeenCalledWith('job-1', {
				id: 'job-1',
				isEnded: true,
				status: 'done',
				pctComplete: 100,
				jobResult: { uploadedTotalCount: 3 },
			});
		});

		it('environmentSummary upserts the environment keyed by name', async () => {
			mockRequest.mockResolvedValue({
				succeeded: true,
				accountEnvironmentSummary: {
					ready: 'true',
					accountEnvDetails: { name: 'Development', isDisabled: 'false' },
					pageQuota: { used: '467', quota: '230' },
					plan: { name: 'Free Trial' },
				},
			});
			const environments = makeStore();
			await endpoints.admin.environmentSummary(
				makeCtx({}, 'test-key', { environments }),
				{},
			);

			expect(environments.upsertByEntityId).toHaveBeenCalledWith(
				'Development',
				{
					id: 'Development',
					name: 'Development',
					ready: 'true',
					isDisabled: 'false',
					pageQuota: { used: '467', quota: '230' },
					planName: 'Free Trial',
				},
			);
		});

		it('render records metadata of the produced document, not its bytes', async () => {
			mockRequest.mockResolvedValue({
				contentType: 'application/pdf',
				dataBase64: 'JVBERg==',
				byteLength: 5,
			});
			const renders = makeStore();
			await endpoints.templates.render(makeCtx({}, 'test-key', { renders }), {
				templateName: '/t.docx',
				data: { a: 1 },
				outputName: 'out.pdf',
				devMode: 'yes',
			});

			expect(renders.upsertByEntityId).toHaveBeenCalledTimes(1);
			const [id, row] = renders.upsertByEntityId.mock.calls[0]!;
			expect(row).toEqual({
				id,
				templateName: '/t.docx',
				outputName: 'out.pdf',
				contentType: 'application/pdf',
				byteLength: 5,
				devMode: true,
				createdAt: expect.any(Date),
			});
			expect(row).not.toHaveProperty('dataBase64');
		});

		it('keeps the response when the database write fails', async () => {
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
			mockRequest.mockResolvedValue({
				succeeded: true,
				imageList: [{ name: 'a.png' }],
			});
			const images = makeStore();
			images.upsertByEntityId.mockRejectedValue(new Error('db down'));

			const result = await endpoints.images.list(
				makeCtx({}, 'test-key', { images }),
				{},
			);

			expect(result.imageList).toEqual([{ name: 'a.png' }]);
			expect(warn).toHaveBeenCalled();
			warn.mockRestore();
		});
	});
});
