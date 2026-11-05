import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { PDFMONKEY_API_BASE } from './client';
import type { PDFMonkeyContext } from './index';
import { pdfmonkey } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const DOCUMENT = {
	id: 'doc-1',
	app_id: 'app-1',
	document_template_id: 'tpl-1',
	status: 'pending' as const,
	payload: { clientName: 'Ada' },
	meta: null,
	filename: null,
	download_url: null,
	preview_url: null,
	public_share_link: null,
	checksum: null,
	generation_logs: [],
	failure_cause: null,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};

const DOCUMENT_CARD = {
	id: 'doc-1',
	app_id: 'app-1',
	document_template_id: 'tpl-1',
	status: 'success' as const,
	download_url: 'https://files.example.com/doc.pdf',
	preview_url: 'https://preview.pdfmonkey.io/doc',
	public_share_link: null,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};

const TEMPLATE = {
	id: 'tpl-1',
	app_id: 'app-1',
	identifier: 'invoice',
	body: '<h1>Hello</h1>',
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};

const LIST_META = {
	current_page: 1,
	next_page: 2,
	prev_page: null,
	total_pages: 4,
};

function testContext(): PDFMonkeyContext {
	return {
		key: 'test-key',
		options: { authType: 'api_key' },
		db: {},
		logEvent: jest.fn(),
	} as unknown as PDFMonkeyContext;
}

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	return mockRequest.mock.calls[mockRequest.mock.calls.length - 1] as [
		{ BASE: string; HEADERS?: Record<string, string> },
		{
			method: string;
			url: string;
			body?: unknown;
			query?: unknown;
		},
	];
}

describe('PDFMonkey plugin shape', () => {
	it('registers 12 endpoints, generation webhooks, and api_key auth', () => {
		const plugin = pdfmonkey();
		expect(plugin.id).toBe('pdfmonkey');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual([
			'documents.createDocument',
			'documents.createDocumentSync',
			'documents.deleteDocument',
			'documents.getDocument',
			'documents.getDocumentCard',
			'documents.listDocumentCards',
			'documents.updateDocument',
			'templates.createTemplate',
			'templates.deleteTemplate',
			'templates.getTemplate',
			'templates.listTemplateCards',
			'templates.updateTemplate',
		]);
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual([
			'documents.generationFailure',
			'documents.generationSuccess',
		]);
	});

	it('throws AuthMissingError when no API key is available', async () => {
		const plugin = pdfmonkey();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => undefined,
					},
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the webhook signature is missing', async () => {
		const plugin = pdfmonkey();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: {
						get_webhook_signature: async () => undefined,
					},
				} as never,
				'webhook',
			),
		).rejects.toMatchObject({
			name: 'AuthMissingError',
			pluginId: 'pdfmonkey',
			authType: 'webhook_signature',
		});
	});
});

describe('PDFMonkey endpoints', () => {
	const ctx = testContext();
	const plugin = pdfmonkey({ key: 'test-key' });

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists template cards with page[number] and q[workspace_id]', async () => {
		mockRequest.mockResolvedValueOnce({
			document_template_cards: [
				{
					id: 'tpl-1',
					app_id: 'app-1',
					created_at: '2026-01-01T00:00:00Z',
					updated_at: '2026-01-01T00:00:00Z',
				},
			],
			meta: LIST_META,
		});

		const result = await plugin.endpoints!.templates.listTemplateCards(ctx, {
			q: { workspace_id: 'ws-1' },
		});

		expect(result.meta).toEqual(LIST_META);
		expect(result.document_template_cards[0]?.id).toBe('tpl-1');
		const [config, options] = lastCall();
		expect(config.BASE).toBe(PDFMONKEY_API_BASE);
		expect(config.HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer test-key' }),
		);
		expect(options).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/api/v1/document_template_cards',
				query: {
					page: { number: 1 },
					q: { workspace_id: 'ws-1', folders: undefined },
					sort: undefined,
				},
			}),
		);
		expect(mockLog).toHaveBeenCalled();
	});

	it('gets a wrapped template', async () => {
		mockRequest.mockResolvedValueOnce({ document_template: TEMPLATE });

		const result = await plugin.endpoints!.templates.getTemplate(ctx, {
			id: 'tpl-1',
		});

		expect(result.document_template.id).toBe('tpl-1');
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/api/v1/document_templates/tpl-1',
			}),
		);
	});

	it('creates a template', async () => {
		mockRequest.mockResolvedValueOnce({ document_template: { id: 'tpl-2' } });

		const result = await plugin.endpoints!.templates.createTemplate(ctx, {
			document_template: {
				app_id: 'app-1',
				identifier: 'invoice',
				body: '<h1>Hi</h1>',
			},
		});

		expect(result.document_template.id).toBe('tpl-2');
		const [, options] = lastCall();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/api/v1/document_templates');
		expect(options.body).toEqual(
			expect.objectContaining({
				document_template: expect.objectContaining({
					identifier: 'invoice',
					edition_mode: 'code',
					output_type: 'pdf',
				}),
			}),
		);
	});

	it('updates a template and rejects a missing body', async () => {
		mockRequest.mockResolvedValueOnce({ document_template: { id: 'tpl-1' } });

		await expect(
			plugin.endpoints!.templates.updateTemplate(ctx, {
				document_template_id: 'tpl-1',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();

		const result = await plugin.endpoints!.templates.updateTemplate(ctx, {
			document_template_id: 'tpl-1',
			document_template: { identifier: 'updated' },
		});
		expect(result.document_template.id).toBe('tpl-1');
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/api/v1/document_templates/tpl-1',
				body: { document_template: { identifier: 'updated' } },
			}),
		);
	});

	it('maps template DELETE 204 to { success: true }', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await plugin.endpoints!.templates.deleteTemplate(ctx, {
			id: 'tpl-1',
		});

		expect(result).toEqual({ success: true });
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				url: '/api/v1/document_templates/tpl-1',
			}),
		);
	});

	it('creates a document and unwraps { document }', async () => {
		mockRequest.mockResolvedValueOnce({ document: DOCUMENT });

		const result = await plugin.endpoints!.documents.createDocument(ctx, {
			document: {
				document_template_id: 'tpl-1',
				status: 'pending',
				payload: { clientName: 'Ada' },
			},
		});

		expect(result.id).toBe('doc-1');
		expect(result.document_template_id).toBe('tpl-1');
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/v1/documents',
				body: {
					document: {
						document_template_id: 'tpl-1',
						status: 'pending',
						payload: { clientName: 'Ada' },
					},
				},
			}),
		);
	});

	it('creates a sync document and unwraps { document_card }', async () => {
		mockRequest.mockResolvedValueOnce({ document_card: DOCUMENT_CARD });

		const result = await plugin.endpoints!.documents.createDocumentSync(ctx, {
			document: { document_template_id: 'tpl-1' },
		});

		expect(result.id).toBe('doc-1');
		expect(result.status).toBe('success');
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/v1/documents/sync',
				body: {
					document: {
						document_template_id: 'tpl-1',
						status: 'pending',
					},
				},
			}),
		);
	});

	it('gets a document card and unwraps { document_card }', async () => {
		mockRequest.mockResolvedValueOnce({ document_card: DOCUMENT_CARD });

		const result = await plugin.endpoints!.documents.getDocumentCard(ctx, {
			id: 'doc-1',
		});

		expect(result.id).toBe('doc-1');
		expect(lastCall()[1].url).toBe('/api/v1/document_cards/doc-1');
	});

	it('lists document cards with nested page and q filters', async () => {
		mockRequest.mockResolvedValueOnce({
			document_cards: [DOCUMENT_CARD],
			meta: LIST_META,
		});

		const result = await plugin.endpoints!.documents.listDocumentCards(ctx, {
			page: 3,
			q: { status: 'success', document_template_id: 'tpl-1' },
		});

		expect(result.document_cards[0]?.id).toBe('doc-1');
		expect(result.meta?.next_page).toBe(2);
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/api/v1/document_cards',
				query: {
					page: { number: 3 },
					q: {
						document_template_id: 'tpl-1',
						status: 'success',
						workspace_id: undefined,
						updated_since: undefined,
						search: undefined,
					},
				},
			}),
		);
	});

	it('gets a full document and unwraps { document }', async () => {
		mockRequest.mockResolvedValueOnce({ document: DOCUMENT });

		const result = await plugin.endpoints!.documents.getDocument(ctx, {
			id: 'doc-1',
		});

		expect(result.id).toBe('doc-1');
		expect(result.payload).toEqual({ clientName: 'Ada' });
		expect(lastCall()[1].url).toBe('/api/v1/documents/doc-1');
	});

	it('updates a document', async () => {
		mockRequest.mockResolvedValueOnce({
			document: { ...DOCUMENT, status: 'draft' },
		});

		const result = await plugin.endpoints!.documents.updateDocument(ctx, {
			document_id: 'doc-1',
			document: { status: 'draft' },
		});

		expect(result.status).toBe('draft');
		expect(lastCall()[1]).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/api/v1/documents/doc-1',
				body: { document: { status: 'draft' } },
			}),
		);
	});

	it('maps document DELETE 204 to { success: true }', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await plugin.endpoints!.documents.deleteDocument(ctx, {
			id: 'doc-1',
		});

		expect(result).toEqual({ success: true });
		expect(lastCall()[1].method).toBe('DELETE');
	});

	it('verifies Svix signatures on generation webhooks', async () => {
		const crypto = await import('crypto');
		const secretBytes = Buffer.from('pdfmonkey-test-secret', 'utf8');
		const secret = `whsec_${secretBytes.toString('base64')}`;
		const timestamp = String(Math.floor(Date.now() / 1000));
		const payload = {
			document: {
				id: 'doc-1',
				app_id: 'app-1',
				status: 'success' as const,
				download_url: 'https://files.example.com/doc.pdf',
				preview_url: null,
				public_share_link: null,
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
			},
		};
		const rawBody = JSON.stringify(payload);
		const signature = `v1,${crypto
			.createHmac('sha256', secretBytes)
			.update(`msg_1.${timestamp}.${rawBody}`)
			.digest('base64')}`;
		const webhookPlugin = pdfmonkey({ webhookSecret: secret });
		const webhookCtx = {
			...ctx,
			key: secret,
		} as unknown as PDFMonkeyContext;

		const result =
			await webhookPlugin.webhooks!.documents.generationSuccess.handler(
				webhookCtx,
				{
					payload,
					headers: {
						'svix-id': 'msg_1',
						'svix-timestamp': timestamp,
						'svix-signature': signature,
					},
					rawBody,
				},
			);

		expect(result).toMatchObject({
			success: true,
			data: { document: { id: 'doc-1', status: 'success' } },
		});
	});

	it('surfaces ApiError from the client so 429 handlers can match', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v1/documents' },
			{
				url: 'https://api.pdfmonkey.io/api/v1/documents',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		mockRequest.mockRejectedValueOnce(error);

		await expect(
			plugin.endpoints!.documents.getDocument(ctx, { id: 'doc-1' }),
		).rejects.toBe(error);
	});
});
