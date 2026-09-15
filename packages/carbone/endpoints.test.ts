import type { CarboneContext } from './index';

const mockRequest = jest.fn();

jest.mock('corsair/http', () => {
	class ApiError extends Error {
		constructor(
			public readonly message: string,
			public readonly status?: number,
			public readonly statusText?: string,
			public readonly body?: unknown,
			public readonly retryAfter?: number,
		) {
			super(message);
			this.name = 'ApiError';
		}
	}

	return {
		request: (...args: unknown[]) => mockRequest(...args),
		ApiError,
	};
});

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} auth for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}

	return {
		AuthMissingError,
		logEventFromContext: jest.fn().mockResolvedValue(undefined as never),
	};
});

import {
	RenderEndpoints,
	StatusEndpoints,
	TemplatesEndpoints,
	VersionEndpoints,
} from './endpoints';

function createMockContext(key = 'test-carbone-key'): CarboneContext {
	return {
		key,
		options: { authType: 'api_key' },
		db: {
			templates: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined as never),
				deleteByEntityId: jest.fn().mockResolvedValue(undefined as never),
			},
			categories: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined as never),
			},
			tags: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined as never),
			},
		},
	} as unknown as CarboneContext;
}

describe('Carbone endpoints execution', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	describe('status', () => {
		it('getStatus returns status successfully', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				code: 200,
				message: 'OK',
				version: '5.14.4',
			});

			const res = await StatusEndpoints.getStatus(createMockContext(), {});
			expect(res.success).toBe(true);
			expect(res.message).toBe('OK');
			expect(res.version).toBe('5.14.4');
			expect(mockRequest).toHaveBeenCalledTimes(1);
		});
	});

	describe('templates', () => {
		it('uploadTemplate posts template and syncs to local templates table', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					templateId: 'template_abc123',
					versionId: 'version_xyz456',
					type: 'docx',
					size: 2048,
					createdAt: 1700000000,
				},
			});

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.uploadTemplate(ctx, {
				template: 'UEsDBBQAAAAIA...',
			});

			expect(res.success).toBe(true);
			expect(res.data?.templateId).toBe('template_abc123');
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://api.carbone.io',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/template',
					body: { template: 'UEsDBBQAAAAIA...' },
				}),
			);
			expect(ctx.db.templates.upsertByEntityId).toHaveBeenCalledWith(
				'template_abc123',
				expect.objectContaining({
					id: 'template_abc123',
					versionId: 'version_xyz456',
					type: 'docx',
				}),
			);
		});

		it('listTemplates retrieves templates with query params and syncs to database', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: [
					{
						versionId: 'v100',
						id: 't100',
						name: 'Invoice',
						category: 'Finance',
						tags: ['billing'],
					},
				],
				hasMore: false,
			});

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.listTemplates(ctx, {
				category: 'Finance',
			});

			expect(res.success).toBe(true);
			expect(res.data.length).toBe(1);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/templates',
					query: { category: 'Finance' },
				}),
			);
			expect(ctx.db.templates.upsertByEntityId).toHaveBeenCalledWith(
				'v100',
				expect.objectContaining({
					name: 'Invoice',
					category: 'Finance',
				}),
			);
		});

		it('downloadTemplate performs authenticated request and returns template content', async () => {
			mockRequest.mockResolvedValueOnce(
				'PK\x03\x04mockTemplateFileStreamContent',
			);

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.downloadTemplate(ctx, {
				templateId: 'tmpl_12345',
			});

			expect(res.templateId).toBe('tmpl_12345');
			expect(res.content).toBe('PK\x03\x04mockTemplateFileStreamContent');
			expect(res.success).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://api.carbone.io',
					TOKEN: 'test-carbone-key',
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/template/tmpl_12345',
				}),
			);
		});

		it('updateTemplate updates metadata and syncs to local database', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					name: 'Updated Name',
					category: 'Updated Category',
					tags: ['v2'],
					versionId: 'tmpl_12345',
				},
			});

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.updateTemplate(ctx, {
				templateId: 'tmpl_12345',
				name: 'Updated Name',
				category: 'Updated Category',
				tags: ['v2'],
			});

			expect(res.success).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'PATCH',
					url: '/template/tmpl_12345',
					body: {
						name: 'Updated Name',
						category: 'Updated Category',
						tags: ['v2'],
					},
				}),
			);
			expect(ctx.db.templates.upsertByEntityId).toHaveBeenCalledWith(
				'tmpl_12345',
				expect.objectContaining({
					name: 'Updated Name',
					category: 'Updated Category',
				}),
			);
		});

		it('deleteTemplate deletes stored template and removes from local database', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				message: 'Template deleted',
			});

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.deleteTemplate(ctx, {
				templateId: 'tmpl_12345',
			});

			expect(res.success).toBe(true);
			expect(res.message).toBe('Template deleted');
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'DELETE',
					url: '/template/tmpl_12345',
				}),
			);
			expect(ctx.db.templates.deleteByEntityId).toHaveBeenCalledWith(
				'tmpl_12345',
			);
		});

		it('listCategories retrieves categories and syncs to local database', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: [{ name: 'Invoices' }, { name: 'Receipts' }],
			});

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.listCategories(ctx, {});

			expect(res.success).toBe(true);
			expect(res.data.length).toBe(2);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/templates/categories',
				}),
			);
			expect(ctx.db.categories.upsertByEntityId).toHaveBeenCalledWith(
				'Invoices',
				{ name: 'Invoices' },
			);
		});

		it('listTags retrieves tags and syncs to local database', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: [{ name: 'billing' }, { name: 'v1' }],
			});

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.listTags(ctx, {});

			expect(res.success).toBe(true);
			expect(res.data.length).toBe(2);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/templates/tags',
				}),
			);
			expect(ctx.db.tags.upsertByEntityId).toHaveBeenCalledWith('billing', {
				name: 'billing',
			});
		});
	});

	describe('render', () => {
		it('generateReport triggers document generation', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					renderId: 'rnd_abc_999.pdf',
				},
			});

			const res = await RenderEndpoints.generateReport(createMockContext(), {
				templateId: 'tmpl_invoice_01',
				data: { customer: 'Alice', total: 100 },
				convertTo: 'pdf',
			});

			expect(res.success).toBe(true);
			expect(res.data.renderId).toBe('rnd_abc_999.pdf');
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/render/tmpl_invoice_01',
					body: {
						data: { customer: 'Alice', total: 100 },
						convertTo: 'pdf',
					},
				}),
			);
		});

		it('renderDirect renders without pre-uploading template', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					renderId: 'rnd_direct_123.pdf',
				},
			});

			const res = await RenderEndpoints.renderDirect(createMockContext(), {
				template: 'base64EncodedRawTemplate',
				data: { name: 'Bob' },
				convertTo: 'pdf',
			});

			expect(res.success).toBe(true);
			expect(res.data.renderId).toBe('rnd_direct_123.pdf');
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/render/template',
				}),
			);
		});
	});

	describe('version', () => {
		it('setApiVersion sets and confirms API version', async () => {
			const res = await VersionEndpoints.setApiVersion(createMockContext(), {
				version: '5',
			});

			expect(res.success).toBe(true);
			expect(res.version).toBe('5');
			expect(res.message).toBe('Carbone API version set to 5');
		});
	});
});
