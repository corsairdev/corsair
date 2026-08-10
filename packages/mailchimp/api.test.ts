import 'dotenv/config';

import { makeMailchimpRequest } from './client';
import type { MailchimpEndpointOutputs } from './endpoints/types';
import { MailchimpEndpointOutputSchemas } from './endpoints/types';
import { mailchimpDescribe, TEST_API_KEY } from './tests/utils';

// L2 — API type tests. Skipped unless MAILCHIMP_API_KEY is set. Each call's real
// response is validated against its zod output schema.
mailchimpDescribe('Mailchimp API type tests', () => {
	const key = TEST_API_KEY as string;

	it('account.ping returns a valid PingResponse', async () => {
		const res = await makeMailchimpRequest<
			MailchimpEndpointOutputs['accountPing']
		>('/ping', key, { method: 'GET' });
		MailchimpEndpointOutputSchemas.accountPing.parse(res);
	});

	it('account.root returns a valid RootResponse', async () => {
		const res = await makeMailchimpRequest<
			MailchimpEndpointOutputs['accountRoot']
		>('/', key, { method: 'GET' });
		MailchimpEndpointOutputSchemas.accountRoot.parse(res);
	});

	it('lists.list returns a valid collection', async () => {
		const res = await makeMailchimpRequest<
			MailchimpEndpointOutputs['listsList']
		>('/lists', key, { method: 'GET', query: { count: 5 } });
		MailchimpEndpointOutputSchemas.listsList.parse(res);
	});

	it('campaigns.list returns a valid collection', async () => {
		const res = await makeMailchimpRequest<
			MailchimpEndpointOutputs['campaignsList']
		>('/campaigns', key, { method: 'GET', query: { count: 5 } });
		MailchimpEndpointOutputSchemas.campaignsList.parse(res);
	});
});
