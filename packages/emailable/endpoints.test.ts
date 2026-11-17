import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { EmailableContext } from './context';
import {
	createBatch,
	getAccount,
	getBatch,
	verifyEmail,
} from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

// Tables are jest mocks of the db client; their exact type doesn't matter here.
function context(key?: string, db?: Record<string, unknown>): EmailableContext {
	// A real database is present whenever tables are passed in.
	return {
		key,
		db,
		database: db ? {} : undefined,
	} as unknown as EmailableContext;
}

function table() {
	return { upsertByEntityId: jest.fn().mockResolvedValue(undefined) };
}

function call(n = 0) {
	return mockRequest.mock.calls[n]?.[1];
}

function apiError(req: Parameters<typeof request>[1], url: string) {
	return new ApiError(
		req,
		{
			url,
			ok: false,
			status: 402,
			statusText: 'Payment Required',
			body: { message: 'Insufficient credits' },
		},
		'Payment Required',
	);
}

// From the live API with the test key (11-17).
const VERIFICATION = {
	accept_all: false,
	did_you_mean: null,
	disposable: false,
	domain: 'example.com',
	duration: 0.4,
	email: 'deliverable@example.com',
	first_name: null,
	free: false,
	full_name: null,
	gender: null,
	last_name: null,
	mailbox_full: false,
	mx_record: 'mx.example.com',
	no_reply: false,
	reason: 'accepted_email',
	role: false,
	score: 100,
	smtp_provider: null,
	state: 'deliverable',
	tag: null,
	user: 'deliverable',
};

// Rejections are caught as `unknown` (what a promise rejects with) and then
// checked with instanceof ApiError before any field is read.
describe('emailable', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends the key as a Bearer header, not in the URL', async () => {
		mockRequest.mockResolvedValue({
			owner_email: 'owner@example.com',
			available_credits: 12,
		});
		const accounts = table();
		const result = await getAccount(context('sekrit', { accounts }), {});
		expect(result.account).toEqual({ id: 'account', availableCredits: 12 });
		expect(JSON.stringify(result)).not.toContain('owner@example.com');
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: 'Bearer sekrit',
		});
		expect(call()).toEqual({
			method: 'GET',
			url: '/v1/account',
			query: undefined,
		});
		expect(mockRequest.mock.calls[0]?.[2]).toBeUndefined();
		expect(accounts.upsertByEntityId).toHaveBeenCalledWith('account', {
			id: 'account',
			availableCredits: 12,
		});
	});

	it('returns the whole verification and stores only state, score and reason', async () => {
		mockRequest.mockResolvedValue({ ...VERIFICATION, first_name: 'Dee' });
		const verifications = table();
		const result = await verifyEmail(context(undefined, { verifications }), {
			email: 'deliverable@example.com',
			smtp: false,
			acceptAll: true,
			timeout: 3,
		});
		expect(call()).toEqual({
			method: 'GET',
			url: '/v1/verify',
			query: {
				email: 'deliverable@example.com',
				smtp: false,
				accept_all: true,
				timeout: 3,
			},
		});
		expect(result.pending).toBe(false);
		expect(result.verification?.disposable).toBe(false);
		expect(result.verification?.reason).toBe('accepted_email');
		expect(verifications.upsertByEntityId).toHaveBeenCalledWith(
			'deliverable@example.com',
			{
				id: 'deliverable@example.com',
				state: 'deliverable',
				score: 100,
				reason: 'accepted_email',
			},
		);
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'example.com',
		);
	});

	it('reports pending on HTTP 249 instead of a result', async () => {
		mockRequest.mockResolvedValue({
			message:
				'Your request is taking longer than normal. Please send your request again.',
		});
		const verifications = table();
		const result = await verifyEmail(context(undefined, { verifications }), {
			email: 'slow@example.com',
		});
		expect(result).toEqual({
			pending: true,
			message:
				'Your request is taking longer than normal. Please send your request again.',
		});
		expect(verifications.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('keeps the verified address out of a propagated error', async () => {
		const req = {
			method: 'GET' as const,
			url: '/v1/verify',
			query: { email: 'person@example.com' },
		};
		mockRequest.mockRejectedValue(
			apiError(
				req,
				'https://api.emailable.com/v1/verify?email=person%40example.com',
			),
		);
		const error = await verifyEmail(context(), {
			email: 'person@example.com',
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(402);
		expect(
			JSON.stringify({
				...(error as ApiError),
				message: (error as ApiError).message,
			}),
		).not.toContain('person');
	});

	it('creates a batch with options and keeps addresses out of errors', async () => {
		mockRequest.mockResolvedValueOnce({
			message: 'Batch successfully created.',
			id: '6afc45aa',
		});
		const batches = table();
		const result = await createBatch(context(undefined, { batches }), {
			emails: ['a@example.com', 'b@example.com'],
			url: 'https://example.com/hook',
			responseFields: ['email', 'state'],
			retries: false,
		});
		expect(call()).toEqual({
			method: 'POST',
			url: '/v1/batch',
			body: {
				emails: ['a@example.com', 'b@example.com'],
				url: 'https://example.com/hook',
				response_fields: 'email,state',
				retries: false,
			},
			mediaType: 'application/json',
		});
		expect(result.batch).toEqual({
			id: '6afc45aa',
			message: 'Batch successfully created.',
		});
		expect(JSON.stringify(result)).not.toContain('a@example.com');

		const req = {
			method: 'POST' as const,
			url: '/v1/batch',
			body: { emails: ['a@example.com'] },
		};
		mockRequest.mockRejectedValueOnce(
			apiError(req, 'https://api.emailable.com/v1/batch'),
		);
		const error = await createBatch(context(), {
			emails: ['a@example.com'],
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect(JSON.stringify((error as ApiError).request)).not.toContain(
			'a@example.com',
		);
	});

	it('reads a finished batch with results and counts', async () => {
		mockRequest.mockResolvedValue({
			emails: [
				{ email: 'deliverable@example.com', state: 'deliverable' },
				{ email: 'risky@example.com', state: 'risky' },
			],
			id: '6afc45aa',
			message: 'Batch verification completed.',
			reason_counts: { accepted_email: 1, low_deliverability: 1 },
			total_counts: {
				deliverable: 1,
				risky: 1,
				processed: 2,
				total: 2,
			},
		});
		const result = await getBatch(context(), { id: '6afc45aa', partial: true });
		expect(call()).toEqual({
			method: 'GET',
			url: '/v1/batch',
			query: { id: '6afc45aa', partial: true },
		});
		expect(result.batch).toMatchObject({
			id: '6afc45aa',
			done: true,
			processed: 2,
			total: 2,
			reasonCounts: { accepted_email: 1, low_deliverability: 1 },
		});
		expect(result.batch.emails).toHaveLength(2);
	});

	it('polls a running batch whose response has no id', async () => {
		mockRequest.mockResolvedValue({
			message: 'Your batch is being processed.',
			processed: 5,
			total: 10,
		});
		const result = await getBatch(context(), { id: '6afc45aa' });
		expect(result.batch).toEqual({
			id: '6afc45aa',
			message: 'Your batch is being processed.',
			processed: 5,
			total: 10,
			done: false,
			emails: undefined,
			downloadFile: undefined,
			totalCounts: undefined,
			reasonCounts: undefined,
		});
	});

	it('keeps polling while partial results arrive', async () => {
		mockRequest.mockResolvedValue({
			emails: [{ email: 'a@example.com', state: 'deliverable' }],
			id: '6afc45aa',
			message: 'Batch is verifying.',
			total_counts: { deliverable: 1, processed: 1, total: 2 },
		});
		const result = await getBatch(context(), { id: '6afc45aa', partial: true });
		expect(result.batch.done).toBe(false);
		expect(result.batch.processed).toBe(1);
		expect(result.batch.emails).toHaveLength(1);
	});

	it('keeps batch rows that have only the requested fields', async () => {
		mockRequest.mockResolvedValue({
			emails: [{ state: 'deliverable' }, { state: 'risky' }],
			id: '6afc45aa',
			total_counts: { processed: 2, total: 2 },
		});
		const result = await getBatch(context(), { id: '6afc45aa' });
		expect(result.batch.emails).toEqual([
			{ state: 'deliverable' },
			{ state: 'risky' },
		]);
		expect(result.batch.done).toBe(true);
	});

	it('always asks for email when responseFields are set', async () => {
		mockRequest.mockResolvedValue({ id: 'b1', message: 'ok' });
		await createBatch(context(), {
			emails: ['a@example.com'],
			responseFields: ['state'],
		});
		expect(call()?.body).toMatchObject({ response_fields: 'email,state' });
	});

	it('throws on a verify body with neither state nor message', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			verifyEmail(context(), { email: 'a@example.com' }),
		).rejects.toThrow('neither a state nor a message');
	});

	it('lets an HTTP 403 through as an ApiError with its status', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/account' },
			{
				url: 'https://api.emailable.com/v1/account',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { message: 'Invalid API key' },
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValue(error);
		const thrown = await getAccount(context(), {}).catch((e: unknown) => e);
		expect(thrown).toBeInstanceOf(ApiError);
		expect((thrown as ApiError).status).toBe(403);
	});
});
