import { ApiError } from 'corsair/http';
import { makeSendGridRequest } from './client';
import { Contacts, Lists, Mail, Senders, Suppressions } from './endpoints';

describe('SendGrid Endpoints Execution & Error Policies', () => {
	const mockCtx: any = {
		key: 'SG.test_api_key_123',
		authType: 'api_key',
		$getAccountId: async () => 'acc-123',
		database: {},
	};

	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	function mockResponse(status: number, data: any) {
		const bodyText = typeof data === 'string' ? data : JSON.stringify(data);
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 401 ? 'Unauthorized' : 'OK',
			headers: {
				get: (name: string) => {
					if (name.toLowerCase() === 'content-type') return 'application/json';
					return null;
				},
			},
			json: async () => (typeof data === 'object' ? data : { message: data }),
			text: async () => bodyText,
		};
	}

	it('executes Mail.send endpoint with correct request formatting', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(202, {}));

		const res = await Mail.send(mockCtx, {
			personalizations: [{ to: [{ email: 'recipient@example.com' }] }],
			from: { email: 'sender@example.com' },
			subject: 'Test Email',
			content: [{ type: 'text/plain', value: 'Hello' }],
		});

		expect(res.success).toBe(true);
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
			pageSize: 20,
			pageToken: 'token123',
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

		const res = await Suppressions.getBounces(mockCtx, {});

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

		const res = await Senders.getAll(mockCtx, {});

		expect(res.results[0]!.verified).toBe(true);
	});

	it('preserves ApiError on HTTP error status (401)', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(401, { errors: [{ message: 'Unauthorized' }] }),
		);

		await expect(
			makeSendGridRequest('mail/send', 'SG.key', { method: 'POST' }),
		).rejects.toThrow(ApiError);
	});
});
