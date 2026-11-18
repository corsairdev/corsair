import { ApiError } from 'corsair/http';
import {
	makeZohoInvoiceRequest,
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

	it('lets ApiError through unchanged', async () => {
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
		).rejects.toBeInstanceOf(ApiError);
	});

	it('leaves 429 retries to core', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('uses accounts.zohocloud.ca for Canada and zohoapis.ca for its API', () => {
		expect(zohoInvoiceOAuthAuthUrl('ca')).toBe(
			'https://accounts.zohocloud.ca/oauth/v2/auth',
		);
		expect(zohoInvoiceApiBase('ca')).toBe('https://www.zohoapis.ca/invoice/v3');
	});
});
