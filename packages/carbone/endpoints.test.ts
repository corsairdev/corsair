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
				version: '5.0.0',
			});

			const res = await StatusEndpoints.getStatus(createMockContext(), {});
			expect(res.success).toBe(true);
			expect(res.message).toBe('OK');
			expect(mockRequest).toHaveBeenCalledTimes(1);
		});
	});

	describe('templates', () => {
		it('uploadTemplate posts template content and syncs to local templates table', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					id: 'template_abc123',
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
			expect(res.data?.id).toBe('template_abc123');
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

		it('getTemplate performs authenticated request and returns template content', async () => {
			mockRequest.mockResolvedValueOnce(
				'PK\x03\x04mockTemplateFileStreamContent',
			);

			const ctx = createMockContext();
			const res = await TemplatesEndpoints.getTemplate(ctx, {
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
	});

	describe('render', () => {
		it('renderTemplate triggers document generation', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					renderId: 'rnd_abc_999',
				},
			});

			const res = await RenderEndpoints.renderTemplate(createMockContext(), {
				templateId: 'tmpl_invoice_01',
				data: { customer: 'Alice', total: 100 },
				convertTo: 'pdf',
			});

			expect(res.success).toBe(true);
			expect(res.data.renderId).toBe('rnd_abc_999');
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

		it('renderInline renders without pre-uploading template', async () => {
			mockRequest.mockResolvedValueOnce({
				success: true,
				data: {
					renderId: 'rnd_inline_123',
				},
			});

			const res = await RenderEndpoints.renderInline(createMockContext(), {
				template: 'base64EncodedRawTemplate',
				data: { name: 'Bob' },
				convertTo: 'pdf',
			});

			expect(res.success).toBe(true);
			expect(res.data.renderId).toBe('rnd_inline_123');
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'POST',
					url: '/render/template',
				}),
			);
		});

		it('getRender returns download URL for rendered document', async () => {
			const res = await RenderEndpoints.getRender(createMockContext(), {
				renderId: 'rnd_report_456',
			});

			expect(res.renderId).toBe('rnd_report_456');
			expect(res.downloadUrl).toBe(
				'https://api.carbone.io/render/rnd_report_456',
			);
		});
	});
});
