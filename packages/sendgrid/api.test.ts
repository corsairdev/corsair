import { makeSendGridRequest, SendGridAPIError } from './client';
import { contacts, lists, mail, senders, suppressions } from './endpoints';
import { runCatalogOp } from './endpoints/bind';
import { SENDGRID_OPS } from './endpoints/catalog';
import {
	SendGridEndpointInputSchemas,
	SendGridEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';

const TEST_API_KEY = process.env.SENDGRID_API_KEY;
const describeLive = TEST_API_KEY ? describe : describe.skip;

const fixtures: Record<string, Record<string, unknown>> = {
	empty: {},
	mailSend: {
		personalizations: [{ to: [{ email: 'recipient@example.com' }] }],
		from: { email: 'sender@example.com' },
		subject: 'Test Email',
		content: [{ type: 'text/plain', value: 'Hello' }],
	},
	batchId: { batch_id: 'batch-1' },
	scheduledSend: { batch_id: 'batch-1', status: 'pause' },
	scheduledSendUpdate: { batch_id: 'batch-1', status: 'cancel' },
	contactsAddOrUpdate: {
		contacts: [{ email: 'user@example.com', first_name: 'Jane' }],
	},
	id: { id: 'abc' },
	contactSearch: { query: "email LIKE '%@example.com'" },
	contactSearchEmails: { emails: ['user@example.com'] },
	idsQuery: { ids: 'id-1,id-2' },
	page: { page_size: 20, page_token: 'token123' },
	contactImport: { file_type: 'csv', field_mappings: ['email'] },
	contactExport: { file_type: 'csv' },
	listsCreate: { name: 'List 2' },
	idSample: { id: 'list-1', contact_sample: true },
	idName: { id: 'list-1', name: 'Renamed' },
	idDeleteContacts: { id: 'list-1', delete_contacts: false },
	idContactIds: { id: 'list-1', contact_ids: 'c1,c2' },
	segment: { name: 'Active', query_dsl: '{}' },
	segmentsList: {},
	idContactsSample: { id: 'seg-1' },
	segmentUpdate: { id: 'seg-1', name: 'Updated' },
	segmentRefresh: { id: 'seg-1', user_time_zone: 'America/Chicago' },
	fieldCreate: { name: 'plan', field_type: 'Text' },
	sendersGetAll: { limit: 10 },
	verifiedSender: {
		nickname: 'Primary',
		from_email: 'from@example.com',
	},
	verifiedSenderUpdate: { id: 10, nickname: 'Updated' },
	idNum: { id: 10 },
	senderIdentity: { nickname: 'Marketing' },
	templateCreate: { name: 'Welcome' },
	templatesList: { generations: 'dynamic' },
	templateVersion: { id: 'tmpl-1', name: 'v1', subject: 'Hi' },
	templateVersionId: { id: 'tmpl-1', version_id: 'ver-1' },
	templateVersionUpdate: {
		id: 'tmpl-1',
		version_id: 'ver-1',
		subject: 'Hello',
	},
	suppressionList: { limit: 10, offset: 0 },
	email: { email: 'b@example.com' },
	deleteSuppressions: { emails: ['b@example.com'] },
	recipientEmails: { recipient_emails: ['b@example.com'] },
	asmIdQuery: {},
	asmGroup: { name: 'Alerts', description: 'Product alerts' },
	asmGroupUpdate: { id: 1, name: 'Alerts' },
	asmGroupEmails: { id: 1, recipient_emails: ['b@example.com'] },
	idNumEmail: { id: 1, email: 'b@example.com' },
	stats: { start_date: '2026-01-01' },
	statsCategories: { start_date: '2026-01-01', categories: 'welcome' },
	apiKeyCreate: { name: 'dev' },
	limit: { limit: 10 },
	apiKeyUpdate: { id: 'key-1', name: 'dev-2' },
};

describe('SendGrid Endpoints Execution & Error Policies', () => {
	const mockCtx: Record<string, unknown> = {
		key: 'SG.test_api_key_123',
		authType: 'api_key',
		$getAccountId: async () => 'acc-123',
		db: {},
		database: {},
	};

	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	function mockResponse(
		status: number,
		data: unknown,
		headers: Record<string, string> = {},
	) {
		const bodyText = typeof data === 'string' ? data : JSON.stringify(data);
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 401 ? 'Unauthorized' : 'OK',
			headers: {
				get: (name: string) => {
					const key = name.toLowerCase();
					if (key === 'content-type') return 'application/json';
					for (const [header, value] of Object.entries(headers)) {
						if (header.toLowerCase() === key) return value;
					}
					return null;
				},
			},
			json: async () => (typeof data === 'object' ? data : { message: data }),
			text: async () => bodyText,
		};
	}

	it('covers 100 official v3 ops', () => {
		expect(SENDGRID_OPS).toHaveLength(100);
		expect(new Set(SENDGRID_OPS.map((op) => op.nested)).size).toBe(100);
	});

	it.each(SENDGRID_OPS)('$nested has schemas and a fixture', (op) => {
		const inputSchema =
			SendGridEndpointInputSchemas[
				op.key as keyof typeof SendGridEndpointInputSchemas
			];
		const outputSchema =
			SendGridEndpointOutputSchemas[
				op.key as keyof typeof SendGridEndpointOutputSchemas
			];
		expect(inputSchema).toBeDefined();
		expect(outputSchema).toBeDefined();
		expect(fixtures[op.inKind]).toBeDefined();
		inputSchema.parse(fixtures[op.inKind]);
	});

	it.each(SENDGRID_OPS)('$nested $method /v3/$path', async (op) => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(
				200,
				op.wrapArray
					? [
							{
								email: 'b@example.com',
								created: 1,
								reason: 'x',
								status: '5.0.0',
							},
						]
					: { ok: true },
				op.responseHeader ? { [op.responseHeader]: 'msg-1.filter' } : {},
			),
		);

		await runCatalogOp(mockCtx as never, op, fixtures[op.inKind]!);

		const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
		const called = (global.fetch as jest.Mock).mock.calls[0][1] as {
			method: string;
		};
		expect(called.method).toBe(op.method);
		expect(calledUrl).toContain('https://api.sendgrid.com/v3/');
		expect(calledUrl).toContain(op.path.split('/{')[0]!);
	});

	it('executes Mail.send and returns X-Message-Id', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(202, '', { 'X-Message-Id': 'msg-1.filter' }),
		);

		const res = await mail.send(mockCtx as never, fixtures.mailSend as never);

		expect(res.x_message_id).toBe('msg-1.filter');
		const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [
			string,
			{ method?: string; headers?: Headers | Record<string, string> },
		];
		expect(init.method).toBe('POST');
		const auth =
			init.headers instanceof Headers
				? init.headers.get('Authorization')
				: init.headers?.Authorization;
		expect(auth).toBe('Bearer SG.test_api_key_123');
	});

	it('executes Contacts.addOrUpdate endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(202, { job_id: 'job-123' }),
		);

		const res = await contacts.addOrUpdate(
			mockCtx as never,
			fixtures.contactsAddOrUpdate as never,
		);

		expect(res.job_id).toBe('job-123');
	});

	it('executes Lists.getAll with pagination query parameters', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				result: [{ id: 'l1', name: 'List 1', contact_count: 5 }],
			}),
		);

		const res = await lists.getAll(mockCtx as never, {
			page_size: 20,
			page_token: 'token123',
		});

		expect(res.result).toHaveLength(1);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.sendgrid.com/v3/marketing/lists?page_size=20&page_token=token123',
			expect.anything(),
		);
	});

	it('executes Lists.create endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(201, { id: 'l2', name: 'List 2', contact_count: 0 }),
		);

		const res = await lists.create(mockCtx as never, { name: 'List 2' });

		expect(res.id).toBe('l2');
	});

	it('executes Suppressions.getBounces endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, [
				{
					created: 100,
					email: 'b@example.com',
					reason: 'Hard bounce',
					status: '5.1.1',
				},
			]),
		);

		const res = await suppressions.getBounces(mockCtx as never, {
			start_time: 0,
			limit: 10,
			offset: 0,
		});

		expect(res.bounces).toHaveLength(1);
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('start_time=0'),
			expect.anything(),
		);
		expect(res.bounces[0]!.email).toBe('b@example.com');
	});

	it('executes Senders.getAll endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				results: [
					{
						id: 10,
						nickname: 'Primary',
						from_email: 's@example.com',
						verified: true,
					},
				],
			}),
		);

		const res = await senders.getAll(mockCtx as never, { limit: 10 });

		expect(res.results[0]!.verified).toBe(true);
	});

	it('preserves HTTP status on SendGridAPIError (401)', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(401, { errors: [{ message: 'Unauthorized' }] }),
		);

		await expect(
			makeSendGridRequest('mail/send', 'SG.key', { method: 'POST' }),
		).rejects.toMatchObject({
			name: 'SendGridAPIError',
			status: 401,
		});
	});

	it('classifies 429 as RATE_LIMIT_ERROR and honors Retry-After ms', async () => {
		const error = new SendGridAPIError(
			'Too Many Requests',
			undefined,
			429,
			undefined,
			45000,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const policy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(policy.maxRetries).toBe(3);
		expect(policy.headersRetryAfterMs).toBe(45000);
	});

	it('does not retry 429 in the HTTP client', async () => {
		(global.fetch as jest.Mock).mockResolvedValue(
			mockResponse(
				429,
				{ errors: [{ message: 'Too Many Requests' }] },
				{ 'Retry-After': '45' },
			),
		);

		await expect(
			makeSendGridRequest('mail/send', 'SG.key', { method: 'POST' }),
		).rejects.toMatchObject({
			name: 'SendGridAPIError',
			status: 429,
			retryAfter: 45000,
		});
		expect(global.fetch).toHaveBeenCalledTimes(1);
	});
});

describeLive('SendGrid live API', () => {
	it('senders.getAll matches VerifiedSenderResponse', async () => {
		const result = await makeSendGridRequest<{ results: unknown[] }>(
			'verified_senders',
			TEST_API_KEY!,
		);
		SendGridEndpointOutputSchemas.sendersGetAll.parse(result);
	});

	it('suppressions.getBounces returns bounce records', async () => {
		const result = await makeSendGridRequest<unknown>(
			'suppression/bounces',
			TEST_API_KEY!,
			{ query: { limit: 1 } },
		);
		const bounces = Array.isArray(result) ? result : [];
		SendGridEndpointOutputSchemas.suppressionsGetBounces.parse({ bounces });
	});

	it('lists.getAll matches marketing lists payload', async () => {
		const result = await makeSendGridRequest<unknown>(
			'marketing/lists',
			TEST_API_KEY!,
			{
				query: { page_size: 1 },
			},
		);
		SendGridEndpointOutputSchemas.listsGetAll.parse(result);
	});
});
