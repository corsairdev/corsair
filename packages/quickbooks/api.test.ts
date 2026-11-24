import { makeQuickBooksRequest } from './client';
import { QuickBooksEndpointOutputSchemas } from './endpoints/types';

const ACCESS_TOKEN = process.env.QUICKBOOKS_ACCESS_TOKEN;
const REALM_ID = process.env.QUICKBOOKS_REALM_ID;
const liveDescribe = ACCESS_TOKEN && REALM_ID ? describe : describe.skip;

if (!ACCESS_TOKEN || !REALM_ID) {
	console.warn(
		'Skipping QuickBooks live smoke test: set QUICKBOOKS_ACCESS_TOKEN and QUICKBOOKS_REALM_ID to enable it.',
	);
}

liveDescribe('QuickBooks read-only live API smoke test', () => {
	it('queries at most one Account and validates the QBO response envelope', async () => {
		if (!ACCESS_TOKEN || !REALM_ID) {
			throw new Error('Live test credentials disappeared after test discovery');
		}
		// unknown because the provider response is untrusted until the output schema parses it.
		const response = await makeQuickBooksRequest<unknown>(
			`company/${encodeURIComponent(REALM_ID)}/query`,
			ACCESS_TOKEN,
			{ query: { query: 'SELECT * FROM Account MAXRESULTS 1' } },
			process.env.QUICKBOOKS_ENVIRONMENT === 'sandbox'
				? 'sandbox'
				: 'production',
		);
		const parsed = QuickBooksEndpointOutputSchemas.accountsList.parse(response);
		expect(parsed.QueryResponse.Account?.length ?? 0).toBeLessThanOrEqual(1);
	});
});
