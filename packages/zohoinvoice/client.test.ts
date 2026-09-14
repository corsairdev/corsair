import {
	zohoInvoiceApiBase,
	zohoInvoiceOAuthAuthUrl,
	zohoInvoiceOAuthTokenUrl,
} from './client';

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
