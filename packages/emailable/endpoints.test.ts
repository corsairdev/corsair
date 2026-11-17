import { ApiError, request } from 'corsair/http';
import type { EmailableContext } from './context';
import {
	authorize,
	createBatch,
	getAccount,
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

function context(key?: string): EmailableContext {
	return { key } as unknown as EmailableContext;
}

describe('emailable', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores credits and sends the key as a query parameter', async () => {
		mockRequest.mockResolvedValue({
			owner_email: 'owner@example.com',
			available_credits: 12,
		});
		const result = await getAccount(context('sekrit'), {});
		expect(result.account).toEqual({ id: 'account', availableCredits: 12 });
		expect(JSON.stringify(result)).not.toContain('owner@example.com');
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/account',
			query: { api_key: 'sekrit' },
		});
	});

	it('stores a verification and drops the name', async () => {
		mockRequest.mockResolvedValue({
			email: 'person@example.com',
			state: 'deliverable',
			score: 100,
			reason: 'accepted_email',
			first_name: 'Secret',
		});
		const result = await verifyEmail(context('sekrit'), {
			email: 'person@example.com',
		});
		expect(result.verification).toEqual({
			id: 'person@example.com',
			state: 'deliverable',
			score: 100,
			reason: 'accepted_email',
		});
		expect(JSON.stringify(result)).not.toContain('Secret');
	});

	it('stores a batch id and does not return the address list', async () => {
		mockRequest.mockResolvedValue({
			id: 'batch1',
			message: 'Your batch is being processed.',
			emails: ['person@example.com'],
		});
		const result = await createBatch(context('sekrit'), {
			emails: ['person@example.com'],
		});
		expect(result.batch).toEqual({
			id: 'batch1',
			message: 'Your batch is being processed.',
		});
		expect(JSON.stringify(result)).not.toContain('person@example.com');
	});

	it('builds an authorize URL without calling the API', async () => {
		const result = await authorize(context(), {
			clientId: 'app1',
			redirectUri: 'https://example.com/callback',
		});
		expect(result.url).toContain('https://app.emailable.com/oauth/authorize');
		expect(result.url).toContain('client_id=app1');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 403 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/account' },
			{
				url: 'https://api.emailable.com/v1/account',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { message: 'Invalid API key or access token.' },
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getAccount(context(), {})).rejects.toBe(error);
	});
});
