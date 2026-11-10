import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { EventbriteWebhookPayload } from './index';
import { eventbrite } from './index';
import { webhookDelivery, webhookTestDelivery } from './test-fixtures';
import { actionOf, notification, organizationIdOf } from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// never: the handler reads none of the context for these cases.
const ctx = {} as never;

/**
 * The matcher receives the *raw* request, which carries `body`; the handler
 * receives a `WebhookRequest` whose payload is that body, and processWebhook
 * normalises the headers before either sees them. A single fixture satisfies
 * both shapes.
 */
// unknown: a rejection test deliberately supplies a broken body.
function request(body: unknown) {
	const payload = body as EventbriteWebhookPayload;
	return {
		payload,
		body,
		headers: { 'content-type': 'application/json' },
		rawBody: JSON.stringify(body),
	};
}

describe('notification.match', () => {
	it('matches a delivery that carries an api_url', () => {
		expect(notification.match(request(webhookDelivery))).toBe(true);
	});

	it('matches a test delivery, which has no action but still an api_url', () => {
		expect(notification.match(request(webhookTestDelivery))).toBe(true);
	});

	it('does not match a body from another provider', () => {
		expect(notification.match(request({ type: 'email.sent', data: {} }))).toBe(
			false,
		);
	});

	it("does not claim another provider's body just because it has an api_url", () => {
		expect(
			notification.match(
				request({
					event_type: 'form_response',
					api_url: 'https://api.example.com/forms/abc/responses/1',
				}),
			),
		).toBe(false);
	});

	it.each([
		['another host', 'https://attacker.example/v3/orders/1/'],
		[
			'a host that only starts with the name',
			'https://www.eventbriteapi.com.attacker.example/v3/orders/1/',
		],
		[
			'a host that only ends with the name',
			'https://evileventbriteapi.com/v3/orders/1/',
		],
		['plain http', 'http://www.eventbriteapi.com/v3/orders/1/'],
		['a relative path', '/v3/orders/1/'],
	])('does not match an api_url on %s', (_label, apiUrl) => {
		// Callers read api_url back with the tenant's token, so a forged body
		// naming another host would send that token to the forger.
		expect(
			notification.match(request({ ...webhookDelivery, api_url: apiUrl })),
		).toBe(false);
	});

	it('matches the placeholder path the dashboard test delivery sends', () => {
		expect(
			notification.match(
				request({
					api_url:
						'https://www.eventbriteapi.com/{api-endpoint-to-fetch-object-details}/',
					config: { action: 'test' },
				}),
			),
		).toBe(true);
	});
});

describe('notification.handler', () => {
	it('returns the action and the organization id, not the changed object', async () => {
		const response = await notification.handler(ctx, request(webhookDelivery));

		expect(response.success).toBe(true);
		expect(response.data).toMatchObject({
			action: 'order.placed',
			organizationId: '154830740213',
			api_url: 'https://www.eventbriteapi.com/v3/orders/9876543210/',
		});
	});

	it('keeps a test delivery with a null action rather than rejecting it', async () => {
		const response = await notification.handler(
			ctx,
			request(webhookTestDelivery),
		);

		expect(response.success).toBe(true);
		expect(response.data).toMatchObject({ action: 'test' });
	});

	it('throws on a body with no api_url, so the delivery is not reported as accepted', async () => {
		// Returning `success: false` would be rewritten to a success by
		// processWebhook, so a refusal has to throw.
		await expect(
			notification.handler(
				ctx,
				request({ config: { action: 'event.created' } }),
			),
		).rejects.toThrow('Invalid Eventbrite webhook notification');
	});

	it('throws on an api_url that is not on eventbriteapi.com', async () => {
		await expect(
			notification.handler(
				ctx,
				request({
					...webhookDelivery,
					api_url: 'https://attacker.example/v3/orders/1/',
				}),
			),
		).rejects.toThrow('Invalid Eventbrite webhook notification');
	});

	it('throws on a bare string body', async () => {
		await expect(
			notification.handler(ctx, request('not json')),
		).rejects.toThrow('Invalid Eventbrite webhook notification');
	});
});

describe('derived fields', () => {
	it('reads config.action', () => {
		expect(actionOf(webhookDelivery)).toBe('order.placed');
		expect(actionOf({ api_url: 'https://example.com' })).toBeNull();
	});

	it('reads config.user_id, which is the organization id', () => {
		expect(organizationIdOf(webhookDelivery)).toBe('154830740213');
		expect(organizationIdOf(webhookTestDelivery)).toBeNull();
	});

	it('never reads the action from api_url, which only names the object', () => {
		// A refetch of api_url returns the order, which has no action field; the
		// action lives only in the delivery's config.
		expect(actionOf({ api_url: 'https://example.com/orders/1/' })).toBeNull();
	});
});

/**
 * The tests above call the handler directly, which is exactly the gap that let a
 * keyBuilder rejecting `source === 'webhook'` ship: the handler never ran
 * through the binding that resolves the key. These go through `processWebhook`
 * and the bound client instead, so a delivery has to survive that path.
 */
describe('a delivery through processWebhook', () => {
	async function createClient(withKey: boolean) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'eventbrite', 'default');
		const corsair = createCorsair({
			plugins: [
				eventbrite(withKey ? { key: 'eventbrite-webhook-test-key' } : {}),
			],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		if (withKey) await corsair.eventbrite.keys.issue_new_dek();
		return { corsair, testDb };
	}

	it('reaches the handler with no key configured at all', async () => {
		const { corsair, testDb } = await createClient(false);
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				webhookDelivery,
			);

			expect(result.plugin).toBe('eventbrite');
			expect(result.action).toBe('notifications.delivery');
			// The hook ran, so nothing threw while resolving a key.
			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('reaches the handler when a key is stored', async () => {
		const { corsair, testDb } = await createClient(true);
		try {
			await corsair.eventbrite.keys.set_api_key('stored-key');

			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				webhookDelivery,
			);

			expect(result.plugin).toBe('eventbrite');
			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('routes a delivery to the tenant named by config.user_id', async () => {
		const { corsair, testDb } = await createClient(true);
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				webhookDelivery,
			);

			// The matcher resolves this without a saved tenant link, so the
			// delivery does not land on the default tenant by accident.
			const match = corsair.eventbrite.pluginTenantWebhookMatcher?.({
				headers: {},
				body: webhookDelivery,
			});
			expect(match).toEqual({
				linkType: 'organization_id',
				externalId: '154830740213',
			});
			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves a delivery with a foreign api_url unclaimed', async () => {
		const { corsair, testDb } = await createClient(false);
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				{
					...webhookDelivery,
					api_url: 'https://attacker.example/v3/orders/1/',
				},
			);

			expect(result.plugin).toBeNull();
			expect(result.response).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a malformed delivery as a failure rather than a success', async () => {
		const { corsair, testDb } = await createClient(false);
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				{ config: { action: 'event.created' } },
			);

			// No api_url, so the plugin matcher declines and nobody claims it.
			expect(result.plugin).toBeNull();
			expect(result.response).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});
});
