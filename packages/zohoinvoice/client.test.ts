import { ApiError } from 'corsair/http';
import {
	makeZohoInvoiceRequest,
	ZohoInvoiceAPIError,
	zohoInvoiceApiBase,
	zohoInvoiceOAuthAuthUrl,
	zohoInvoiceOAuthTokenUrl,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const { request } = jest.requireMock('corsair/http') as {
	request: jest.Mock;
};

describe('Zoho Invoice client configuration', () => {
	it('builds API and OAuth URLs for each supported data center', () => {
		expect(zohoInvoiceApiBase('eu')).toBe('https://www.zohoapis.eu/invoice/v3');
		expect(zohoInvoiceOAuthAuthUrl('in')).toBe(
			'https://accounts.zoho.in/oauth/v2/auth',
		);
		expect(zohoInvoiceOAuthTokenUrl('au')).toBe(
			'https://accounts.zoho.com.au/oauth/v2/token',
		);
	});

	it('defaults to the US data center', () => {
		expect(zohoInvoiceApiBase()).toBe('https://www.zohoapis.com/invoice/v3');
	});
});

describe('Zoho Invoice client errors', () => {
	beforeEach(() => {
		request.mockReset();
	});

	it('forwards retryAfter from ApiError', async () => {
		request.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/contacts' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					ok: false,
					url: '/contacts',
					body: {},
				},
				'rate limited',
				{ retryAfter: 3000 },
			),
		);

		await expect(
			makeZohoInvoiceRequest('/contacts', 'tok', {
				organizationId: 'org-1',
			}),
		).rejects.toMatchObject({ retryAfter: 3000 });
	});

	it('exposes retryAfter to the rate-limit handler', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new ZohoInvoiceAPIError('slow down', 429, 44, 2500),
		);
		expect(result.headersRetryAfterMs).toBe(2500);
	});
});
