import type { EventbriteWebhookPayload } from './index';
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
