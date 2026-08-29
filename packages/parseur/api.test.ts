import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { PARSEUR_API_BASE } from './client';
import {
	Bootstrap,
	Document,
	ExportConfig,
	Mailbox,
	Template,
	Webhook,
} from './endpoints';
import type { ParseurContext } from './index';
import { parseur } from './index';
import { DocumentWebhooks } from './webhooks';
import { matchParseurTenantWebhook } from './webhooks/tenant-matcher';
import {
	matchParseurPluginWebhook,
	verifyParseurWebhookSignature,
} from './webhooks/types';

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

describe('Parseur Plugin Structure & Metadata', () => {
	it('registers 29 operations, webhooks, and api_key auth', () => {
		const plugin = parseur();
		expect(plugin.id).toBe('parseur');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});

		const metaKeys = Object.keys(plugin.endpointMeta ?? {});
		expect(metaKeys.length).toBe(29);
		expect(metaKeys.sort()).toEqual([
			'bootstrap.getBootstrap',
			'documents.copyDocument',
			'documents.createEmailDocument',
			'documents.deleteDocument',
			'documents.getDocument',
			'documents.getDocumentLogs',
			'documents.listDocuments',
			'documents.processDocument',
			'documents.skipDocument',
			'documents.uploadDocument',
			'exportConfigs.createExportConfig',
			'exportConfigs.deleteExportConfig',
			'exportConfigs.listExportConfigs',
			'exportConfigs.updateExportConfig',
			'mailboxes.copyMailbox',
			'mailboxes.createMailbox',
			'mailboxes.deleteMailbox',
			'mailboxes.getMailbox',
			'mailboxes.getMailboxSchema',
			'mailboxes.listMailboxes',
			'mailboxes.updateMailbox',
			'templates.copyTemplate',
			'templates.deleteTemplate',
			'templates.getTemplate',
			'templates.listTemplates',
			'webhooks.createWebhook',
			'webhooks.deleteWebhook',
			'webhooks.disableWebhook',
			'webhooks.enableWebhook',
		]);
	});
});

describe('Mailbox Endpoints (7 Operations)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('1. listMailboxes: calls GET /parser with query params and Token auth', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 101, name: 'Mailbox 1', slug: 'mb-1' }],
		});

		const result = await Mailbox.listMailboxes(testContext(), {
			page: 1,
			page_size: 25,
			search: 'invoice',
			ordering: '-created',
		});

		const [config, req] = lastCall();
		expect(config.BASE).toBe(PARSEUR_API_BASE);
		expect(config.HEADERS?.Authorization).toBe('Token test-api-key');
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/parser');
		expect(req.query).toEqual({
			page: 1,
			page_size: 25,
			search: 'invoice',
			ordering: '-created',
		});
		expect(result.results.length).toBe(1);
		expect(result.results[0]?.name).toBe('Mailbox 1');
	});

	it('2. createMailbox: calls POST /parser with payload', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 102,
			name: 'Receipts Mailbox',
			description: 'Receipt parser',
		});

		const result = await Mailbox.createMailbox(testContext(), {
			name: 'Receipts Mailbox',
			description: 'Receipt parser',
		});

		const [config, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/parser');
		expect(req.body).toEqual({
			name: 'Receipts Mailbox',
			description: 'Receipt parser',
		});
		expect(result.id).toBe(102);
	});

	it('3. getMailbox: calls GET /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 101,
			name: 'Mailbox 1',
		});

		const result = await Mailbox.getMailbox(testContext(), { id: 101 });

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/parser/101');
		expect(result.name).toBe('Mailbox 1');
	});

	it('4. updateMailbox: calls PUT /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 101,
			name: 'Updated Name',
		});

		const result = await Mailbox.updateMailbox(testContext(), {
			id: 101,
			name: 'Updated Name',
		});

		const [, req] = lastCall();
		expect(req.method).toBe('PUT');
		expect(req.url).toBe('/parser/101');
		expect(req.body).toEqual({ name: 'Updated Name' });
		expect(result.name).toBe('Updated Name');
	});

	it('5. deleteMailbox: calls DELETE /parser/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Mailbox.deleteMailbox(testContext(), { id: 101 });

		const [, req] = lastCall();
		expect(req.method).toBe('DELETE');
		expect(req.url).toBe('/parser/101');
		expect(result).toEqual({ success: true });
	});

	it('6. getMailboxSchema: calls GET /parser/{id}/schema', async () => {
		mockRequest.mockResolvedValueOnce([
			{ name: 'TotalAmount', format: 'number' },
			{ name: 'Vendor', format: 'text' },
		]);

		const result = await Mailbox.getMailboxSchema(testContext(), { id: 101 });

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/parser/101/schema');
		expect(Array.isArray(result)).toBe(true);
	});

	it('7. copyMailbox: calls POST /parser/{id}/copy', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 103,
			name: 'Cloned Mailbox',
		});

		const result = await Mailbox.copyMailbox(testContext(), {
			id: 101,
			name: 'Cloned Mailbox',
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/parser/101/copy');
		expect(req.body).toEqual({ name: 'Cloned Mailbox' });
		expect(result.id).toBe(103);
	});
});

describe('Document Endpoints (9 Operations)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('8. listDocuments: calls GET /parser/{id}/document_set', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 501, name: 'doc.pdf', status: 'PROCESSED' }],
		});

		const result = await Document.listDocuments(testContext(), {
			id: 101,
			status: 'PROCESSED',
			with_result: true,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/parser/101/document_set');
		expect(result.results.length).toBe(1);
		expect(result.results[0]?.status).toBe('PROCESSED');
	});

	it('9. getDocument: calls GET /document/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 501,
			name: 'invoice.pdf',
			status: 'PROCESSED',
			result: { Amount: 100 },
		});

		const result = await Document.getDocument(testContext(), { id: 501 });

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/document/501');
		expect(result.id).toBe(501);
		expect(result.result).toEqual({ Amount: 100 });
	});

	it('10. deleteDocument: calls DELETE /document/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Document.deleteDocument(testContext(), { id: 501 });

		const [, req] = lastCall();
		expect(req.method).toBe('DELETE');
		expect(req.url).toBe('/document/501');
		expect(result).toEqual({ success: true });
	});

	it('11. getDocumentLogs: calls GET /document/{id}/log_set', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 1, message: 'Processing started', status: 'OK' }],
		});

		const result = await Document.getDocumentLogs(testContext(), { id: 501 });

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/document/501/log_set');
		expect(result.results.length).toBe(1);
	});

	it('12. uploadDocument: calls POST /parser/{id}/upload via multipart/form-data', async () => {
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

			expect(global.fetch).toHaveBeenCalled();
			const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
			expect(url).toBe(`${PARSEUR_API_BASE}/parser/101/upload`);
			expect(options.method).toBe('POST');
			expect(options.headers?.Authorization).toBe('Token test-api-key');
			expect(options.body).toBeInstanceOf(FormData);
			expect(result.message).toBe('OK');
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('13. createEmailDocument: calls POST /email', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 503,
			name: 'Email Receipt',
			status: 'NEW',
		});

		const result = await Document.createEmailDocument(testContext(), {
			parser_id: 101,
			subject: 'Receipt Order',
			body: 'Order #1234',
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/email');
		expect(result.id).toBe(503);
	});

	it('14. processDocument: calls POST /document/{id}/process', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 501,
			status: 'IN_PROCESS',
		});

		const result = await Document.processDocument(testContext(), { id: 501 });

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/document/501/process');
		expect(result.status).toBe('IN_PROCESS');
	});

	it('15. skipDocument: calls POST /document/{id}/skip', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 501,
			status: 'SKIPPED',
		});

		const result = await Document.skipDocument(testContext(), { id: 501 });

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/document/501/skip');
		expect(result.status).toBe('SKIPPED');
	});

	it('16. copyDocument: calls POST /document/{id}/copy/{target_mailbox_id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 504,
			name: 'Copied Doc',
			parser: 202,
		});

		const result = await Document.copyDocument(testContext(), {
			id: 501,
			target_mailbox_id: 202,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/document/501/copy/202');
		expect(result.id).toBe(504);
	});
});

describe('Template Endpoints (4 Operations)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('17. listTemplates: calls GET /parser/{id}/template_set', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 801, name: 'Template 1', parser: 101 }],
		});

		const result = await Template.listTemplates(testContext(), { id: 101 });

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/parser/101/template_set');
		expect(result.results.length).toBe(1);
	});

	it('18. getTemplate: calls GET /template/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 801,
			name: 'Template 1',
		});

		const result = await Template.getTemplate(testContext(), { id: 801 });

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/template/801');
		expect(result.id).toBe(801);
	});

	it('19. deleteTemplate: calls DELETE /template/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Template.deleteTemplate(testContext(), { id: 801 });

		const [, req] = lastCall();
		expect(req.method).toBe('DELETE');
		expect(req.url).toBe('/template/801');
		expect(result).toEqual({ success: true });
	});

	it('20. copyTemplate: calls POST /template/{id}/copy/{target_mailbox_id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 802,
			name: 'Copied Template',
			parser: 202,
		});

		const result = await Template.copyTemplate(testContext(), {
			id: 801,
			target_mailbox_id: 202,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/template/801/copy/202');
		expect(result.id).toBe(802);
	});
});

describe('Export Config Endpoints (4 Operations)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('21. listExportConfigs: calls GET /parser/{id}/export_config', async () => {
		mockRequest.mockResolvedValueOnce({
			count: 1,
			results: [{ id: 901, name: 'CSV Download', format: 'csv' }],
		});

		const result = await ExportConfig.listExportConfigs(testContext(), {
			id: 101,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/parser/101/export_config');
		expect(result.results.length).toBe(1);
	});

	it('22. createExportConfig: calls POST /parser/{id}/export_config', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 902,
			name: 'JSON Export',
			format: 'json',
		});

		const result = await ExportConfig.createExportConfig(testContext(), {
			id: 101,
			name: 'JSON Export',
			format: 'json',
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/parser/101/export_config');
		expect(req.body).toEqual({ name: 'JSON Export', format: 'json' });
		expect(result.id).toBe(902);
	});

	it('23. updateExportConfig: calls PATCH /parser/{mailbox_id}/export_config/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 902,
			name: 'Updated Export',
			format: 'json',
		});

		const result = await ExportConfig.updateExportConfig(testContext(), {
			mailbox_id: 101,
			id: 902,
			name: 'Updated Export',
		});

		const [, req] = lastCall();
		expect(req.method).toBe('PATCH');
		expect(req.url).toBe('/parser/101/export_config/902');
		expect(req.body).toEqual({ name: 'Updated Export' });
		expect(result.name).toBe('Updated Export');
	});

	it('24. deleteExportConfig: calls DELETE /parser/{mailbox_id}/export_config/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await ExportConfig.deleteExportConfig(testContext(), {
			mailbox_id: 101,
			id: 902,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('DELETE');
		expect(req.url).toBe('/parser/101/export_config/902');
		expect(result).toEqual({ success: true });
	});
});

describe('Webhook Management Endpoints (4 Operations)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('25. createWebhook: calls POST /webhook', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 301,
			target_url: 'https://example.com/webhook',
			event: 'document.processed',
		});

		const result = await Webhook.createWebhook(testContext(), {
			target_url: 'https://example.com/webhook',
			event: 'document.processed',
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/webhook');
		expect(result.id).toBe(301);
	});

	it('26. enableWebhook: calls POST /parser/{mailbox_id}/webhook_set/{id}', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 301,
			parser: 101,
		});

		const result = await Webhook.enableWebhook(testContext(), {
			mailbox_id: 101,
			id: 301,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('POST');
		expect(req.url).toBe('/parser/101/webhook_set/301');
		expect(result).toBeDefined();
	});

	it('27. disableWebhook: calls DELETE /parser/{mailbox_id}/webhook_set/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Webhook.disableWebhook(testContext(), {
			mailbox_id: 101,
			id: 301,
		});

		const [, req] = lastCall();
		expect(req.method).toBe('DELETE');
		expect(req.url).toBe('/parser/101/webhook_set/301');
		expect(result).toEqual({ success: true });
	});

	it('28. deleteWebhook: calls DELETE /webhook/{id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Webhook.deleteWebhook(testContext(), { id: 301 });

		const [, req] = lastCall();
		expect(req.method).toBe('DELETE');
		expect(req.url).toBe('/webhook/301');
		expect(result).toEqual({ success: true });
	});
});

describe('Bootstrap Endpoint (1 Operation)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('29. getBootstrap: calls GET /bootstrap', async () => {
		mockRequest.mockResolvedValueOnce({
			user: { email: 'satirical@example.com' },
			account: { name: 'Account 1' },
			mailboxes: [{ id: 101, name: 'Mailbox 1' }],
		});

		const result = await Bootstrap.getBootstrap(testContext(), {});

		const [, req] = lastCall();
		expect(req.method).toBe('GET');
		expect(req.url).toBe('/bootstrap');
		expect(result.mailboxes?.length).toBe(1);
	});
});

describe('Webhook Matchers & Handlers', () => {
	it('matches plugin and tenant webhook requests correctly', () => {
		const rawReq = {
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				event: 'document.processed',
				parser_id: 'mb_100',
				document: { id: 1 },
			}),
		};

		expect(matchParseurPluginWebhook(rawReq)).toBe(true);
		expect(matchParseurTenantWebhook(rawReq)).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'mb_100',
		});
	});

	it('handles documentProcessed event', async () => {
		const webhookCtx = testContext();
		const result = await DocumentWebhooks.documentProcessed.handler(
			webhookCtx,
			{
				headers: { 'x-webhook-secret': 'test-api-key' },
				payload: {
					event: 'document.processed',
					result: { Field1: 'Val1' },
				},
			} as any,
		);

		expect(result.success).toBe(true);
	});

	describe('verifyParseurWebhookSignature', () => {
		it('returns valid when token matches x-webhook-secret', () => {
			const res = verifyParseurWebhookSignature(
				{
					headers: { 'x-webhook-secret': 'my-secret-123' },
					body: {},
				} as any,
				'my-secret-123',
			);
			expect(res.valid).toBe(true);
		});

		it('returns valid when token matches Authorization: Bearer <secret>', () => {
			const res = verifyParseurWebhookSignature(
				{
					headers: { authorization: 'Bearer my-secret-123' },
					body: {},
				} as any,
				'my-secret-123',
			);
			expect(res.valid).toBe(true);
		});

		it('returns invalid when secret is missing or mismatch', () => {
			const missingSecret = verifyParseurWebhookSignature(
				{
					headers: { 'x-webhook-secret': 'my-secret-123' },
					body: {},
				} as any,
				undefined,
			);
			expect(missingSecret.valid).toBe(false);

			const mismatch = verifyParseurWebhookSignature(
				{
					headers: { 'x-webhook-secret': 'wrong-secret' },
					body: {},
				} as any,
				'my-secret-123',
			);
			expect(mismatch.valid).toBe(false);

			const missingHeader = verifyParseurWebhookSignature(
				{
					headers: {},
					body: {},
				} as any,
				'my-secret-123',
			);
			expect(missingHeader.valid).toBe(false);
		});
	});
});
