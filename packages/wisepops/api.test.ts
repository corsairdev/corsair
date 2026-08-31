import 'dotenv/config';
import { makeWisepopsRequest } from './client';
import type {
	ContactsGetResponse,
	DataPrivacyDeleteResponse,
	PerformanceGetResponse,
	WebhookCreateResponse,
	WebhookDeleteResponse,
} from './endpoints/types';
import { WisepopsEndpointOutputSchemas } from './endpoints/types';

const TEST_KEY = process.env.WISEPOPS_API_KEY;

const describeIf = TEST_KEY ? describe : describe.skip;

describeIf('Wisepops API Type Tests', () => {
	it('contactsGet returns correct type', async () => {
		const response = await makeWisepopsRequest<ContactsGetResponse>(
			'api2/contacts',
			TEST_KEY!,
			{ query: { page_size: 1 } },
		);
		WisepopsEndpointOutputSchemas.contactsGet.parse(response);
	});

	it('performanceGet returns correct type', async () => {
		const response = await makeWisepopsRequest<PerformanceGetResponse>(
			'api2/wisepops',
			TEST_KEY!,
			{ method: 'GET' },
		);
		WisepopsEndpointOutputSchemas.performanceGet.parse(response);
	});

	it.skip('webhookCreate and delete returns correct type', async () => {
		const createResponse = await makeWisepopsRequest<WebhookCreateResponse>(
			'api2/hooks',
			TEST_KEY!,
			{
				method: 'POST',
				body: { event: 'email', target_url: 'https://example.com/hook' },
			},
		);
		WisepopsEndpointOutputSchemas.webhookCreate.parse(createResponse);

		const deleteResponse = await makeWisepopsRequest<WebhookDeleteResponse>(
			'api2/hooks',
			TEST_KEY!,
			{ method: 'DELETE', query: { hook_id: createResponse.id } },
		);
		WisepopsEndpointOutputSchemas.webhookDelete.parse(deleteResponse);
	});

	it.skip('dataPrivacyDelete returns correct type', async () => {
		const response = await makeWisepopsRequest<DataPrivacyDeleteResponse>(
			'api2/data-privacy',
			TEST_KEY!,
			{ method: 'DELETE', body: { email: 'test@test.com' } },
		);
		WisepopsEndpointOutputSchemas.dataPrivacyDelete.parse(response);
	});
});
