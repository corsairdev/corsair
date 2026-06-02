import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type {
	WebhookManagementCreateResponse,
	WebhookManagementListEventsResponse,
	WebhookManagementListResponse,
} from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getFirstFormId, getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Webhook Management', () => {
	const key = getKey();
	let formId: string;
	const testUrl = 'https://httpbin.org/post';
	const cleanupWebhookIds: string[] = [];

	beforeAll(async () => {
		formId = await getFirstFormId(key);
	});

	afterAll(async () => {
		for (const id of cleanupWebhookIds) {
			await makeTallyRequest(`webhooks/${id}`, key, {
				method: 'DELETE',
			}).catch(() => {});
		}
	});

	it('webhookManagementList returns paginated list', async () => {
		const result = await makeTallyRequest<WebhookManagementListResponse>(
			'webhooks',
			key,
			{ method: 'GET', query: { page: 1, limit: 10 } },
		);
		TallyEndpointOutputSchemas.webhookManagementList.parse(result);
		expect(Array.isArray(result.webhooks)).toBe(true);
		expect(typeof result.totalCount).toBe('number');
		expect(typeof result.hasMore).toBe('boolean');
	});

	it('create webhook returns webhook object with correct fields', async () => {
		const created = await makeTallyRequest<WebhookManagementCreateResponse>(
			'webhooks',
			key,
			{
				method: 'POST',
				body: {
					formId,
					url: testUrl,
					eventTypes: ['FORM_RESPONSE'],
				},
			},
		);
		TallyEndpointOutputSchemas.webhookManagementCreate.parse(created);
		cleanupWebhookIds.push(created.id);

		expect(created.id).toBeTruthy();
		expect(created.url).toBe(testUrl);
		expect(created.eventTypes).toContain('FORM_RESPONSE');
		expect(created.isEnabled).toBe(true);
	});

	it('created webhook appears in list', async () => {
		const created = await makeTallyRequest<WebhookManagementCreateResponse>(
			'webhooks',
			key,
			{
				method: 'POST',
				body: {
					formId,
					url: `${testUrl}?t=${Date.now()}`,
					eventTypes: ['FORM_RESPONSE'],
				},
			},
		);
		cleanupWebhookIds.push(created.id);

		const list = await makeTallyRequest<WebhookManagementListResponse>(
			'webhooks',
			key,
			{ method: 'GET', query: { page: 1, limit: 100 } },
		);
		const found = list.webhooks.find((w) => w.id === created.id);
		expect(found).toBeDefined();
		expect(found?.url).toBe(created.url);
	});

	it('update webhook disables it', async () => {
		const created = await makeTallyRequest<WebhookManagementCreateResponse>(
			'webhooks',
			key,
			{
				method: 'POST',
				body: {
					formId,
					url: testUrl,
					eventTypes: ['FORM_RESPONSE'],
				},
			},
		);
		cleanupWebhookIds.push(created.id);
		expect(created.isEnabled).toBe(true);

		await makeTallyRequest(`webhooks/${created.id}`, key, {
			method: 'PATCH',
			body: {
				formId,
				url: testUrl,
				eventTypes: ['FORM_RESPONSE'],
				isEnabled: false,
			},
		});

		const list = await makeTallyRequest<WebhookManagementListResponse>(
			'webhooks',
			key,
			{ method: 'GET', query: { page: 1, limit: 100 } },
		);
		const updated = list.webhooks.find((w) => w.id === created.id);
		expect(updated?.isEnabled).toBe(false);
	});

	it('listEvents returns events array for webhook', async () => {
		const created = await makeTallyRequest<WebhookManagementCreateResponse>(
			'webhooks',
			key,
			{
				method: 'POST',
				body: {
					formId,
					url: testUrl,
					eventTypes: ['FORM_RESPONSE'],
				},
			},
		);
		cleanupWebhookIds.push(created.id);

		const events = await makeTallyRequest<WebhookManagementListEventsResponse>(
			`webhooks/${created.id}/events`,
			key,
			{ method: 'GET', query: { page: 1 } },
		);
		TallyEndpointOutputSchemas.webhookManagementListEvents.parse(events);
		expect(Array.isArray(events.events)).toBe(true);
	});

	it('delete webhook removes it from list', async () => {
		const created = await makeTallyRequest<WebhookManagementCreateResponse>(
			'webhooks',
			key,
			{
				method: 'POST',
				body: {
					formId,
					url: `${testUrl}?del=${Date.now()}`,
					eventTypes: ['FORM_RESPONSE'],
				},
			},
		);

		await makeTallyRequest(`webhooks/${created.id}`, key, {
			method: 'DELETE',
		});

		const list = await makeTallyRequest<WebhookManagementListResponse>(
			'webhooks',
			key,
			{ method: 'GET', query: { page: 1, limit: 100 } },
		);
		const found = list.webhooks.find((w) => w.id === created.id);
		expect(found).toBeUndefined();
	});

	it('create webhook with signingSecret succeeds without echoing secret', async () => {
		const created = await makeTallyRequest<WebhookManagementCreateResponse>(
			'webhooks',
			key,
			{
				method: 'POST',
				body: {
					formId,
					url: testUrl,
					eventTypes: ['FORM_RESPONSE'],
					signingSecret: 'my-test-secret-abc',
				},
			},
		);
		cleanupWebhookIds.push(created.id);
		expect(created.id).toBeTruthy();
		expect(created.url).toBe(testUrl);
	});

	it('delete non-existent webhook throws', async () => {
		await expect(
			makeTallyRequest('webhooks/nonexistent_wh_999', key, {
				method: 'DELETE',
			}),
		).rejects.toThrow();
	});
});
