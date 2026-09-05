import 'dotenv/config';
import { makeWixRequest } from './client';
import { WixEndpointOutputSchemas } from './endpoints/types';

const TOKEN = process.env.WIX_API_KEY ?? process.env.WIX_ACCESS_TOKEN;
const SITE_ID = process.env.WIX_SITE_ID;
const describeLive = TOKEN ? describe : describe.skip;

function siteScope(): { siteId?: string } {
	return SITE_ID ? { siteId: SITE_ID } : {};
}

describeLive('Wix live API', () => {
	it('queryContacts returns a parseable response', async () => {
		const response = await makeWixRequest(
			'/contacts/v4/contacts/query',
			TOKEN as string,
			{
				method: 'POST',
				body: { query: { paging: { limit: 1, offset: 0 } } },
				...siteScope(),
			},
		);

		expect(response).toBeDefined();
		const parsed = WixEndpointOutputSchemas.queryContacts.parse(response);
		expect(parsed).toBeDefined();
	});

	it('getSiteProperties returns a parseable response', async () => {
		const response = await makeWixRequest(
			'/site-properties/v4/properties',
			TOKEN as string,
			{ method: 'GET', ...siteScope() },
		);

		expect(response).toBeDefined();
		const parsed = WixEndpointOutputSchemas.getSiteProperties.parse(response);
		expect(parsed).toBeDefined();
	});

	it('listCurrencies returns a parseable response', async () => {
		const response = await makeWixRequest(
			'/currency-converter/v1/currencies',
			TOKEN as string,
			{ method: 'GET', ...siteScope() },
		);

		expect(response).toBeDefined();
		const parsed = WixEndpointOutputSchemas.listCurrencies.parse(response);
		expect(parsed).toBeDefined();
	});

	it('searchProducts returns a parseable response', async () => {
		const response = await makeWixRequest(
			'/stores/v3/products/search',
			TOKEN as string,
			{
				method: 'POST',
				body: { query: { paging: { limit: 1, offset: 0 } } },
				...siteScope(),
			},
		);

		expect(response).toBeDefined();
		const parsed = WixEndpointOutputSchemas.searchProducts.parse(response);
		expect(parsed).toBeDefined();
	});

	it('getAppInstance returns a parseable response', async () => {
		const response = await makeWixRequest(
			'/apps/v1/instance',
			TOKEN as string,
			{ method: 'GET', ...siteScope() },
		);

		expect(response).toBeDefined();
		const parsed = WixEndpointOutputSchemas.getAppInstance.parse(response);
		expect(parsed).toBeDefined();
	});
});
