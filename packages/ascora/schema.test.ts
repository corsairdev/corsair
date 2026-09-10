import { ApiError } from 'corsair/http';
import {
	AscoraAPIError,
	assertAscoraSuccess,
	makeAscoraRequest,
} from './client';
import { errorHandlers } from './error-handlers';
import { AscoraSchema } from './schema';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual(
		'corsair/http',
	) as typeof import('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

import { request } from 'corsair/http';

describe('Ascora schema', () => {
	it('declares a semver version', () => {
		expect(AscoraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official-labeled entities', () => {
		expect(Object.keys(AscoraSchema.entities).sort()).toEqual([
			'contacts',
			'customers',
			'inventoryCategories',
			'jobs',
			'kits',
			'labourRoles',
			'quotes',
			'supplierInvoices',
			'suppliers',
			'supplies',
		]);
	});
});

describe('makeAscoraRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends Auth header to api.ascora.com.au without Bearer token', async () => {
		(request as jest.Mock).mockResolvedValue({ success: true });
		await makeAscoraRequest('secret-key', '/Customers/Customers', {
			query: { PageSize: 1 },
		});
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.ascora.com.au',
				HEADERS: expect.objectContaining({ Auth: 'secret-key' }),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/Customers/Customers',
			}),
		);
		const config = (request as jest.Mock).mock.calls[0]?.[0];
		expect(config.TOKEN).toBeUndefined();
	});

	it('preserves ApiError status and retryAfter on 429', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/x' },
			{
				url: 'https://api.ascora.com.au/x',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 1500 },
		);
		(request as jest.Mock).mockRejectedValue(apiError);

		await expect(
			makeAscoraRequest('k', '/Customers/Customers'),
		).rejects.toMatchObject({
			name: 'AscoraAPIError',
			status: 429,
			retryAfter: 1500,
		});
	});
});

describe('error handlers', () => {
	it('retries 429 using Retry-After from AscoraAPIError', async () => {
		const error = new AscoraAPIError('Too Many Requests', 429);
		Object.assign(error, { retryAfter: 2000 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 2000,
		});
	});
});

describe('assertAscoraSuccess', () => {
	it('throws the official message when success is false', () => {
		expect(() =>
			assertAscoraSuccess({ success: false, message: 'QUOTE-NOT-FOUND' }),
		).toThrow('QUOTE-NOT-FOUND');
	});
});
