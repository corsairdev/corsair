import { makeSendGridRequest, SendGridAPIError } from './client';
import { Contacts, Lists, Mail, Senders, Suppressions } from './endpoints';
import { SendGridEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';

const TEST_API_KEY = process.env.SENDGRID_API_KEY;
const describeLive = TEST_API_KEY ? describe : describe.skip;

describe('SendGrid Endpoints Execution & Error Policies', () => {
	const mockCtx: any = {
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

	it('executes Mail.send and returns X-Message-Id', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(202, '', { 'X-Message-Id': 'msg-1.filter' }),
		);

		const res = await Mail.send(mockCtx, {
			personalizations: [{ to: [{ email: 'recipient@example.com' }] }],
			from: { email: 'sender@example.com' },
			subject: 'Test Email',
			content: [{ type: 'text/plain', value: 'Hello' }],
		});

		expect(res.x_message_id).toBe('msg-1.filter');
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.sendgrid.com/v3/mail/send',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('executes Contacts.addOrUpdate endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(202, { job_id: 'job-123' }),
		);

		const res = await Contacts.addOrUpdate(mockCtx, {
			contacts: [{ email: 'user@example.com', first_name: 'Jane' }],
		});

		expect(res.job_id).toBe('job-123');
	});

	it('executes Lists.getAll with pagination query parameters', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				result: [{ id: 'l1', name: 'List 1', contact_count: 5 }],
			}),
		);

		const res = await Lists.getAll(mockCtx, {
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

		const res = await Lists.create(mockCtx, { name: 'List 2' });

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

		const res = await Suppressions.getBounces(mockCtx, {
			limit: 10,
			offset: 0,
		});

		expect(res.bounces).toHaveLength(1);
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

		const res = await Senders.getAll(mockCtx, { limit: 10 });

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
