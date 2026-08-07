import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeApiLabzRequest } from './client';
import { Airtable, Deals, Iban, Trello } from './endpoints';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	class ApiLabzAPIError extends Error {
		status?: number;
		retryAfter?: number;
		constructor(
			message: string,
			public code?: string,
			options?: { cause?: Error },
		) {
			super(message, options);
			this.name = 'ApiLabzAPIError';
		}
	}
	return {
		makeApiLabzRequest: jest.fn(),
		ApiLabzAPIError,
	};
});

const mockRequest = jest.mocked(makeApiLabzRequest);
const mockLog = jest.mocked(logEventFromContext);

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext() {
	return {
		key: 'test-api-key',
		options: {
			authType: 'api_key' as const,
		},
	};
}

describe('ApiLabz endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('iban.validate routes through hub module 113', async () => {
		mockRequest.mockResolvedValue({
			message: 'Module executed successfully',
			response: {
				iban: 'GB82WEST12345698765432',
				is_valid: true,
			},
		});
		const ctx = createContext();
		const input = { iban: 'GB82WEST12345698765432' };
		const result = await (Iban.validate as AnyEndpoint)(ctx, input);

		expect(mockRequest).toHaveBeenCalledWith('module/113', 'test-api-key', {
			method: 'POST',
			body: input,
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'apilabz.iban.validate',
			{ hasIban: true },
			'completed',
		);
		expect(result).toEqual({
			message: 'Module executed successfully',
			response: {
				iban: 'GB82WEST12345698765432',
				is_valid: true,
			},
		});
	});

	it('rejects invalid IBAN input', async () => {
		const ctx = createContext();
		await expect(
			(Iban.validate as AnyEndpoint)(ctx, { iban: 'x' }),
		).rejects.toThrow();
	});

	it('parses the API response before logging completion', async () => {
		mockRequest.mockResolvedValue(null as never);
		const ctx = createContext();
		await expect(
			(Iban.validate as AnyEndpoint)(ctx, {
				iban: 'GB82WEST12345698765432',
			}),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects deal input missing catalog fields', async () => {
		const ctx = createContext();
		await expect(
			(Deals.integrate as AnyEndpoint)(ctx, { deal: { id: '1' } }),
		).rejects.toThrow();
	});

	it.each([
		[
			'deals.integrate',
			Deals.integrate,
			{
				title: 'Acme',
				amount: 1000,
				dealId: 'deal-1',
				status: 'open',
			},
			'API_LABZ_INTEGRATE_DEAL',
		],
		[
			'airtable.listTables',
			Airtable.listTables,
			{ base_id: 'app123' },
			'API_LABZ_LIST_TABLES',
		],
		[
			'trello.aiSearchEngine',
			Trello.aiSearchEngine,
			{ query: 'bugs', limit: 5 },
			'API_LABZ_TRELLO_AI_SEARCH_ENGINE',
		],
	] as const)(
		'%s surfaces MODULE_UNAVAILABLE (no public hub module)',
		async (_name, fn, input, slug) => {
			const ctx = createContext();
			await expect((fn as AnyEndpoint)(ctx, input)).rejects.toThrow(slug);
			expect(mockRequest).not.toHaveBeenCalled();
			expect(mockLog).not.toHaveBeenCalled();
		},
	);
});

describe('ApiLabz error handlers', () => {
	function createMockApiError(
		status: number,
		message: string,
		retryAfter?: number,
	) {
		return new ApiError(
			{
				method: 'GET',
				url: '/test',
			},
			{
				url: '/test',
				ok: false,
				status,
				statusText: 'Error',
				body: null,
			},
			message,
			{ retryAfter },
		);
	}

	it('matches and handles rate limit errors', async () => {
		const rateLimitError = createMockApiError(429, 'rate_limited', 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('random'))).toBe(
			false,
		);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('matches and handles auth errors', async () => {
		const authError = createMockApiError(401, 'unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(authError)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('something else'))).toBe(
			false,
		);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches insufficient credits as permission errors', async () => {
		const creditError = createMockApiError(403, 'Insufficient credits');
		expect(errorHandlers.PERMISSION_ERROR.match(creditError)).toBe(true);
		await expect(errorHandlers.PERMISSION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
