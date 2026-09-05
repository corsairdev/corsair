import { ApiError, request } from 'corsair/http';
import { PARSEUR_API_BASE } from './client';
import {
	Bootstrap,
	Document,
	ExportConfig,
	Mailbox,
	Template,
	Webhook,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import type { ParseurContext } from './index';
import { parseur } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;

function testContext(): ParseurContext {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' },
		db: {},
		logEvent: jest.fn(),
	} as unknown as ParseurContext;
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

describe('Parseur plugin', () => {
	it('registers official operations and api_key auth', () => {
		const plugin = parseur();
		expect(plugin.id).toBe('parseur');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpointMeta ?? {}).length).toBe(30);
	});
});

describe('mailboxes', () => {
	beforeEach(() => jest.clearAllMocks());

	it('listMailboxes GET /parser', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			current: 1,
			total: 1,
			results: [{ id: 101, name: 'Mailbox 1' }],
		});
		const result = await Mailbox.listMailboxes(testContext(), {
			page: 1,
			ordering: 'name',
		});
		const [config, req] = lastCall();
		expect(config.BASE).toBe(PARSEUR_API_BASE);
		expect(config.HEADERS?.Authorization).toBe('Token test-api-key');
		expect(req).toMatchObject({ method: 'GET', url: '/parser' });
		expect(result.results[0]?.id).toBe(101);
	});

	it('createMailbox POST /parser', async () => {
		mockRequest.mockResolvedValueOnce({ id: 102, name: 'Receipts' });
		const result = await Mailbox.createMailbox(testContext(), {
			name: 'Receipts',
			ai_engine: 'GCP_AI_2',
		});
		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/parser');
		expect(req.body).toEqual({ name: 'Receipts', ai_engine: 'GCP_AI_2' });
		expect(result.id).toBe(102);
	});

	it('getMailbox GET /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce({ id: 101, name: 'Mailbox 1' });
		const result = await Mailbox.getMailbox(testContext(), { id: 101 });
		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: '/parser/101',
		});
		expect(result.name).toBe('Mailbox 1');
	});

	it('updateMailbox PUT /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce({ id: 101, name: 'Updated' });
		await Mailbox.updateMailbox(testContext(), { id: 101, name: 'Updated' });
		const [, req] = lastCall();
		expect(req.method).toBe('PUT');
		expect(req.body).toEqual({ name: 'Updated' });
	});

	it('deleteMailbox DELETE /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		expect(await Mailbox.deleteMailbox(testContext(), { id: 101 })).toEqual({
			success: true,
		});
	});

	it('getMailboxSchema GET /parser/{id}/schema', async () => {
		mockRequest.mockResolvedValueOnce({
			type: 'object',
			properties: { CustomerName: { type: 'string' } },
		});
		const result = await Mailbox.getMailboxSchema(testContext(), { id: 101 });
		expect(result.type).toBe('object');
		expect(result.properties.CustomerName).toBeDefined();
	});

	it('copyMailbox POST /parser/{id}/copy with no body', async () => {
		mockRequest.mockResolvedValueOnce({
			notification_set: { info: ['Mailbox is being copied.'] },
		});
		const result = await Mailbox.copyMailbox(testContext(), { id: 101 });
		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/parser/101/copy');
		expect(req.body).toBeUndefined();
		expect(result.notification_set.info.length).toBeGreaterThan(0);
	});
});

describe('documents', () => {
	beforeEach(() => jest.clearAllMocks());

	it('listDocuments GET /parser/{id}/document_set', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 501, name: 'doc.pdf', status: 'PARSEDOK' }],
		});
		const result = await Document.listDocuments(testContext(), {
			id: 101,
			status: 'INCOMING',
		});
		expect(lastCall()[1].query).toEqual(
			expect.objectContaining({ status: 'INCOMING' }),
		);
		expect(result.results[0]?.status).toBe('PARSEDOK');
	});

	it('getDocument GET /document/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 501,
			status: 'PARSEDOK',
			result: '{"Amount":100}',
		});
		const result = await Document.getDocument(testContext(), { id: 501 });
		expect(result.result).toBe('{"Amount":100}');
	});

	it('deleteDocument DELETE /document/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		expect(await Document.deleteDocument(testContext(), { id: 501 })).toEqual({
			success: true,
		});
	});

	it('getDocumentLogs GET /document/{id}/log_set', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 1, message: 'ok' }],
		});
		const result = await Document.getDocumentLogs(testContext(), { id: 501 });
		expect(result.results[0]?.message).toBe('ok');
	});

	it('uploadDocument POST multipart /parser/{id}/upload', async () => {
		const originalFetch = global.fetch;
		global.fetch = jest.fn().mockResolvedValueOnce({
			ok: true,
			status: 201,
			json: async () => ({
				message: 'OK',
				attachments: [{ name: 'uploaded.pdf', DocumentID: '502' }],
			}),
		});
		try {
			const result = await Document.uploadDocument(testContext(), {
				id: 101,
				file: 'sample-data',
				file_name: 'uploaded.pdf',
			});
			const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
			expect(url).toBe(`${PARSEUR_API_BASE}/parser/101/upload`);
			expect(options.body).toBeInstanceOf(FormData);
			expect(result.message).toBe('OK');
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('uploadDocument 429 preserves Retry-After on ApiError', async () => {
		const originalFetch = global.fetch;
		global.fetch = jest.fn().mockResolvedValueOnce({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: { get: (name: string) => (name === 'Retry-After' ? '2' : null) },
			text: async () => 'rate limited',
		});
		try {
			const err = await Document.uploadDocument(testContext(), {
				id: 101,
				file: 'sample-data',
				file_name: 'uploaded.pdf',
			}).catch((error: unknown) => error);
			expect(err).toBeInstanceOf(ApiError);
			expect((err as ApiError).status).toBe(429);
			expect((err as ApiError).retryAfter).toBe(2000);
			expect(
				await errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
			).toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 2000,
			});
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('uploadDocument does not treat base64param as base64', async () => {
		const originalFetch = global.fetch;
		let uploaded: Blob | undefined;
		global.fetch = jest.fn().mockImplementation(async (_url, options) => {
			uploaded = (options.body as FormData).get('file') as Blob;
			return {
				ok: true,
				status: 201,
				json: async () => ({
					message: 'OK',
					attachments: [{ name: 't.txt', DocumentID: '1' }],
				}),
			};
		});
		try {
			await Document.uploadDocument(testContext(), {
				id: 101,
				file: 'data:text/plain;base64param=1,hello',
				file_name: 't.txt',
			});
			expect(await uploaded?.text()).toBe('hello');
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('createEmailDocument POST /email official fields', async () => {
		mockRequest.mockResolvedValueOnce({
			message: 'OK',
			DocumentID: 'abc',
			DocumentIDs: ['abc'],
		});
		const result = await Document.createEmailDocument(testContext(), {
			subject: 'Receipt',
			from: 'Sender <a@example.com>',
			recipient: 'box@in.parseur.com',
			body_plain: 'hello',
		});
		expect(lastCall()[1].body).toEqual({
			subject: 'Receipt',
			from: 'Sender <a@example.com>',
			recipient: 'box@in.parseur.com',
			body_plain: 'hello',
		});
		expect(result.DocumentID).toBe('abc');
	});

	it('processDocument POST /document/{id}/process', async () => {
		mockRequest.mockResolvedValueOnce({
			notification_set: { info: ['Document is being processed.'] },
		});
		const result = await Document.processDocument(testContext(), { id: 501 });
		expect(lastCall()[1].url).toBe('/document/501/process');
		expect(result.notification_set.info[0]).toContain('processed');
	});

	it('skipDocument POST /document/{id}/skip', async () => {
		mockRequest.mockResolvedValueOnce({ id: 501, status: 'SKIPPED' });
		expect(
			(await Document.skipDocument(testContext(), { id: 501 })).status,
		).toBe('SKIPPED');
	});

	it('copyDocument POST /document/{id}/copy/{target}', async () => {
		mockRequest.mockResolvedValueOnce({
			notification_set: { info: ['Document is being copied.'] },
		});
		const result = await Document.copyDocument(testContext(), {
			id: 501,
			target_mailbox_id: 202,
		});
		expect(lastCall()[1].url).toBe('/document/501/copy/202');
		expect(result.notification_set.info.length).toBeGreaterThan(0);
	});
});

describe('templates and exports', () => {
	beforeEach(() => jest.clearAllMocks());

	it('listTemplates GET /parser/{id}/template_set', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 801, name: 'T1', parser: 101 }],
		});
		const result = await Template.listTemplates(testContext(), { id: 101 });
		expect(result.results[0]?.id).toBe(801);
	});

	it('getTemplate GET /template/{id}', async () => {
		mockRequest.mockResolvedValueOnce({ id: 801, name: 'T1' });
		expect((await Template.getTemplate(testContext(), { id: 801 })).id).toBe(
			801,
		);
	});

	it('deleteTemplate DELETE /template/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		expect(await Template.deleteTemplate(testContext(), { id: 801 })).toEqual({
			success: true,
		});
	});

	it('copyTemplate POST /template/{id}/copy/{target}', async () => {
		mockRequest.mockResolvedValueOnce({
			notification_set: { info: ['Template is being copied.'] },
		});
		const result = await Template.copyTemplate(testContext(), {
			id: 801,
			target_mailbox_id: 202,
		});
		expect(lastCall()[1].url).toBe('/template/801/copy/202');
		expect(result.notification_set.info.length).toBeGreaterThan(0);
	});

	it('createExportConfig POST type/items', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 902,
			name: 'Export',
			type: 'PARSER',
			items: ['CustomerName'],
			csv_download: 'https://example.com/c.csv',
			xls_download: 'https://example.com/c.xls',
		});
		const result = await ExportConfig.createExportConfig(testContext(), {
			id: 101,
			name: 'Export',
			items: ['CustomerName'],
		});
		expect(lastCall()[1].body).toEqual({
			name: 'Export',
			type: 'PARSER',
			items: ['CustomerName'],
		});
		expect(result.items).toEqual(['CustomerName']);
	});

	it('updateExportConfig PATCH items', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 902,
			name: 'Export',
			type: 'PARSER',
			items: ['Phone'],
			csv_download: 'https://example.com/c.csv',
			xls_download: 'https://example.com/c.xls',
		});
		await ExportConfig.updateExportConfig(testContext(), {
			mailbox_id: 101,
			id: 902,
			items: ['Phone'],
		});
		expect(lastCall()[1].url).toBe('/parser/101/export_config/902');
	});

	it('deleteExportConfig DELETE', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		expect(
			await ExportConfig.deleteExportConfig(testContext(), {
				mailbox_id: 101,
				id: 902,
			}),
		).toEqual({ success: true });
	});
});

describe('webhooks and bootstrap', () => {
	beforeEach(() => jest.clearAllMocks());

	it('createWebhook POST /webhook uses target', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 301,
			event: 'document.processed',
			target: 'https://example.com/hook',
			category: 'CUSTOM',
		});
		await Webhook.createWebhook(testContext(), {
			event: 'document.processed',
			target: 'https://example.com/hook',
		});
		expect(lastCall()[1].body).toEqual({
			event: 'document.processed',
			target: 'https://example.com/hook',
			category: 'CUSTOM',
		});
	});

	it('enableWebhook POST returns Parser', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 101,
			webhook_set: [
				{
					id: 301,
					event: 'document.processed',
					target: 'https://example.com/hook',
					category: 'CUSTOM',
				},
			],
		});
		const result = await Webhook.enableWebhook(testContext(), {
			mailbox_id: 101,
			id: 301,
		});
		expect(result.id).toBe(101);
	});

	it('disableWebhook DELETE webhook_set', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		expect(
			await Webhook.disableWebhook(testContext(), { mailbox_id: 101, id: 301 }),
		).toEqual({ success: true });
	});

	it('deleteWebhook DELETE /webhook/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		expect(await Webhook.deleteWebhook(testContext(), { id: 301 })).toEqual({
			success: true,
		});
	});

	it('listWebhooks GET /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 101,
			webhook_set: [],
			available_webhook_set: [],
		});
		const result = await Webhook.listWebhooks(testContext(), { id: 101 });
		expect(lastCall()[1].url).toBe('/parser/101');
		expect(result.webhook_set).toEqual([]);
	});

	it('getBootstrap GET /bootstrap official keys', async () => {
		mockRequest.mockResolvedValueOnce({
			choices: {},
			mappings: {},
			max_field_lengths: { email: 127 },
			email_domain: 'in.parseur.com',
			extra_fields: [],
			master_parser_set: [],
		});
		const result = await Bootstrap.getBootstrap(testContext(), {});
		expect(lastCall()[1].url).toBe('/bootstrap');
		expect(result.email_domain).toBe('in.parseur.com');
	});
});
